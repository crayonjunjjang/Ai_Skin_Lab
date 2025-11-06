import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';

function ReviewForm({ onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0); // New state for hover effect
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!text || rating === 0) { // Check if rating is 0
        setError('별점과 후기 내용을 모두 입력해주세요.');
        return;
    }

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setError('후기를 작성하려면 로그인이 필요합니다.');
        return;
      }

      await axios.post('http://localhost:8000/api/reviews/create/', 
        { rating, text }, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      setSuccess('소중한 후기 감사합니다!');
      setText('');
      setRating(5); // Reset rating to 5 after submission

      // Notify parent component to refetch reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

    } catch (err) {
      setError('후기 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('Review submission error:', err);
    }
  };

  return (
    <Card className="shadow-sm mt-5">
      <Card.Body>
        <Card.Title as="h4">후기 작성하기</Card.Title>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>별점</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarFill
                  key={star}
                  color={(hoverRating || rating) >= star ? "gold" : "#e4e5e9"}
                  size={24}
                  className="me-1" // Add margin-right
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                />
              ))}
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="text">
            <Form.Label>후기 내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="서비스 경험을 공유해주세요."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">작성 완료</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ReviewForm;
