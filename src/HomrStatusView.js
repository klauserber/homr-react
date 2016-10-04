import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export class HomrStatusView extends Component {

  render() {
    var data = this.props.viewData;
    var globaldefaults = this.props.defaults;
    var rows = [];
    //console.log(data);
    for(var r=0; r < data.rows.length; r++) {
      var row = data.rows[r];
      var cols = [];
      for(var c=0; c < row.length; c++) {
        var col = globaldefaults;
        var k;
        for(k in data.defaults) {
          col[k] = data.defaults[k];
        }
        for(k in row[c]) {
          col[k] = row[c][k];
        }
        cols.push(<Col key={c} xs={col.xs} sm={col.sm} md={col.md}>{col.text}</Col>);
      }
      rows.push(<Row key={r}>{cols}</Row>);
    }

    return (
      <div>
        <h1>{data.title}</h1>
        <Grid>
          {rows}
        </Grid>
      </div>
    );
  }
}
