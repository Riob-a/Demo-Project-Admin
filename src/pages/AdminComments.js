import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button, FormControl, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useWow } from '../hooks/useWow';
import { useFetchComments } from '../hooks/useFetchComments';

function AdminComments() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  // Use custom hooks
  useWow(); // Initialize WOW animations
  const {
    filteredComments,
    loading,
    error,
    deleteError,
    searchQuery,
    handleDelete,
    handleSearch,
  } = useFetchComments(token, navigate);


  if (loading) return <Spinner animation="border" variant="white" role='status' className='d-block mx-auto mt-5' />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="justify-content-center mb-5">
      <Row className='mb-4'>
        
          <h1 className='mb-4 mt-5 unbounded-uniquifier-header wow fadeInLeft'>Comments</h1>
          {/* Search bar */}
          <FormControl
          placeholder='Search comments by name, email or message...'
          value={searchQuery}
          onChange={handleSearch}
          className="wow fadeInLeft unbounded-uniquifier-p" data-wow-delay="0.5s"
          />

          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
      </Row>

      <Row>
          {filteredComments.length === 0 ? (
            <Alert variant="info unbounded-uniquifier-p">No comments available.</Alert>
          ) : (
            filteredComments.map(comment => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // transition={{ duration: 0.5 }}
              >
              
                <Card className="my-3 wow fadeInUp">
                  <Card.Header className='unbounded-uniquifier-header'>{comment.name}</Card.Header>
                  <Card.Body>
                    <Card.Text className='unbounded-uniquifier-p'>{comment.message}</Card.Text>
                    <Card.Subtitle className="unbounded-uniquifier-p text-muted"><strong>Email:</strong> {comment.email}</Card.Subtitle>
                    <hr />
                    <Card.Text className='unbounded-uniquifier-p'><strong>Posted on:</strong> {comment.posted_at}</Card.Text>
                    <hr />
                    <Button 
                      variant="danger" 
                      onClick={() => handleDelete(comment.id)}
                      className="mt-3 unbounded-uniquifier-header"
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            ))
          )}
        
      </Row>
    </Container>
  );
}

export default AdminComments;
