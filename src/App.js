import React, { Component } from 'react';
import { HomrDataService } from './HomrDataService.js';
import './App.css';
import { HomrNav } from './HomrNav.js';
import { HomrStatusView } from './HomrStatusView.js';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.handleNavEvent = this.handleNavEvent.bind(this);
  }


  componentDidMount() {
    this.dataServ = new HomrDataService(
      (data, topic) => {
        this.processMessage(data, topic);
      }
    );
    this.dataServ.loadConfig().then((data) => {
      this.onConfigLoaded(data);
    });

  }

  onConfigLoaded(data) {
    console.log("config loaded");
    console.log(data);
    var st = {
      currentViewKey: "main",
      data: data,
      dataMap: {}
    };
    var prefix = data.config.statusprefix;
    for(var viewKey in st.data.views) {
      if(st.data.views.hasOwnProperty(viewKey)) {
        var view = st.data.views[viewKey];
        view.id = viewKey;
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
    this.dataServ.mqttConnect(data.config);
  }

  processMessage(data, topic) {
    //console.log(data.val);
    var st = this.state;

    var col = st.dataMap[topic];
    if(col !== undefined) {
      for(var k in data) {
        if(data.hasOwnProperty(k)) {
          col[k] = data[k];
        }
      }
      col.waiting = 0;
    }
    this.setState(st);
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
    this.setState(st);
  }

  render() {
    var view = <div />;
    var views = {};
    if(this.state !== null) {
      var key = this.state.currentViewKey;
      var data = this.state.data;
      views = data.views;
      var viewKey = "view_" + key;
      view = <HomrStatusView key={viewKey} viewData={views[key]} defaults={data.defaults} onAction={this.onAction.bind(this)}/>;
    }

    return (
      <div className="App">
        <HomrNav viewsData={views}
          handleNavEvent={this.handleNavEvent}></HomrNav>
        {view}
      </div>
    );
  }
}
