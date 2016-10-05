import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';


export class HomrStatusButton extends Component {

  handleClick(event) {
    var data = this.props.compData;
    var v = data.val === "0" ? "1" : "0";
    var payload = { val: v };
    this.props.onAction(event, data.id, payload);
  }

  render() {
    var compData = this.props.compData;
    var bc = compData.waiting === 1 ? "grey" : compData.backcolor;
    var style = {
      color: compData.color,
      backgroundColor: bc
    };

    return (
      <Panel style={style} onClick={this.handleClick.bind(this)}>{compData.text}</Panel>
    );
  }
}
