import React, { Component } from 'react';
import { HomrDataService } from './HomrDataService.js';
import './App.css';
import { HomrNav } from './HomrNav.js';
import { HomrConfigurationView } from './HomrConfigurationView.js';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.handleNavEvent = this.handleNavEvent.bind(this);
    this.dataServ = new HomrDataService();
  }

  componentDidMount() {
    this.setState({});
  }


  handleNavEvent(eventKey, event) {
    /*console.log(eventKey);
    console.log(event.target);
    console.log(this);*/

    var currentState = this.state;

    var viewConf = this.dataServ.getViewConfig(eventKey);
    switch (viewConf.type) {
      case "monitor":
        currentState.currentView = <HomrMonitorView viewConf={viewConf} />
        break;
      case "config":
        currentState.currentView = <HomrConfigurationView viewConf={viewConf} />
        break;
      default:
        currentState.currentView = <HomrStatusView viewConf={viewConf} />
    }
    this.setState(currentState);

  }

  render() {
    var view = this.state !== null ? this.state.currentView : null;
    if(view == null) {
      view = <HomrStatusView viewConf={this.dataServ.getViewConfig("mainView")}
              handleNavEvent={this.handleNavEvent}/>;
    }

    return (
      <div className="App">
        <HomrNav viewConfigs={this.dataServ.confData.viewConfigs}
          handleNavEvent={this.handleNavEvent}></HomrNav>
        {view}
      </div>
    );
  }
}



class HomrStatusView extends Component {

  render() {
    return (<p>{this.props.viewConf.title}</p>);
  }
}

class HomrMonitorView extends Component {

  render() {
    return (<p>{this.props.viewConf.title}</p>);
  }
}
