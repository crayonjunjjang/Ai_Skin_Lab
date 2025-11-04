import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Table, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/users/');
      setUsers(response.data);
    } catch (err) {
      setError('사용자 목록을 불러오는 데 실패했습니다.');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`/admin/users/${userToDelete.id}/`);
      toast.success(`사용자 '${userToDelete.username}'이(가) 삭제되었습니다.`);
      closeDeleteModal();
      fetchUsers(); // Refresh the list
    } catch (err) {
      toast.error('사용자 삭제에 실패했습니다.');
      console.error('Delete user error:', err);
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
      <h2>사용자 관리</h2>
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Is Staff</th>
            <th>Date Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.is_staff ? 'Yes' : 'No'}</td>
              <td>{new Date(user.date_joined).toLocaleDateString()}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => openDeleteModal(user)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>사용자 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          정말로 사용자 <strong>{userToDelete?.username}</strong>을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default UserManagement;