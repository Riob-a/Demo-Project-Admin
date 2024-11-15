import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { motion } from "framer-motion";
import WOW from "wowjs";
import { FaArrowRight } from "react-icons/fa";
import "./User.css"

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Track selected user
    const [showModal, setShowModal] = useState(false); // Modal state
    const navigate = useNavigate();

    // Timeout
    const handleSessionTimeout = () => {
        toast.error("Session has expired. Please sign in again.");
        setTimeout(() => {
            localStorage.removeItem("access_token");
            navigate("/");
        }, 3000);
    };

    // Fetch user details and show modal
    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedUser(data); // Set the user data
                setShowModal(true); // Show the modal
            } else if (response.status === 401) {
                handleSessionTimeout();
            } else {
                toast.error("Failed to fetch user details");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error while fetching user details");
        }
    };

    useEffect(() => {
        const wow = new WOW.WOW();
        wow.init();

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

        fetchUsers();

        return () => {
            wow.sync();
        };
    }, [navigate]);

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

    return (
        <Container className="py-4 mb-5">
            <ToastContainer />
            <Row>
                <h2 className="mb-5 unbounded-uniquifier-header wow fadeInLeft">Users</h2>
                {users.length === 0 ? (
                    <p className="text-muted text-center">No users found.</p>
                ) : (
                    users.map((user) => (
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
                                        <Card.Text className="unbounded-uniquifier-p1">Email: {user.email}</Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item className="unbounded-uniquifier-p1">User ID: {user.id}</ListGroup.Item>
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

            {/* Modal for displaying user details */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="unbounded-uniquifier-header">User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Role:</strong> {selectedUser.role || "User"}</p>
                            <p><strong>Created At:</strong> {selectedUser.created_at}</p>
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
