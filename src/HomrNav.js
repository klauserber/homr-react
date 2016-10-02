import React, { Component } from 'react';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem } from 'react-bootstrap';


export class HomrNav extends Component {

  render() {
    var viewConfigs = this.props.viewConfigs;
    var sViews = [];
    var otherViews = [];
    var k;

    for(k in viewConfigs) {
      if(viewConfigs.hasOwnProperty(k)) {
        var viewConf = viewConfigs[k];
        if(viewConf.type === "status") {
          sViews.push(<MenuItem eventKey={k} key={k}>{viewConfigs[k].title}</MenuItem>);
        }
        else {
          otherViews.push(<NavItem href="#" eventKey={k} key={k}>{viewConfigs[k].title}</NavItem>);
        }
      }
    }

    return (
      <Navbar bsStyle="inverse" fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">HOMR</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav onSelect={this.props.handleNavEvent}>
            <NavDropdown eventKey={3} title="Status" id="menuStatusDropDown">
              {sViews}
            </NavDropdown>
            {otherViews}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
