// hooks/useFetchComments.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useFetchComments = (token, navigate) => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle session timeout
  const handleSessionTimeout = () => {
    toast.error("Session has expired. Please sign in again.");
    setTimeout(() => {
      localStorage.removeItem('access_token');
      navigate("/");
    }, 3000);
  };

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('https://demo-project-backend-ude8.onrender.com/api/contacts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComments(response.data);
        setFilteredComments(response.data);
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
  }, [token, navigate]);

  // Handle delete comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`https://demo-project-backend-ude8.onrender.com/api/contacts/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
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

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    setFilteredComments(
      comments.filter(comment =>
        comment.name.toLowerCase().includes(lowercasedQuery) ||
        comment.email.toLowerCase().includes(lowercasedQuery) ||
        comment.message.toLowerCase().includes(lowercasedQuery)
      )
    );
  };

  return {
    comments,
    filteredComments,
    loading,
    error,
    deleteError,
    searchQuery,
    setComments,
    handleDelete,
    handleSearch,
  };
};
