import React from 'react';
import { Button, Card, Col, Container, Row, Spinner, Alert, Form, Pagination } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchArtworks } from '../hooks/useFetchArtworks';
import { useWow } from '../hooks/useWow';
import './Art.css';

const AdminArt = () => {
  const {
    filteredArtworks,
    loading,
    error,
    searchArtworks,
    deleteArtwork,
    currentArtworks,
    totalPages,
    currentPage,
    changePage,
  } = useFetchArtworks();

  useWow();

  return (
    <Container className="justify-content-center">
      <h1 className="mt-5 mb-4 unbounded-uniquifier-header wow fadeInLeft">Manage Artworks</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <Col>
      <Form className="mb-4 unbounded-uniquifier-p">
        <Form.Control
          type="text"
          placeholder="Search artworks by name or description..."
          onChange={(e) => searchArtworks(e.target.value)}
          className="wow fadeInLeft" data-wow-delay="0.5s"
        />
      </Form>
      </Col>
      
      {loading ? (
        <Spinner animation="border" role="status" variant="white" className="d-block mx-auto mt-5">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <Row className="mb-5">
            {currentArtworks.length === 0 ? (
              <Alert variant="info unbounded-uniquifier-p">No artworks to display</Alert>
            ) : (
              currentArtworks.map((artwork) => (
                <Col key={artwork.id} sm={12} md={6} lg={4} className="mb-4 gy-5  wow zoomIn">
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
                          onClick={() => deleteArtwork(artwork.id)}
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
                  onClick={() => changePage(index + 1)}
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
