import React from 'react';
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import { NavLink } from 'react-router-dom';
import logo from '../Img/pointed fingure.gif';
import "./components.css";

function BasicExample() {
  return (
    <Navbar expand="lg" bg='white' data-bs-theme="" className=''>
      <Container>
        <Navbar.Brand as={NavLink} to="/home" className="Navbar-header">
          <Image
            roundedCircle
            alt='logo'
            src={logo}
            width="30"
            height="30"
            className='d-inline-block align-top'
          />
          {' '}AD<b>+MIN</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="brand" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/home" activeClassName="active" className="brand">Home | </Nav.Link>
            <Nav.Link as={NavLink} to="/artwork" activeClassName="active" className="brand">Art | </Nav.Link>
            <Nav.Link as={NavLink} to="/comments" activeClassName="active" className="brand">Comments |</Nav.Link>
            <Nav.Link as={NavLink} to="/users" activeClassName="active" className="brand">Users |</Nav.Link>
            <Nav.Link as={NavLink} to="/register" activeClassName="active" className="brand">Register |</Nav.Link>
            <Nav.Link as={NavLink} to="/logout" activeClassName="active" className="brand">Log Out</Nav.Link>
            {/* <Nav.Link as={NavLink} to="/" activeClassName="active" className='brand'>Sign In</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
