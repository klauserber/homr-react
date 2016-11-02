import React, { Component } from 'react';
import { Navbar, NavItem, Nav } from 'react-bootstrap';


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
          <Navbar.Brand>
            <a href="#">hmr1</a>
          </Navbar.Brand>
          <Navbar.Text>
            r: {info.received} / s: {info.sent} / {info.rate} m/min
          </Navbar.Text>
        </Navbar.Header>
      </Navbar>
      </div>
    );
  }
}
