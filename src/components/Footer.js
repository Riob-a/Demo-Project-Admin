import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import WOW from "wowjs";
import "animate.css";
import "./components.css";

function Footer() {
  return (
    <footer className="footer p-5 bg-dark text-secondary wow fadeInUp" data-wow-delay="0.1s">
      <Container fluid>
        <Row>
          <Col md={3}>
            <h2 className="Navbar-header">D3-<b>RRICKS</b></h2>
          </Col>
          <Col md={3}>
            <h5 className="footer-title">About Us</h5>
            <p>
              D3-<b>RRICKS</b> is a leading platform that provides Artists and
              Creatives resources for hosting art and making their Submissions.
            </p>
          </Col>
          <Col md={3}>
            <h5 className="footer-title">Contact Us</h5>
            <ul className="list-unstyled">
              <li>Email: info@RRICKS.com</li>
              <li>Phone: +1233567890</li>
              <li>Address: 123 Street, Nairobi, Kenya</li>
            </ul>
          </Col>
          <Col md={3}>
            <h5 className="footer-title">Follow Us</h5>
            <ul className="list-inline footer-links">
              <li className="list-inline-item">
                <a href="https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2F" className="text-secondary">
                  <FaFacebook /> Facebook
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://x.com/?lang=en" className="text-secondary">
                  <FaTwitter /> Twitter
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.instagram.com" className="text-secondary">
                  <FaInstagram /> Instagram
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://ke.linkedin.com" className="text-secondary">
                  <FaLinkedin /> LinkedIn
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col md={6}>
            <p>© 2024 D3-<b>RRICKS</b>. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-end">
            <ul className="list-inline footer-links">
              <li className="list-inline-item">
                <a href="#" className="text-secondary">Privacy Policy</a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="text-secondary">Terms of Service</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
