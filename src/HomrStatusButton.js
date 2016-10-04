import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';


export class HomrStatusButton extends Component {

  render() {
    var compData = this.props.compData;
    var style = {
      color: compData.color,
      backgroundColor: compData.backcolor
    };

    return (
      <Panel style={style}>{compData.text}</Panel>
    );
  }
}
