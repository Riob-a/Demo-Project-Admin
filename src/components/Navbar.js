import React, { useState, useEffect } from 'react';
import { Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import logo from '../Img/pointed fingure.gif';
import "./components.css";

function BasicExample() {
  // State to track the active link
  const [activeKey, setActiveKey] = useState(window.location.pathname);

  // Update active link based on navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setActiveKey(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return (
    <Navbar expand="lg" bg='white' data-bs-theme="" className=''>
      <Container>
        <Navbar.Brand href="/home" className="Navbar-header">
          <Image roundedCircle alt='logo' src={logo} width="30" height="30" className='d-inline-block align-top' />
          {' '}AD-<b> MIN</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="brand" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" activeKey={activeKey} onSelect={(selectedKey) => setActiveKey(selectedKey)}>
            <Nav.Link href="/home" className={`brand ${activeKey === '/home' ? 'active' : ''}`}>Home | </Nav.Link>
            <Nav.Link href="/artwork" className={`brand ${activeKey === '/artwork' ? 'active' : ''}`}>Art | </Nav.Link>
            <Nav.Link href="/comments" className={`brand ${activeKey === '/comments' ? 'active' : ''}`}>Comments |</Nav.Link>
            <Nav.Link href="/users" className={`brand ${activeKey === '/users' ? 'active' : ''}`}>Users |</Nav.Link>
            <Nav.Link href="/register" className={`brand ${activeKey === '/register' ? 'active' : ''}`}>Register |</Nav.Link>
            {/* <Nav.Link href="/" className={`brand ${activeKey === '/' ? 'active' : ''}`}>Sign-in |</Nav.Link> */}
            <Nav.Link href="/logout" className={`brand ${activeKey === '/logout' ? 'active' : ''}`}>Log Out</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
