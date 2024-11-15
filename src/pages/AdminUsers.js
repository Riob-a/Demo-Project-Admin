import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { motion } from "framer-motion";
import WOW from "wowjs";
import { FaArrowRight } from "react-icons/fa";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // Timeout
    const handleSessionTimeout = () => {
        toast.error("Session has expired. Please sign in again.");
        setTimeout(() => {
            localStorage.removeItem("access_token");
            navigate("/");
        }, 3000);
    };

    useEffect(() => {
        // Initialize WOW.js for animation
        const wow = new WOW.WOW();
        wow.init();

        // Fetch registered users
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

        // Cleanup WOW.js
        return () => {
            wow.sync();
        };
    }, [navigate]);

    // Function to delete a user
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
        <Container className="py-4">
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
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="wow fadeInUp shadow-sm h-100">
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
                                            onClick={() => navigate(`/users/${user.id}`)}
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
        </Container>
    );
}

export default AdminUsers;
