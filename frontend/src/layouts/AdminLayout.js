import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';

const AdminLayout = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="bg-light vh-100 p-3 d-none d-md-block">
          <h4 className="mb-3">Admin Menu</h4>
          <Nav className="flex-column" variant="pills">
            <Nav.Item>
              <Nav.Link as={NavLink} to="/admin/users" end>User Management</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/admin/reviews">Review Management</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/admin/diagnoses">Diagnosis Management</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9} lg={10}>
          <main className="py-4">
            <Outlet />
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
