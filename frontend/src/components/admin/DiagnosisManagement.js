import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Table, Button, Modal, Spinner, Alert, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DiagnosisManagement = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [diagnosisToDelete, setDiagnosisToDelete] = useState(null);

  const fetchDiagnoses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/diagnoses/');
      setDiagnoses(response.data);
    } catch (err) {
      setError('진단 기록 목록을 불러오는 데 실패했습니다.');
      console.error('Fetch diagnoses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const openDeleteModal = (diagnosis) => {
    setDiagnosisToDelete(diagnosis);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setDiagnosisToDelete(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!diagnosisToDelete) return;

    try {
      await axios.delete(`/admin/diagnoses/${diagnosisToDelete.id}/`);
      toast.success(`진단 기록 ID #${diagnosisToDelete.id}이(가) 삭제되었습니다.`);
      closeDeleteModal();
      fetchDiagnoses(); // Refresh the list
    } catch (err) {
      toast.error('진단 기록 삭제에 실패했습니다.');
      console.error('Delete diagnosis error:', err);
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
      <h2>진단 기록 관리</h2>
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Image</th>
            <th>Top Prediction</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {diagnoses.map(diagnosis => (
            <tr key={diagnosis.id}>
              <td>{diagnosis.id}</td>
              <td>{diagnosis.user.username}</td>
              <td>
		<a href={diagnosis.image} target="_blank" rel="noopener noreferrer">
                  <Image src={diagnosis.image} thumbnail width="100" />
		</a>
              </td>
              <td>
                {diagnosis.result?.predictions?.[0] ? 
                  `${diagnosis.result.predictions[0].label} (${diagnosis.result.predictions[0].confidence}%)`
                  : 'N/A'
                }
              </td>
              <td>{new Date(diagnosis.created_at).toLocaleString()}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => openDeleteModal(diagnosis)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>진단 기록 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          정말로 <strong>ID #{diagnosisToDelete?.id}</strong> 진단 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default DiagnosisManagement;
