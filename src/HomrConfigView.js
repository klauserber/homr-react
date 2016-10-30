import React, { Component } from 'react';
import { Col, Panel, Form, FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';


export class HomrConfigView extends Component {
  componentWillMount() {
    var lc = this.props.localConfig;
    if(lc === undefined) {
      lc = {
        configUrl: ""
      }
    }
    this.setState(lc);
  }

  handleChange(e) {
     var st = this.state;

     switch (e.target.id) {
       case "formConfigUrl":
         st.configUrl = e.target.value;
         break;
       default:
     }
     this.setState(st);
  }

  handleSave(e) {
    this.props.onSaveConfig(this.state);
    e.preventDefault();
  }

  render() {

    return (
      <div className="container">
        <Form horizontal onSubmit={this.handleSave.bind(this)}>
          <Panel className="homr-status-view" key={"config"} header={"Configuration"} collapsible={true} defaultExpanded={true}>
            <FormGroup controlId="formConfigUrl">
              <Col componentClass={ControlLabel} xs={12} sm={4} md={2}>
                Config URL
              </Col>
              <Col xs={12} sm={8} md={4}>
                <FormControl type="text" placeholder="URL"
                  value={this.state.configUrl}
                  onChange={this.handleChange.bind(this)} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xsOffset={8} xs={4}>
                <Button style={{width: "100%"}} type="submit">
                  Save
                </Button>
              </Col>
            </FormGroup>
          </Panel>
        </Form>
      </div>
    );
  }
}
