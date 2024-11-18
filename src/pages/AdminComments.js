import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import WOW from 'wowjs';
import { toast } from 'react-toastify';

function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

  // Timeout toast
  const handleSessionTimeout = () => {
    toast.error("Session has expired. Please sign in again.");
    setTimeout(() => {
      localStorage.removeItem('access_token');
      navigate("/");
    }, 3000);
  }

  useEffect(() => {
    // Initialize WOW.js animations
    new WOW.WOW().init();

    // Fetch comments on mount
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/contacts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setComments(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleSessionTimeout();
        } else {
          setError("Failed to load comments");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [navigate]);

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/contacts/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      // Remove the deleted comment from the comments list
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleSessionTimeout();
      } else {
        setDeleteError("Failed to delete comment");
      }
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="justify-content-center mb-5">
      <Row>
        <Col>
          <h2 className='mb-5 mt-5 unbounded-uniquifier-header wow fadeInLeft'>Comments</h2>
          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
          {comments.length === 0 ? (
            <Alert variant="info">No comments available.</Alert>
          ) : (
            comments.map(comment => (
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
                    <Card.Subtitle className="unbounded-uniquifier-p text-muted">Email: {comment.email}</Card.Subtitle>
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
        </Col>
      </Row>
    </Container>
  );
}

export default AdminComments;
