import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/login/', {
        username,
        password,
      });
      const accessToken = response.data.access;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', response.data.refresh);

      const decodedToken = jwtDecode(accessToken);
      localStorage.setItem('is_staff', decodedToken.is_staff);

      if (decodedToken.is_staff) {
        navigate('/diagnosis');
      } else {
        navigate('/diagnosis');
      }
      window.location.reload(); // Reload to update Navbar state
    } catch (err) {
      setError('잘못된 사용자 이름 또는 비밀번호입니다.');
      console.error('Login error:', err);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6} lg={4}>
          <Card className="shadow-lg">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">로그인</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>사용자 이름</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  로그인
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <span>계정이 없으신가요? </span>
                <Link to="/register">회원가입</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
