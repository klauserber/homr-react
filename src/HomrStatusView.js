import React, { Component } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import { HomrStatusButton } from './HomrStatusButton.js';


export class HomrStatusView extends Component {

  componentDidMount() {
    var id = this.props.viewData.id;
    console.log( "DidMount: " + id);
  }

  onAction(event, homrId, payload) {
    var id = this.props.viewData.id + "/" + homrId;
    this.props.onAction(event, id, payload);
  }

  render() {
    var data = this.props.viewData;
    var globaldefaults = this.props.defaults;
    var rows = [];
    //console.log(data);
    for(var r=0; r < data.rows.length; r++) {
      var row = data.rows[r];
      var cols = [];
      for(var c=0; c < row.cols.length; c++) {
        var inCols = row.cols[c];
        var col = {};
        var k;
        for(k in globaldefaults) {
          if(globaldefaults.hasOwnProperty(k)) {
            col[k] = globaldefaults[k];
          }
        }
        for(k in data.defaults) {
          if(data.defaults.hasOwnProperty(k)) {
            col[k] = data.defaults[k];
          }
        }
        for(k in row.defaults) {
          if(row.defaults.hasOwnProperty(k)) {
            col[k] = row.defaults[k];
          }
        }
        for(k in inCols) {
          if(inCols.hasOwnProperty(k)) {
            col[k] = inCols[k];
          }
        }
        var colKey = data.id + "_" + r + "_" + c;
        cols.push(<Col className="homr-col" key={colKey} xs={col.xs} sm={col.sm} md={col.md}><HomrStatusButton compData={col} onAction={this.onAction.bind(this)}/></Col>);
      }

      var title = <h3>{row.title}</h3>
      var rowKey = data.id + "_" + r;
      rows.push(
        <Panel className="homr-status-view" key={rowKey} header={title} collapsible={true} defaultExpanded={true}>
          <Grid fluid={true}>
            <Row>{cols}</Row>
          </Grid>
        </Panel>
      );
    }

    return (
      <div className="container">
          {rows}
      </div>
    );
  }
}
