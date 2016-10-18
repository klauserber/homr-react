import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';


export class HomrStatusButton extends Component {

  componentWillMount() {
    var data = this.props.compData;
    var st = {};
    //console.log( "WillMount: " + data.text);
    if(data.interval !== undefined) {
      st.count = 0;
    }
    this.setState(st);
  }
  componentDidMount() {
    var data = this.props.compData;
    //console.log( "DidMount: " + data.text);
    if(data.interval !== undefined) {
      this.timer = setInterval(() => this.onTimer(), data.interval);
    }
  }

  componentWillUnmount() {
    var data = this.props.compData;
    //console.log( "WillUnmount: " + data.text);
    if(data.interval !== undefined) {
      clearInterval(this.timer);
    }
  }

  onTimer() {
    var st = this.state;
    st.count++;

    //console.log("count " + data.text + ": " + st.count);
    this.setState(st);
  }

  handleClick(event) {
    var data = this.props.compData;
    if(data.readonly !== 1) {
      var v;
      if(typeof(data.val) === "string") {
        v = data.val === "0" ? "1" : "0";
      }
      else if(typeof(data.val) === "number") {
        v = data.val === 0 ? 1 : 0;
      }
      var payload = { val: v };
      this.props.onAction(event, data.id, payload);
    }
  }

  render() {
    var data = this.props.compData;
    var bc;
    var text;
    if(data.waiting === 1) {
      bc = data.waitingcolor;
      text = data.text;
    }
    else {
      bc = (data.val === "0" || data.val === 0) ? data.offcolor : data.oncolor;
      if(bc === undefined) {
        bc = data.backcolor;
      }
      text = (data.val === "0" || data.val === 0) ? data.offtext : data.ontext;
      if(text === undefined) {
        text = data.text;
      }
    }

    var style = {
      color: data.color,
      backgroundColor: bc
    };


    var txtDiv = "";
    if(text !== "") {
      txtDiv = <div>{text}</div>;
    }

    var ct = 0;
    if(this.state.count !== undefined) {
      ct = this.state.count;
    }

    var img = "";
    if(data.imgurl !== undefined) {
      img = <img className="button-image" role="presentation" src={data.imgurl + "?" + ct} />;
    }


    var key = "button_" + data.id;
    return (
      <Panel key={key} style={style} className="homr-status-button" onClick={this.handleClick.bind(this)}>{img}{txtDiv}</Panel>
    );
  }
}
