import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';


export class HomrErrorView extends Component {
  componentWillMount() {
  }

  render() {
    var mess = this.props.messages;
    var items = [];
    for(var i=0; i < mess.length; i++) {
      var m = mess[i];
      var key = "mess_" + i;
      items.push(<ListGroupItem key={key} bsStyle={m.type}>{m.text}</ListGroupItem>);
    }

    return (
      <div className="container">
        <ListGroup>
          {items}
        </ListGroup>
      </div>
    );
  }
}
