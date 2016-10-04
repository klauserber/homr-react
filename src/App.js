import React, { Component } from 'react';
import { HomrDataService } from './HomrDataService.js';
import './App.css';
import { HomrNav } from './HomrNav.js';
import { HomrStatusView } from './HomrStatusView.js';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.handleNavEvent = this.handleNavEvent.bind(this);
    this.dataServ = new HomrDataService(
      (data, topic) => {
        this.processMessage(data, topic);
      }
    );
  }

  componentDidMount() {
    var st = {
      currentViewKey: "main",
      data: this.dataServ.data,
      dataMap: {}
    };
    var prefix = this.dataServ.config.statusprefix;
    for(var viewKey in st.data.views) {
      var view = st.data.views[viewKey];
      for(var r=0; r < view.rows.length; r++) {
        var row = view.rows[r];
        for(var c=0; c < row.length; c++) {
          var col = row[c];
          var key = prefix + viewKey + "/" + col.id;
          st.dataMap[key] = col;
        }
      }
    }

    this.setState(st);
    this.dataServ.mqttConnect();
  }

  processMessage(data, topic) {
    console.log(data.text);
    var st = this.state;

    var col = st.dataMap[topic];
    if(col !== undefined) {
      for(var k in data) {
        col[k] = data[k];
      }
    }
    this.setState(st);
  }

  getViewData(key) {
    return this.state.views[key];
  }


  handleNavEvent(eventKey) {
    /*console.log(eventKey);
    console.log(event.target);
    console.log(this);*/

    var st = this.state;
    st.currentViewKey = eventKey;
    this.setState(st);

    /*switch (viewConf.type) {
      case "monitor":
        currentState.currentView = <HomrMonitorView viewConf={viewConf} />
        break;
      case "config":
        currentState.currentView = <HomrConfigurationView viewConf={viewConf} />
        break;
      default:
        currentState.currentView = <HomrStatusView viewData={viewData} />
    }*/

  }

  render() {
    var view = <div />;
    var views = {};
    if(this.state !== null) {
      var key = this.state.currentViewKey;
      var data = this.state.data;
      views = data.views;
      view = <HomrStatusView viewData={views[key]} defaults={data.defaults} />;
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


/*class HomrMonitorView extends Component {

  render() {
    return (<p>{this.props.viewConf.title}</p>);
  }
}*/
