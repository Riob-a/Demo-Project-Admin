import React, { useState } from 'react';
import { Form, Button, Card, Col, Container, Row, Alert } from 'react-bootstrap';
import { useWow } from '../hooks/useWow';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function AdminSignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for button loading
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Disable button

        try {
            const response = await fetch('https://demo-project-backend-bl40.onrender.com/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('user_role', result.user.role);
                
                setMessage('Sign-in successful');
                setShowAlert(true);
                setIsError(false);

                setTimeout(() => {
                    setShowAlert(false);
                    if (result.user.role === 'admin') {
                        navigate('/home');
                    } else {
                        window.location.href = "https://demo-project-f-end.vercel.app/home";
                    }
                }, 2000);
            } else {
                setMessage(result.message || 'Error signing in');
                setShowAlert(true);
                setIsError(true);
            }
        } catch {
            setMessage('An error occurred');
            setShowAlert(true);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useWow();

    return (
        <Container className="justify-content-center mb-5 mt-5">
            <Row className="justify-content-center text-center wow fadeInLeft" data-wow-delay="" data-wow-duration="1s">
                <h2 className="unbounded-uniquifier-header">Sign In</h2>
            </Row>
            <Row className="justify-content-center mb-5">
                <Col xs={12} md={6} className="wow fadeInLeft mt-5" data-wow-duration="1s" data-wow-delay="0.2s">
                    <Card className="card-color text-white rounded-5" style={{ boxShadow: "0 0px 15px rgba(0, 0, 0, 0.5)" }}>
                        <Card.Body className="p-5">
                            <Card.Title className="contact-card mb-4 unbounded-uniquifier-h1">Sign In</Card.Title>

                            {showAlert && (
                                <Alert variant={isError ? "danger" : "success"} className="mt-3">
                                    {message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSignIn}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label className="unbounded-uniquifier-h1">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label className="unbounded-uniquifier-h1">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="mt-3 unbounded-uniquifier-h1"
                                    disabled={isLoading} // Disable button while loading
                                >
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </Button>
                                {!showAlert && <p className="mt-3">{message}</p>}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center text-center wow fadeInLeft" data-wow-delay="0.4s" data-wow-duration="1s">
                <p className="unbounded-uniquifier-header">
                    If you don't have an account <a href="/register">Go here</a>
                </p>
            </Row>
        </Container>
    );
}

export default AdminSignIn;
