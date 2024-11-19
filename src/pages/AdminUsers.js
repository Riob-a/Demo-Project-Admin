import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup, Modal, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { motion } from "framer-motion";
import WOW from "wowjs";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import "./User.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
    const [selectedUser, setSelectedUser] = useState(null); // Track selected user
    const [userArtworks, setUserArtworks] = useState([]); // Track user's artworks
    const [showModal, setShowModal] = useState(false); // Modal state
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const navigate = useNavigate();

    // Timeout
    const handleSessionTimeout = () => {
        toast.error("Session has expired. Please sign in again.");
        setTimeout(() => {
            localStorage.removeItem("access_token");
            navigate("/");
        }, 3000);
    };

    // Fetch user details and their artworks
    const fetchUserDetails = async (userId) => {
        try {
            const userResponse = await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                setSelectedUser(userData);

                // Fetch artworks associated with the user
                const artworkResponse = await fetch(`http://127.0.0.1:5000/api/users/${userId}/artworks`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                if (artworkResponse.ok) {
                    const artworkData = await artworkResponse.json();
                    setUserArtworks(artworkData); // Set artworks
                } else if (artworkResponse.status === 401) {
                    handleSessionTimeout();
                } else {
                    toast.error("Failed to fetch user's artworks");
                }

                setShowModal(true); // Show modal after fetching user and artworks
            } else if (userResponse.status === 401) {
                handleSessionTimeout();
            } else {
                toast.error("Failed to fetch user details");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error while fetching user details");
        }
    };

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data); // Initially set filteredUsers to all users
            } else if (response.status === 401) {
                handleSessionTimeout();
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error while fetching users");
        }
    };

    // Handle search input change and filter users
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter users based on search query
        const filtered = users.filter(
            (user) =>
                user.username.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            if (response.ok) {
                setUsers(users.filter((user) => user.id !== userId));
                setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
                toast.success("User deleted successfully");
            } else if (response.status === 401) {
                handleSessionTimeout();
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error while deleting user");
        }
    };

    useEffect(() => {
        const wow = new WOW.WOW();
        wow.init();

        fetchUsers();

        return () => {
            wow.sync();
        };
    }, [navigate]);

    return (
        <Container className="py-4 mb-5">
            <ToastContainer />
            <Row>
                <h2 className="mb-3 unbounded-uniquifier-header wow fadeInLeft">Users</h2>
                {/* Search Bar */}
                <Col xs={12} className="mb-4 unbounded-uniquifier-p">
                    <FormControl
                        type="text"
                        placeholder="Search users by username or email " 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="wow fadeInLeft" data-wow-delay="0.5s"
                    />
                </Col>

                {filteredUsers.length === 0 ? (
                    <p className="text-muted text-center unbounded-uniquifier-p">No users found.</p>
                ) : (
                    filteredUsers.map((user) => (
                        <Col key={user.id} xs={12} md={6} lg={4} className="mb-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Card className="wow fadeInUp shadow-sm h-100 mb-5">
                                    <Card.Body>
                                        <Card.Title className="unbounded-uniquifier-header">{user.username}</Card.Title>
                                        <Card.Text className="unbounded-uniquifier-p">Email: {user.email}</Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item className="unbounded-uniquifier-p">User ID: {user.id}</ListGroup.Item>
                                    </ListGroup>
                                    <Card.Footer className="d-flex justify-content-between align-items-center">
                                        <Button
                                            variant="primary unbounded-uniquifier-header"
                                            onClick={() => fetchUserDetails(user.id)}
                                        >
                                            View Details <FaArrowRight />
                                        </Button>
                                        <Button
                                            variant="danger unbounded-uniquifier-header"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </motion.div>
                        </Col>
                    ))
                )}
            </Row>

            {/* Modal for displaying user details and artworks */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="unbounded-uniquifier-header">User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className="unbounded-uniquifier-p">
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Role:</strong> {selectedUser.role || "User"}</p>
                            <p><strong>Created At:</strong> {selectedUser.created_at}</p>
                            <hr />
                            <h5>Artworks</h5>
                            {userArtworks.length === 0 ? (
                                <p className="text-muted unbounded-uniquifier-p">No artworks found for this user.</p>
                            ) : (
                                <Row>
                                    {userArtworks.map((artwork) => (
                                        <Col key={artwork.id} xs={12} md={6} lg={6} className="mb-3">
                                            <Card className="shadow-sm">
                                                <Card.Img variant="top" src={artwork.image_url} alt={artwork.title} />
                                                <Card.Body>
                                                    <Card.Title>{artwork.title}</Card.Title>
                                                    <Card.Text className="unbounded-uniquifier-p">
                                                        <strong>Style:</strong> {artwork.style} <br />
                                                        <strong>Name:</strong> {artwork.name} <br />
                                                        <strong>Description:</strong> {artwork.description}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary unbounded-uniquifier-header" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminUsers;
