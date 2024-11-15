import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Col, Container, Row, Alert } from 'react-bootstrap';
import WOW from "wowjs";
import { useNavigate } from 'react-router-dom';
import './Register.css'

function AdminSignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [isError, setIsError] = useState(false); // State for error tracking
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (response.ok) {
                // Store token and user role in local storage
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('user_role', result.user.role);  // Storing role
                
                setMessage('Sign-in successful');
                setShowAlert(true);
                setIsError(false); // Login success, no error

                // Delay navigation to the appropriate page by 2 seconds
                setTimeout(() => {
                    setShowAlert(false); // Hide the alert before redirecting
                    if (result.user.role === 'admin') {
                        navigate('/home'); // Redirect admin to the admin dashboard
                    } else {
                        navigate("https://demo-project-f-end.vercel.app/home"); // Redirect regular user to the home page
                    }
                }, 2000);
            } else {
                setMessage(result.message || 'Error signing in');
                setShowAlert(true); // Show error alert
                setIsError(true); // Login failed, set error to true
            }
        } catch {
            setMessage('An error occurred');
            setShowAlert(true);
            setIsError(true); // Network or other error occurred
        }
    };

    useEffect(() => {
        new WOW.WOW().init();
    }, []);

    return (
        <Container className="justify-content-center mb-5 mt-5">
            <Row className="justify-content-center  text-center wow fadeInLeft" data-wow-delay="" data-wow-duration="1s">
                <h2 className='unbounded-uniquifier-header'>Sign In</h2>
            </Row>
            <Row className="justify-content-center mb-5">
                <Col xs={12} md={6} className="wow fadeInLeft mt-5" data-wow-duration="1s" data-wow-delay="0.2s">
                    <Card className="card-color text-white" style={{ boxShadow: "0 0px 15px rgba(0, 0, 0, 0.5)" }}>
                        <Card.Body className="p-5">
                            <Card.Title className="contact-card mb-4 unbounded-uniquifier-h1">Sign In</Card.Title>

                            {showAlert && (
                                <Alert variant={isError ? "danger" : "success"} className="mt-3">
                                    {message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSignIn}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label className='unbounded-uniquifier-h1'>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label className='unbounded-uniquifier-h1'>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-3 unbounded-uniquifier-h1">
                                    Sign In
                                </Button>
                                {!showAlert && <p className="mt-3">{message}</p>}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center text-center wow fadeInLeft" data-wow-delay="0.4s" data-wow-duration="1s">
                <p className='unbounded-uniquifier-header'>If you don't have an account <a href="/register"> Go here</a></p>
            </Row>
        </Container>
    );
}

export default AdminSignIn;
