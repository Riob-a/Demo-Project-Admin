import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup, Modal, FormControl, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { motion } from "framer-motion";
import { useWow } from "../hooks/useWow"
import useFetchUsers from "../hooks/useFetchUsers";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import "./User.css";

function AdminUsers() {
    const {
        users,
        filteredUsers,
        searchQuery,
        selectedUser,
        userArtworks,
        showModal,
        fetchUserDetails,
        handleSearchChange,
        handleDelete,
        setShowModal,
        loading,
    } = useFetchUsers();

useWow();

    return (
        <Container className="justify-content-center mb-5">
            <ToastContainer />
            <Row className="">
                <h1 className="mb-4 mt-5 unbounded-uniquifier-header wow fadeInLeft">Users</h1>
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

                {loading ? (
                    <Col xs={12} className="text-center">
                        <Spinner animation="border" variant="white" />
                    </Col>
                ) : filteredUsers.length === 0 ? (
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
                            <img src={selectedUser.profile_image} alt="Profile" className="profile-image" style={{ width: "150px", height: "150px", borderRadius: "50%" }}/>
                            <br />
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