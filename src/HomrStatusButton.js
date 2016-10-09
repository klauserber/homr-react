import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';


export class HomrStatusButton extends Component {

  handleClick(event) {
    var data = this.props.compData;
    if(data.readonly !== 1) {
      var v = data.val === "0" ? "1" : "0";
      var payload = { val: v };
      this.props.onAction(event, data.id, payload);
    }
  }

  render() {
    var compData = this.props.compData;
    var bc;
    var text;
    if(compData.waiting === 1) {
      bc = compData.waitingcolor;
      text = compData.text;
    }
    else {
      bc = compData.val === "0" ? compData.offcolor : compData.oncolor;
      if(bc === undefined) {
        bc = compData.backcolor;
      }
      text = compData.val === "0" ? compData.offtext : compData.ontext;
      if(text === undefined) {
        text = compData.text;
      }
    }

    var style = {
      color: compData.color,
      backgroundColor: bc
    };

    return (
      <Panel style={style} className="homr-status-button" onClick={this.handleClick.bind(this)}>{text}</Panel>
    );
  }
}
