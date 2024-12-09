import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useFetchArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const artworksPerPage = 6; // Adjust the number of artworks per page
  const navigate = useNavigate();

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
    const filtered = artworks.filter(
      (artwork) =>
        artwork.name.toLowerCase().includes(query.toLowerCase()) ||
        (artwork.description && artwork.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredArtworks(filtered);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behaviour: 'smooth',
    })
  };

  const currentArtworks = filteredArtworks.slice(
    (currentPage - 1) * artworksPerPage,
    currentPage * artworksPerPage
  );

  const totalPages = Math.ceil(filteredArtworks.length / artworksPerPage);

  return {
    artworks,
    filteredArtworks,
    loading,
    error,
    searchArtworks: handleSearch,
    deleteArtwork: handleDelete,
    sessionTimeout: handleSessionTimeout,
    currentArtworks,
    totalPages,
    currentPage,
    changePage: handlePageChange,
  };
};
