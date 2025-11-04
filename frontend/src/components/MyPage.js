import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Container, Row, Col, Card, Alert, Spinner, Button, ListGroup, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function MyPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async (page) => {
      setLoading(true);
      try {
        const response = await axios.get(`/history/?page=${page}`);
        setHistory(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 6)); // 6 is the page size
      } catch (err) {
        setError('진단 기록을 불러오는 데 실패했습니다.');
        console.error('Fetch history error:', err);
      } finally {
        setLoading(false);
      }
    };

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchHistory(currentPage);
  }, [navigate, currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 진단 기록을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/history/${id}/`);
        // Refetch the current page to get the updated list
        const response = await axios.get(`/history/?page=${currentPage}`);
        setHistory(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 6));
        toast.success('진단 기록이 삭제되었습니다.');
      } catch (err) {
        toast.error('삭제 중 오류가 발생했습니다.');
        console.error('Delete error:', err);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">진단 기록을 불러오는 중입니다...</p>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h2 className="my-4">나의 진단 기록</h2>
      {history.length === 0 && !loading ? (
        <Alert variant="info">아직 진단 기록이 없습니다. 지금 바로 첫 진단을 시작해보세요!</Alert>
      ) : (
        <>
          <Row>
            {history.map((item) => (
              <Col md={6} lg={4} key={item.id} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body>
                    <Card.Title>진단 일시</Card.Title>
                    <Card.Text>{new Date(item.created_at).toLocaleString()}</Card.Text>
                    <hr />
                    <Card.Title>진단 결과</Card.Title>
                    {item.result.predictions.map((res, index) => (
                      <div key={index}>
                        <p className="mb-1"><strong>{res.label}:</strong> {res.confidence}%</p>
                      </div>
                    ))}
                    {item.result.tips && item.result.tips.length > 0 && (
                      <>
                        <hr />
                        <Card.Title>스킨케어 솔루션</Card.Title>
                        <ListGroup variant="flush">
                          {item.result.tips.map((tip, index) => (
                            <ListGroup.Item key={index} as="li" className="border-0 px-0 small">
                              {tip.startsWith('---') ? (
                                <h6 className="mt-3 mb-2 text-muted">{tip.replaceAll('---', '')}</h6>
                              ) : (
                                tip.split('**').map((part, i) => 
                                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                )
                              )}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                      삭제
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages).keys()].map(number => (
                  <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                    {number + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default MyPage;
