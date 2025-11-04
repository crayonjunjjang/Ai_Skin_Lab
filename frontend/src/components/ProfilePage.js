import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    gender: '',
    skin_type: ''
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/profile/');
        setProfile(response.data);
        const userProfile = response.data.profile || {};
        setFormData({
          username: response.data.username || '',
          age: userProfile.age || '',
          gender: userProfile.gender || '',
          skin_type: userProfile.skin_type || '',
        });
      } catch (err) {
        setError('프로필 정보를 불러오는 데 실패했습니다.');
        console.error('Fetch profile error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/profile/', {
        username: formData.username,
        profile: {
          age: formData.age,
          gender: formData.gender,
          skin_type: formData.skin_type,
        }
      });
      setProfile(response.data);
      setIsEditing(false);
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
    } catch (err) {
      toast.error('프로필 업데이트에 실패했습니다.');
      console.error('Update profile error:', err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    const userProfile = profile.profile || {};
    setFormData({
      username: profile.username || '',
      age: userProfile.age || '',
      gender: userProfile.gender || '',
      skin_type: userProfile.skin_type || '',
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await axios.put('/change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
    } catch (err) {
      toast.error('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
      console.error('Change password error:', err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8} lg={6}>
          <Card className="shadow-lg mb-4">
            <Card.Header as="h4" className="d-flex justify-content-between align-items-center">
              프로필
              {!isEditing ? (
                <Button variant="outline-primary" size="sm" onClick={() => setIsEditing(true)}>수정</Button>
              ) : (
                <div>
                  <Button variant="outline-secondary" size="sm" onClick={handleCancelEdit} className="me-2">취소</Button>
                  <Button variant="primary" size="sm" onClick={handleUpdateProfile}>저장</Button>
                </div>
              )}
            </Card.Header>
            <Card.Body>
              {profile && (
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">사용자 이름</Form.Label>
                    <Col sm="9">
                      <Form.Control type="text" name="username" readOnly={!isEditing} value={formData.username || ''} onChange={handleInputChange} />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">나이</Form.Label>
                    <Col sm="9">
                      <Form.Control type="number" name="age" readOnly={!isEditing} value={formData.age || ''} onChange={handleInputChange} />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">성별</Form.Label>
                    <Col sm="9">
                      {isEditing ? (
                        <Form.Select name="gender" value={formData.gender || ''} onChange={handleInputChange}>
                          <option value="">선택...</option>
                          <option value="M">남성</option>
                          <option value="F">여성</option>
                        </Form.Select>
                      ) : (
                        <Form.Control type="text" readOnly value={formData.gender || ''} />
                      )}
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">피부 타입</Form.Label>
                    <Col sm="9">
                      {isEditing ? (
                        <Form.Select name="skin_type" value={formData.skin_type || ''} onChange={handleInputChange}>
                          <option value="">선택...</option>
                          <option value="oily">지성</option>
                          <option value="dry">건성</option>
                          <option value="combination">복합성</option>
                          <option value="sensitive">민감성</option>
                          <option value="normal">정상</option>
                        </Form.Select>
                      ) : (
                        <Form.Control type="text" readOnly value={formData.skin_type || ''} />
                      )}
                    </Col>
                  </Form.Group>
                </Form>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-lg">
            <Card.Header as="h4">비밀번호 변경</Card.Header>
            <Card.Body>
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3" controlId="old_password">
                  <Form.Label>현재 비밀번호</Form.Label>
                  <Form.Control type="password" name="old_password" value={passwordData.old_password} onChange={handlePasswordChange} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="new_password">
                  <Form.Label>새 비밀번호</Form.Label>
                  <Form.Control type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirm_password">
                  <Form.Label>새 비밀번호 확인</Form.Label>
                  <Form.Control type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} required />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  비밀번호 변경
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;