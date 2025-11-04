import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Image, ProgressBar, Spinner, ListGroup } from 'react-bootstrap';
import { CameraFill, ExclamationTriangleFill, Upload, LightbulbFill } from 'react-bootstrap-icons';

import example1 from '../assets/test1.jpg';
import example2 from '../assets/test2.jpg';
import example3 from '../assets/test3.jpg';

function DiagnosisPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null); // Will hold { predictions, tips }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExample, setIsExample] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const exampleImages = [
    { src: example1, name: 'test1.jpg' },
    { src: example2, name: 'test2.jpg' },
    { src: example3, name: 'test3.jpg' },
  ];

  // Function to reset the state for a new diagnosis
  const resetDiagnosis = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setDiagnosisData(null);
    setError('');
    setIsExample(false);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setDiagnosisData(null);
      setError('');
      setIsExample(false);
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setDiagnosisData(null);
      setError('');
      setIsExample(false);
    }
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleExampleImageClick = (image) => {
    fetch(image.src)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], image.name, { type: blob.type });
        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
        setDiagnosisData(null);
        setError('');
        setIsExample(true);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setDiagnosisData(null);

    if (!selectedFile) {
      setError('진단할 이미지를 선택해주세요.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('is_example', isExample);

    try {
      const response = await axios.post('/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDiagnosisData(response.data);
    } catch (err) {
        setError('진단 중 오류가 발생했습니다. 파일을 확인하거나 다시 시도해주세요.');
        console.error('Diagnosis error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/login');
    }
  }, [navigate]);

  // The main render logic
  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={10} lg={8}>
          <Card className="shadow-lg text-center">
            <Card.Header as="h4">AI 피부 진단</Card.Header>
            <Card.Body style={{ minHeight: '400px' }}>
              {error && <Alert variant="danger">{error}</Alert>}

              {/* STATE 1: No image selected */}
              {!previewImage && !loading && (
                <>
                  <div
                    className="d-flex flex-column justify-content-center align-items-center h-100 p-4 rounded"
                    style={{ border: '2px dashed #0d6efd', backgroundColor: '#f8f9fa', cursor: 'pointer' }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Upload style={{ fontSize: '3rem', color: '#0d6efd' }} />
                    <p className="mt-3 mb-0 h5">AI 피부 진단을 시작해보세요</p>
                    <p className="text-muted">이곳을 클릭하거나 사진을 드래그하여 업로드하세요.</p>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      hidden
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h5 className="mb-3"><CameraFill className="me-2" />정확한 진단을 위한 촬영 가이드</h5>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                      더 정확한 진단을 위해, 진단받고 싶은 부위를 선명하게 촬영한 사진을 업로드해주세요.<br />얼굴 전체 사진보다는 특정 부위(예: 이마, 볼, 턱 등)를 확대하여 촬영하는 것이 좋습니다.
                    </p>
                    <Row className="justify-content-center g-3 mt-2">
                      {exampleImages.map((image, index) => (
                        <Col key={index} xs={4} md={3}>
                          <Card className="shadow-sm">
                            <Card.Img variant="top" src={image.src} onClick={() => handleExampleImageClick(image)} style={{ cursor: 'pointer' }} />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </>
              )}

              {/* STATE 2: Image selected, ready to submit */}
              {previewImage && !loading && !diagnosisData && (
                <>
                  <Image src={previewImage} thumbnail fluid style={{ maxHeight: '300px' }} className="mb-3" />
                  <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" onClick={handleSubmit}>진단 시작하기</Button>
                    <Button variant="secondary" onClick={resetDiagnosis}>다른 이미지 선택</Button>
                  </div>
                </>
              )}

              {/* STATE 3: Loading analysis */}
              {loading && (
                <div className="d-flex flex-column justify-content-center align-items-center h-100">
                  <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }}/>
                  <p className="mt-3 fs-5">AI가 이미지를 분석 중입니다...</p>
                </div>
              )}

              {/* STATE 4: Results displayed */}
              {diagnosisData && (
                <>
                  <h5 className="mb-4">진단 결과</h5>
                  <Row>
                    <Col md={6} className="mb-3 mb-md-0">
                      <Image src={previewImage} thumbnail fluid />
                    </Col>
                    <Col md={6} className="text-start">
                      {diagnosisData.predictions.map((result, index) => (
                        <div key={index} className="mb-3">
                          <div className="d-flex justify-content-between">
                            <strong>{result.label}</strong>
                            <span>{result.confidence.toFixed(2)}%</span>
                          </div>
                          <ProgressBar
                            now={result.confidence}
                            label={`${result.confidence.toFixed(2)}%`}
                            variant={index === 0 ? 'success' : 'info'}
                            style={{ height: '20px' }}
                          />
                        </div>
                      ))}
                    </Col>
                  </Row>
                  
                  {diagnosisData.tips && diagnosisData.tips.length > 0 && (
                    <div className="mt-4 text-start">
                      <h5 className="mb-3"><LightbulbFill color="gold" className="me-2" />스킨케어 솔루션</h5>
                      <ListGroup variant="flush">
                        {diagnosisData.tips.map((tip, index) => {
                          if (tip.startsWith('---')) {
                            return (
                              <h6 key={index} className="mt-3 mb-2 text-muted">{tip.replaceAll('---', '')}</h6>
                            );
                          }
                          
                          const labelMatch = tip.match(/\*\*(.*?):\*\*/);
                          if (labelMatch && labelMatch[1]) {
                            const label = labelMatch[1];
                            const content = tip.substring(labelMatch[0].length).trim();
                            return (
                              <ListGroup.Item key={index} as="li" className="border-0 px-0">
                                <strong style={{ color: '#a6c1ee' }}>{label}:</strong> {content}
                              </ListGroup.Item>
                            );
                          }

                          // Fallback for tips that don't match the pattern
                          return (
                            <ListGroup.Item key={index} as="li" className="border-0 px-0">
                              {tip.replaceAll('**', '')}
                            </ListGroup.Item>
                          );
                        })}
                      </ListGroup>
                    </div>
                  )}

                  <Button variant="primary" className="mt-3" onClick={resetDiagnosis}>새로운 진단하기</Button>
                </>
              )}
              <Alert variant="warning" className="mt-4">
                <Alert.Heading as="h6"><ExclamationTriangleFill className="me-2" />주의사항</Alert.Heading>
                <p className="mb-0 small">
                  AI 진단 결과 및 제공되는 스킨케어 솔루션은 참고용이며, 의학적 소견을 대체할 수 없습니다.<br />정확한 진단 및 치료를 원하시면 반드시 전문의와 상담하세요.
                </p>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DiagnosisPage;
