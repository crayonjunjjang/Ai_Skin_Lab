import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import axios from '../api/axios';
import ReviewForm from './ReviewForm'; // Import the new form component
import IconUpload from '../assets/icon-upload.svg';
import IconAi from '../assets/icon-ai.svg';
import IconChart from '../assets/icon-chart.svg';

function HomePage() {
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch reviews from the backend
  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get('/reviews/');
      setReviews(response.data);
    } catch (err) {
      setError('후기를 불러오는 데 실패했습니다.');
      console.error('Fetch reviews error:', err);
    }
  }, []);

  // Check login status and fetch reviews on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
    fetchReviews();
  }, [fetchReviews]);

  return (
    <>
      {/* Hero Section */}
      <Container className="text-center py-5 my-5 bg-light rounded-3 shadow-lg">
        <h1 className="display-4 fw-bold">AI가 진단하는 내 피부 상태</h1>
        <p className="lead my-4">
          사진 한 장으로 간편하게 피부를 분석하고 맞춤 솔루션을 받아보세요.
          <br />
          전문적인 AI 기술이 당신의 피부 건강을 지켜드립니다.
        </p>
        <Link to={isLoggedIn ? '/diagnosis' : '/login'}>
          <Button variant="primary" size="lg">진단 시작하기</Button>
        </Link>
      </Container>

      {/* How It Works Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">어떻게 작동하나요?</h2>
        <Row>
          <Col md={4} className="text-center mb-3">
            <div className="mb-3">
              <img src={IconUpload} alt="Upload Icon" style={{ height: '48px' }} />
            </div>
            <h4>1. 사진 업로드</h4>
            <p className="text-muted">진단하고 싶은 부위의 사진을 업로드하세요.</p>
          </Col>
          <Col md={4} className="text-center mb-3">
            <div className="mb-3">
              <img src={IconAi} alt="AI Icon" style={{ height: '48px' }} />
            </div>
            <h4>2. AI 분석</h4>
            <p className="text-muted">첨단 AI가 이미지를 정밀하게 분석합니다.</p>
          </Col>
          <Col md={4} className="text-center mb-3">
            <div className="mb-3">
              <img src={IconChart} alt="Chart Icon" style={{ height: '48px' }} />
            </div>
            <h4>3. 결과 확인</h4>
            <p className="text-muted">분석 결과를 시각적인 자료와 함께 확인하세요.</p>
          </Col>
        </Row>
      </Container>

      {/* Testimonials Section */}
      <Container className="py-5 bg-light rounded-3 shadow-sm">
        <h2 className="text-center mb-5">사용자 후기</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {reviews.length > 0 ? (
          <Row>
            {reviews.map((review) => (
              <Col md={4} key={review.id} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <Card.Text>"{review.text}"</Card.Text>
                    <footer className="blockquote-footer mt-2">{review.user.username}</footer>
                    <div className="mb-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <StarFill key={index} color={index < review.rating ? "gold" : "#e4e5e9"} className="me-1" />
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center text-muted">아직 작성된 후기가 없습니다. 첫 후기를 남겨주세요!</p>
        )}
        {isLoggedIn ? (
          <ReviewForm onReviewSubmitted={fetchReviews} />
        ) : (
          <div className="text-center mt-4">
            <p className="text-muted">후기를 작성하려면 <Link to="/login">로그인</Link>이 필요합니다.</p>
          </div>
        )}
      </Container>

      {/* Disclaimer Section */}
      <Container className="py-5 text-center">
        <Alert variant="info">
          <Alert.Heading>주의사항</Alert.Heading>
          <p>
            본 서비스가 제공하는 AI 진단 결과는 의료적 판단을 대체할 수 없으며, 참고용으로만 사용해야 합니다.
            정확한 진단과 치료를 위해서는 반드시 전문의와 상담하시기 바랍니다.
          </p>
        </Alert>
      </Container>
    </>
  );
}

export default HomePage;