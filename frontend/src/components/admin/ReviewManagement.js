import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Table, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/reviews/');
      setReviews(response.data);
    } catch (err) {
      setError('리뷰 목록을 불러오는 데 실패했습니다.');
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openDeleteModal = (review) => {
    setReviewToDelete(review);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setReviewToDelete(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await axios.delete(`/admin/reviews/${reviewToDelete.id}/`);
      toast.success(`리뷰 ID #${reviewToDelete.id}이(가) 삭제되었습니다.`);
      closeDeleteModal();
      fetchReviews(); // Refresh the list
    } catch (err) {
      toast.error('리뷰 삭제에 실패했습니다.');
      console.error('Delete review error:', err);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h2>리뷰 관리</h2>
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Rating</th>
            <th>Text</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(review => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.user.username}</td>
              <td>{review.rating}</td>
              <td>{review.text}</td>
              <td>{new Date(review.created_at).toLocaleString()}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => openDeleteModal(review)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>리뷰 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          정말로 <strong>ID #{reviewToDelete?.id}</strong> 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReviewManagement;