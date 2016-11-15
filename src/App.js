import React, { Component } from 'react';
import { HomrDataService } from './HomrDataService.js';
import './App.css';
import { HomrNav } from './HomrNav.js';
import { HomrStatusView } from './HomrStatusView.js';
import { HomrConfigView } from './HomrConfigView.js';
import { HomrErrorView } from './HomrErrorView.js';
import { HomrMonitorView } from './HomrMonitorView.js';
import 'dateformat';

var dateFormat = require('dateformat');

const VERSION = "1.0-beta";

export default class App extends Component {

  constructor(props) {
    super(props);
    this.handleNavEvent = this.handleNavEvent.bind(this);
    this.renderCount = 0;
  }

  pushSuccessMessage(txt) {
    this.pushMessage(txt, "success");
  }
  pushInfoMessage(txt) {
    this.pushMessage(txt, "info");
  }
  pushWarningMessage(txt) {
    this.pushMessage(txt, "warning");
  }
  pushDangerMessage(txt) {
    this.pushMessage(txt, "danger");
  }

  pushMessage(txt, type) {
    var st = this.state;
    if(st !== null) {
      st.messages.push({
        text: txt,
        type: type,
        time: new Date().getTime()
      });
      this.setState(st);
      if(st.messages.length > 0 && this.timer === undefined) {
        this.timer = setInterval(() => this.onTimer(), 1000);
      }

    }
  }

  componentWillMount() {
    this.resetState();
  }
  componentDidMount() {
    this.dataServ = new HomrDataService(
      (data, topic) => {
        this.processMessage(data, topic);
      }
    );
    var hmrLocalConfig = window.localStorage.hmrLocalConfig;

    if(hmrLocalConfig !== undefined) {
      var localConfig = JSON.parse(window.localStorage.hmrLocalConfig);
      this.loadConfig(localConfig.configUrl);
    }
    else {
      this.pushWarningMessage("No Configuration found on this device");
    }

  }
  componentWillUnmount() {
    if(this.timer !== undefined) {
      clearInterval(this.timer);
    }
  }


  onTimer() {
    var tm = new Date().getTime();
    var st = this.state;
    var mess = st.messages;
    var newMess = [];
    for(var i=0; i < mess.length; i++) {
      var m = mess[i];
      if(m.time > tm - 5000) {
        newMess.push(m);
      }
    }
    st.messages = newMess;
    this.setState(st);

    if(newMess.length === 0) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  resetState() {
    this.setState({
      currentViewKey: "configview",
      startTime: new Date(),
      lastMsg: new Date(0),
      received: 0,
      sent: 0,
      data: {},
      dataMap: {},
      allDataMap: {},
      messages: []
    });
  }

  onConfigLoaded(data) {
    console.log("config loaded");
    this.resetState();
    var st = this.state;
    st.data = data;
    var first = true;

    this.config = data.config;

    var prefix = data.config.statusprefix;
    for(var viewKey in st.data.views) {
      if(st.data.views.hasOwnProperty(viewKey)) {
        var view = st.data.views[viewKey];
        view.id = viewKey;
        if(first) {
          st.currentViewKey = viewKey;
          first = false;
        }
        for(var r=0; r < view.rows.length; r++) {
          var row = view.rows[r];
          for(var c=0; c < row.cols.length; c++) {
            var col = row.cols[c];
            col.waiting = 1;
            var key = prefix + viewKey + "/" + col.id;
            st.dataMap[key] = col;
          }
        }
      }
    }
    this.setState(st);

    console.log("start collecting");
    this.collecting = true;
    this.bufferedDataMap = {};

    this.dataServ.mqttConnect(data.config);

    setTimeout(() => {
      this.processCollectEnd();
    }, 5000);
  }

  processCollectEnd() {
    console.log("process end collecting");
    var st = this.state;
    this.collecting = false;
    var buf = this.bufferedDataMap;
    for(var k in buf) {
      if(buf.hasOwnProperty(k)) {
        this.messageToState(st, buf[k], k);
      }
    }
    this.setState(st);
    this.dataServ.sendRawMessage(this.config.clientid + "/connected", "2");

    console.log("collecting ended");
  }

  processMessage(data, topic) {
    if(this.collecting) {
      this.bufferedDataMap[topic] = data;
    }
    else {
      var st = this.state;
      st.received++;
      st.lastMsg = new Date();
      this.messageToState(st, data, topic);
      this.setState(st);
    }

  }

  messageToState(st, data, topic) {
    var col = st.dataMap[topic];
    st.allDataMap[topic] = data;
    if(col !== undefined) {
      for(var k in data) {
        if(data.hasOwnProperty(k)) {
          col[k] = data[k];
        }
      }
      col.waiting = 0;
    }
  }

  getViewData(key) {
    return this.state.views[key];
  }


  handleNavEvent(eventKey) {
    var st = this.state;
    st.currentViewKey = eventKey;
    this.setState(st);
  }

  onAction(event, homrId, payload) {
    var st = this.state;
    var ds = this.dataServ;
    var topic = st.data.config.setprefix + homrId;
    var key = st.data.config.statusprefix + homrId;
    var col = st.dataMap[key];
    if(col !== undefined) {
      col.waiting = 1;
    }
    payload.ts = new Date().getTime();
    ds.sendMessage(topic, payload);
    st.sent++;
    st.lastMsg = new Date();
    this.setState(st);
  }

  saveConfig(localConfig) {
    console.log("saveConfig");
    window.localStorage.hmrLocalConfig = JSON.stringify(localConfig);
    this.loadConfig(localConfig.configUrl);
  }

  loadConfig(configUrl) {
    this.dataServ.loadConfig(configUrl).then((data) => {
      this.onConfigLoaded(data);
      this.pushSuccessMessage("Configuration succesfully loaded");
    }).catch((err) => {
      console.log(err);
      this.resetState();
      this.pushDangerMessage("Configuration load failed");
    });
  }

  handleRemoveMessage(key) {
    var st = this.state;
    this.dataServ.removeMessage(key);

    st.allDataMap[key] = undefined;
    st.dataMap[key] = undefined;

    this.setState(st);
  }

  render() {
    var view = <div />;
    var views = {};
    var messages = [];
    var info = {
      version: VERSION,
      clientid: "",
      received: 0,
      sent: 0,
      rate: 0,
      lastMsg: ""
    };

    var rc = this.renderCount + 1;
    this.renderCount = rc;
    var st = this.state;
    if(st !== null) {
      var hmrLocalConfig = window.localStorage.hmrLocalConfig;
      var lc;
      var now = new Date().getTime();
      info.rate = Math.floor(st.received / ((now - st.startTime.getTime()) / 60000));
      info.received = st.received;
      info.sent = st.sent;
      if(this.config !== undefined) {
        info.clientid = this.config.clientid;
      }
      info.lastMsg = dateFormat(st.lastMsg, "HH:MM:ss");

      if(hmrLocalConfig !== undefined) {
        lc = JSON.parse(hmrLocalConfig);
      }
      messages = this.state.messages;
      var key = this.state.currentViewKey;
      var data = this.state.data;
      views = data.views;
      if(key === "configview") {
        view = <HomrConfigView key={key} localConfig={lc} onSaveConfig={this.saveConfig.bind(this)}/>;
      }
      else if(key === "monitorview") {
        view = <HomrMonitorView key={key}
        allDataMap={this.state.allDataMap}
        onRemoveMessage={this.handleRemoveMessage.bind(this)} />;
      }
      else {
        var viewKey = "view_" + key;
        view = <HomrStatusView key={viewKey} viewData={views[key]} defaults={data.defaults} onAction={this.onAction.bind(this)}/>;
      }
    }

    return (
      <div className="App">
        <HomrNav viewsData={views}
          monitor={true}
          handleNavEvent={this.handleNavEvent}
          statusInfo={info}/>
        <HomrErrorView messages={messages} />
        {view}
      </div>
    );
  }
}
