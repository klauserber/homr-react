import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export class HomrConfigurationView extends Component {

  render() {
    return (
      <Grid>
        <Row>
          <Col>{this.props.viewConf.title}</Col>
        </Row>
      </Grid>
    );
  }
}
