import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Container, Row, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import WOW from 'wowjs';
import './Art.css'

const AdminArt = () => {
  const [artworks, setArtworks] = useState([]);
  const [visibleArtworks, setVisibleArtworks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Show toast after token timeout
  const handleSessionTimeout = () => {
    toast.error("Session has expired. Please sign in again.");
    setTimeout(() => {
      localStorage.removeItem('access_token');
      navigate("/");
    }, 3000);
  };

  // Fetch both static and animated artworks when the component mounts
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const [staticResponse, animatedResponse] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/artworks/static', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          }),
          axios.get('http://127.0.0.1:5000/api/artworks/animated', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          }),
        ]);

        const allArtworks = [...staticResponse.data, ...animatedResponse.data];
        setArtworks(allArtworks);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleSessionTimeout();
        } else {
          setError('Error fetching artworks.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [navigate]);

  // Handle artwork deletion
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/artworks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      if (response.status === 200) {
        setArtworks((prev) => prev.filter((artwork) => artwork.id !== id));
        toast.success('Artwork deleted successfully');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleSessionTimeout();
      } else {
        toast.error('Error deleting artwork');
      }
    }
  };

    // IntersectionObserver to handle visibility of artworks
    useEffect(() => {
      if (!containerRef.current) return; // Ensure containerRef is not null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleArtworks((prev) => ({
                ...prev,
                [entry.target.dataset.id]: true,
              }));
            }
          });
        },
        { threshold: 0.1 }
      );
  
      const elements = containerRef.current.querySelectorAll('.art-card');
      elements.forEach((element) => observer.observe(element));
  
      return () => observer.disconnect();
    }, [artworks]);
  

  useEffect(() => {
    const wow = new WOW.WOW();
    wow.init();

    // Cleanup WOW.js
    return () => wow.sync();
  }, []);

  return (
    <Container className='justify-content-center'>
      <h1 className="mt-5 mb-4 unbounded-uniquifier-header wow fadeInUp">Manage Artworks</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" role="status" className="d-block mx-auto mt-5">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Row className='mb-5'>
          {artworks.length === 0 ? (
            <Alert variant="info">No artworks to display</Alert>
          ) : (
            artworks.map((artwork) => (
              <Col key={artwork.id} sm={12} md={6} lg={4} className="mb-4 gy-5 gx-5">
                <motion.div
                  className="wow zoomIn mx-auto"
                  style={{ width: "21rem", boxShadow: "0 0px 15px rgba(0, 0, 0, 0.5)" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card>
                    <Card.Img
                      variant="top"
                      src={artwork.image_url || 'https://via.placeholder.com/150'}
                      loading="lazy"
                      alt={artwork.name || 'Artwork Image'}
                    />
                    <Card.Body>
                      <Card.Title className='unbounded-uniquifier-header'>{artwork.name}</Card.Title>
                      <Card.Text className='unbounded-uniquifier-p2 text-muted'>{artwork.description}</Card.Text>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(artwork.id)}
                        className="w-100 unbounded-uniquifier-header"
                      >
                        Delete Artwork
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))
          )}
        </Row>
      )}
      <ToastContainer />
    </Container>
  );
};

export default AdminArt;
