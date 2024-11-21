import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Container, Row, Spinner, Alert, Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import WOW from 'wowjs';
import './Art.css';

const AdminArt = () => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const artworksPerPage = 6; // Adjust the number of artworks per page
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleSessionTimeout = () => {
    toast.error('Session has expired. Please sign in again.');
    setTimeout(() => {
      localStorage.removeItem('access_token');
      navigate('/');
    }, 3000);
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const [staticResponse, animatedResponse] = await Promise.all([
          axios.get('https://demo-project-backend-qrd8.onrender.com/api/artworks/static', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          }),
          axios.get('https://demo-project-backend-qrd8.onrender.com/api/artworks/animated', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          }),
        ]);

        const allArtworks = [...staticResponse.data, ...animatedResponse.data];
        setArtworks(allArtworks);
        setFilteredArtworks(allArtworks);
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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://demo-project-backend-qrd8.onrender.com/api/artworks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      if (response.status === 200) {
        setArtworks((prev) => prev.filter((artwork) => artwork.id !== id));
        setFilteredArtworks((prev) => prev.filter((artwork) => artwork.id !== id));
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = artworks.filter(
      (artwork) =>
        artwork.name.toLowerCase().includes(query.toLowerCase()) ||
        (artwork.description && artwork.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredArtworks(filtered);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const indexOfLastArtwork = currentPage * artworksPerPage;
  const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
  const currentArtworks = filteredArtworks.slice(indexOfFirstArtwork, indexOfLastArtwork);

  const totalPages = Math.ceil(filteredArtworks.length / artworksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const wow = new WOW.WOW();
    wow.init();
    return () => wow.sync();
  }, []);

  return (
    <Container className="justify-content-center">
      <h1 className="mt-5 mb-4 unbounded-uniquifier-header wow fadeInLeft">Manage Artworks</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form className="mb-4 unbounded-uniquifier-p">
        <Form.Control
          type="text"
          placeholder="Search artworks by name or description..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="wow fadeInLeft" data-wow-delay="0.5s"
        />
      </Form>
      {loading ? (
        <Spinner animation="border" role="status" className="d-block mx-auto mt-5">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <Row className="mb-5">
            {currentArtworks.length === 0 ? (
              <Alert variant="info unbounded-uniquifier-p">No artworks to display</Alert>
            ) : (
              currentArtworks.map((artwork) => (
                <Col key={artwork.id} sm={12} md={6} lg={4} className="mb-4 gy-5 gx-5 wow zoomIn">
                  <motion.div
                    className="mx-auto"
                    style={{ width: '21rem', boxShadow: '0 0px 15px rgba(0, 0, 0, 0.5)' }}
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
                        <Card.Title className="unbounded-uniquifier-header">{artwork.name}</Card.Title>
                        <Card.Text className="unbounded-uniquifier-p2 text-muted">
                          {artwork.description}
                        </Card.Text>
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
          {totalPages > 1 && (
            <Pagination className="justify-content-center unbounded-uniquifier-p ">
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
      <ToastContainer />
    </Container>
  );
};

export default AdminArt;
