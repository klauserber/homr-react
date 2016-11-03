import React, { Component } from 'react';
import { Navbar, NavItem, Nav, Row, Col } from 'react-bootstrap';


export class HomrNav extends Component {
  componentDidMount() {
    this.setState({ navExpanded: false })
  }

  navToggle() {
    var st = this.state;
    st.navExpanded = !st.navExpanded;
    this.setState(st);
  }

  handleNavEvent(eventKey) {
    this.navToggle();
    this.props.handleNavEvent(eventKey);
  }

  render() {
    var viewsData = this.props.viewsData;
    var sViews = [];
    var k;

    for(k in viewsData) {
      if(viewsData.hasOwnProperty(k)) {
        sViews.push(<NavItem href="#" eventKey={k} key={k}>{viewsData[k].title}</NavItem>);
      }
    }

    if(this.props.monitor === true) {
      sViews.push(<NavItem href="#" eventKey={"monitorview"} key={"monitorview"}>{"Monitor"}</NavItem>);
    }
    sViews.push(<NavItem href="#" eventKey={"configview"} key={"configview"}>{"Config"}</NavItem>);

    var st = this.state;
    var exp = st !== null ? st.navExpanded : false;
    var info = this.props.statusInfo;

    return (
      <div>
      <Navbar bsStyle="inverse" fixedTop
          onToggle={this.navToggle.bind(this)}
          expanded={exp}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">HOMR</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav onSelect={this.handleNavEvent.bind(this)}>
            {sViews}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Navbar bsStyle="inverse" fixedBottom >
        <Navbar.Header>
          <Navbar.Text>
            <div className="container">
            <Row>
              <Col xs={2}>{info.clientid}</Col>
              <Col xs={2}>rec: {info.received}</Col>
              <Col xs={2}>rate: {info.rate}</Col>
              <Col xs={2}>sent: {info.sent}</Col>
              <Col xs={2}>{info.lastMsg}</Col>
              <Col xs={2}>{info.version}</Col>
            </Row>
            </div>
          </Navbar.Text>
        </Navbar.Header>
      </Navbar>
      </div>
    );
  }
}
