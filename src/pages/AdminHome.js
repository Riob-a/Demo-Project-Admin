import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Image, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import WOW from "wowjs";
import "animate.css";
import "./HomePage.css";

// Centralized image URLs
const imageUrls = {
  Art: "https://i.pinimg.com/originals/a3/7e/48/a37e48e6e5e0edb1b2ffbee6a73fbd59.gif",
  Users: "https://i.pinimg.com/564x/10/9a/dd/109addc2397a3257c90b61acccb7a273.jpg",
  Comments: "https://i.pinimg.com/originals/db/5a/54/db5a547a554cfaebfcb48aa1e8462918.gif",
};

// Lazy-loaded Image component
const LazyImage = ({ src, alt, rounded = false }) => (
  <Image src={src} alt={alt} fluid rounded={rounded} loading="lazy" />
);

// Reusable card component without unnecessary memoization
const CardComponent = ({ path, imgSrc, title, text, wowDelay, navigateToSection }) => (
  <motion.div
    className="wow fadeInUp card-hover"
    data-wow-duration="1s"
    data-wow-delay={wowDelay}
    data-bs-theme="dark"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigateToSection(path)}
  >
    <Card className="mx-auto" style={{ width: "21rem", boxShadow: "0 0px 15px rgba(0, 0, 0, 0.5)" }}>
      <Card.Img variant="top" src={imgSrc} loading="lazy" />
      <Card.Body>
        <Card.Title className="unbounded-uniquifier-header">{title}</Card.Title>
        <Card.Text className="unbounded-uniquifier-p2 text-muted">{text}</Card.Text>
      </Card.Body>
      <ListGroup variant="flush">
        <ListGroupItem className="unbounded-uniquifier-header">
          <Card.Link href={`#${path}`}>{title} <FaArrowRight /></Card.Link>
        </ListGroupItem>
      </ListGroup>
    </Card>
  </motion.div>
);

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const wowInstance = new WOW.WOW();
    wowInstance.init();
  }, []);

  const navigateToSection = (path) => {
    navigate(path);
  };

  return (
    <div>
      {/* Header Section */}
      <header className="header-section bg-dark text-white text-center py-4 wow fadeInDown" data-wow-duration="1.5s">
        <h1 className="display-4">Admin  +|- Home</h1>
      </header>

      {/* Art Category Sections */}
      <section className="py-5 mt-5 mb-5">
        <Container>
          <Row className="mb-4 text-center">
            <h1 className="unbounded-uniquifier-header wow fadeInLeft">Navigate</h1>
            <hr />
            <p className="unbounded-uniquifier-header wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.2s">
              Click the cards to go to the specific Admin Section
            </p>
          </Row>
          <Row className="gy-5 text-center justify-content-center">
            <Col>
              <CardComponent
                path="/artwork"
                imgSrc={imageUrls.Art}
                title="Art"
                text="View and manage all the posted art."
                wowDelay="0s"
                navigateToSection={navigateToSection}
              />
            </Col>
            <Col>
              <CardComponent
                path="/users"
                imgSrc={imageUrls.Users}
                title="Users"
                text="Manage user Accounts. Delete where necessary"
                wowDelay="0.2s"
                navigateToSection={navigateToSection}
              />
            </Col>
            <Col>
              <CardComponent
                path="/comments"
                imgSrc={imageUrls.Comments}
                title="Comments"
                text="View and manage all user comments and suggestions."
                wowDelay="0.4s"
                navigateToSection={navigateToSection}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default HomePage;
