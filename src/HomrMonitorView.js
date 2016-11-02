import React, { Component } from 'react';
import { Col, Row, Panel, ListGroup, ListGroupItem, FormControl, Button, Modal } from 'react-bootstrap';
import 'dateformat';

var dateFormat = require('dateformat');

export class HomrMonitorView extends Component {

  constructor(props) {
    super(props);
    this.removeMessage = props.onRemoveMessage;
    this.renderCount = 0;
  }

  componentWillMount() {
    this.setState({
      dataPointSearch: "",
      showRemoveConfirm: false
    });
  }

  handleDatePointSearch(e) {
    var st = this.state;
    st.dataPointSearch = e.target.value;
    this.setState(st);
  }

  handleRemove(e) {
    var dpArr = this.getFilteredDataPoints();

    for(var i=0; i < dpArr.length; i++) {
      var k = dpArr[i].key;
      this.removeMessage(k);
    }
    this.closeRemoveConfirm();
  }

  getFilteredDataPoints() {
    var st = this.state;
    var dataMap = this.props.allDataMap;

    var dpArr = [];

    for(var k in dataMap) {
      if(dataMap.hasOwnProperty(k)) {
        var ss = st.dataPointSearch;
        if(ss === "" || k.toLowerCase().includes(ss.toLowerCase())) {
          var payload = dataMap[k];
          if(payload instanceof Object) {
            dpArr.push({
              key: k,
              pl: payload
            });
          }
        }
      }
    }
    return dpArr;
  }

  createDataPoints() {

    var dpArr = this.getFilteredDataPoints();

    dpArr.sort((a, b) => {
      var valA = a.pl.lc !== undefined ? parseInt(a.pl.lc, 10) : parseInt(a.pl.ts, 10);
      var valB = b.pl.lc !== undefined ? parseInt(b.pl.lc, 10) : parseInt(b.pl.ts, 10);
      if(valA !== undefined && valB !== undefined) {
        return valB - valA;
      }
      else {
        return 0;
      }
    });

    var dataPoints = [];

    for(var i=0; i < dpArr.length; i++) {
      var k = dpArr[i].key;
      var payload = dpArr[i].pl;
      var vals = [];
      for(var vKey in payload) {
        if(payload.hasOwnProperty(vKey)) {
          var val = payload[vKey];
          if(vKey === "ts" || vKey === "lc") {
            val = dateFormat(new Date(parseInt(val, 10)), "dd.mm.yy HH:MM:ss");
          }

          vals.push(<Col xs={4} sm={3} md={2} key={"datapoint_" + k + "_" + vKey}>{vKey + ": " + val}</Col>);
        }
      }
      dataPoints.push(
        <ListGroupItem key={"datarow_" + k}>
          <Row><Col xs={12}><b>{k}</b></Col></Row>
          <Row>{vals}</Row>
        </ListGroupItem>
      );
    }

    return dataPoints;

  }

  openRemoveConfirm() {
    var st = this.state;
    st.showRemoveConfirm = true;
    this.setState(st);
  }

  closeRemoveConfirm() {
    var st = this.state;
    st.showRemoveConfirm = false;
    this.setState(st);
  }


  createConfirmRemoveModal(count) {
    return(
      <Modal show={this.state.showRemoveConfirm} onHide={this.closeRemoveConfirm.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Messages?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Remove all filtered retained messages (count: {count}) from the mqtt server?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleRemove.bind(this)} bsStyle={"primary"}>Remove</Button>
          <Button onClick={this.closeRemoveConfirm.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {

    var dataPoints = this.createDataPoints();
    var confirmModal = this.createConfirmRemoveModal(dataPoints.length);

    var rc = this.renderCount + 1;
    this.renderCount = rc;

    return (
      <div className="container">
        { confirmModal }
        <Panel header={"Data Points"} collapsible={true} defaultExpanded={true}>
          <Panel>
            <Row>
              <Col xs={6}>
                <FormControl
                  type="text"
                  value={this.state.dataPointSearch}
                  onChange={this.handleDatePointSearch.bind(this)}
                  placeholder={"Search..."}/>
              </Col>
              <Col xs={2}>
                  {"Cnt: " + dataPoints.length}
              </Col>
              <Col xs={2}>
                <Button onClick={this.openRemoveConfirm.bind(this)}>Remove</Button>
              </Col>
            </Row>
            </Panel>
          <ListGroup>{dataPoints}</ListGroup>
        </Panel>
        <p>renderCount: {rc}</p>
      </div>
    );
  }
}
