import React, { useEffect, useState } from 'react';
import { Container, Row, Alert, Card, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import WOW from "wowjs";

function AdminLogout() {
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await fetch('https://demo-project-backend-qrd8.onrender.com/api/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
    
                    const result = await response.json();
                    setMessage(result.message || "You have been logged out.");
    
                    if (response.ok) {
                        // Ensure token removal after logout success
                        localStorage.removeItem('access_token');
                    }
                } catch (error) {
                    setMessage("An error occurred while logging out.");
                }
            } else {
                setMessage("No active session found.");
            }
    
            setTimeout(() => {
                setShowAlert(false);
                navigate('/'); // Redirect to admin login page after 2 seconds
            }, 2000); // Redirect after 2 seconds
        };
    
        performLogout();
    }, [navigate]);

    useEffect(() => {
        new WOW.WOW().init();
    }, []);

    return (
        <Container className="justify-content-center p-5 m-5">
            <Col>
                <Row className="justify-content-center text-center">
                    {showAlert && (
                        <Card className="mt-3 wow zoomIn" data-wow-duration="1s" style={{ width: '18rem' }}>
                            <Card.Body>
                                <Alert variant="info">
                                    {message}
                                </Alert>
                            </Card.Body>
                        </Card>
                    )}
                </Row>
            </Col>
        </Container>
    );
}

export default AdminLogout;
