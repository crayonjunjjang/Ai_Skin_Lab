import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [skinType, setSkinType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/users/register/', {
        username,
        password,
        age,
        gender,
        skin_type: skinType,
      });
      toast.success('회원가입이 완료되었습니다! 2초 후 로그인 페이지로 이동합니다.');
      setUsername('');
      setPassword('');
      setAge('');
      setGender('');
      setSkinType('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        const messages = Object.values(err.response.data).flat().join(' ');
        setError(messages);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해 주세요.');
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6} lg={4}>
          <Card className="shadow-lg">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">회원가입</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>사용자 이름</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="사용자 이름을 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="age">
                  <Form.Label>나이</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="나이를 입력하세요"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="gender">
                  <Form.Label>성별</Form.Label>
                  <Form.Select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">성별을 선택하세요</option>
                    <option value="M">남성</option>
                    <option value="F">여성</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="skinType">
                  <Form.Label>피부 타입</Form.Label>
                  <Form.Select value={skinType} onChange={(e) => setSkinType(e.target.value)} required>
                    <option value="">피부 타입을 선택하세요</option>
                    <option value="oily">지성</option>
                    <option value="dry">건성</option>
                    <option value="combination">복합성</option>
                    <option value="sensitive">민감성</option>
                    <option value="normal">정상</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  회원가입
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <span>이미 계정이 있으신가요? </span>
                <Link to="/login">로그인</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
