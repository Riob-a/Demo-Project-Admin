import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button, FormControl, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import WOW from 'wowjs';
import { toast } from 'react-toastify';

function AdminComments() {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]); // To store filtered comments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('')
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
    const wow = new WOW.WOW();
    wow.init();

    // Fetch comments on mount
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/contacts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setComments(response.data);
        setFilteredComments(response.data); // Initially, show all comments
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

  // Handle delete comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/contacts/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
      setFilteredComments(updatedComments);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleSessionTimeout();
      } else {
        setDeleteError("Failed to delete comment");
      }
    }
  };

  //Handle search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredComments(
      comments.filter(comment =>
        comment.name.toLowerCase().includes(query) ||
        comment.email.toLowerCase().includes(query) ||
        comment.message.toLowerCase().includes(query)
      )
    );
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="justify-content-center mb-5">
      <Row>
        <Col>
          <h2 className='mb-3 mt-5 unbounded-uniquifier-header wow fadeInLeft'>Comments</h2>
          {/* Search bar */}
          <FormControl
          placeholder='Search comments by name, email or message...'
          value={searchQuery}
          onChange={handleSearch}
          className="wow fadeInLeft unbounded-uniquifier-p" data-wow-delay="0.5s"
          />

          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
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
        </Col>
      </Row>
    </Container>
  );
}

export default AdminComments;
