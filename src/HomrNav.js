import React, { Component } from 'react';
import { Navbar, NavItem, Nav } from 'react-bootstrap';


export class HomrNav extends Component {

  render() {
    var viewsData = this.props.viewsData;
    var sViews = [];
    var k;

    for(k in viewsData) {
      if(viewsData.hasOwnProperty(k)) {
        sViews.push(<NavItem href="#" eventKey={k} key={k}>{viewsData[k].title}</NavItem>);
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
            {sViews}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
