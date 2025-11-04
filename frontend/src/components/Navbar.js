import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function AppNavbar() { // Renamed to avoid conflict with Navbar from react-bootstrap
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false); // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // This effect checks for an auth token in localStorage to determine login state.
  // It runs on component mount and whenever the location changes.
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const staffStatus = localStorage.getItem('is_staff') === 'true';
    setIsLoggedIn(!!token);
    setIsStaff(staffStatus);
  }, [navigate]); // Dependency on navigate to re-check on route changes

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_staff');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold">
            <span style={{
              backgroundImage: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
              AI Skin Lab
            </span>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {isLoggedIn && isStaff && (
              <LinkContainer to="/admin">
                <Nav.Link>Admin</Nav.Link>
              </LinkContainer>
            )}
            {isLoggedIn && (
              <>
                <LinkContainer to="/diagnosis">
                  <Nav.Link>Diagnosis</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/mypage">
                  <Nav.Link>My Page</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <Nav.Link>Profile</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>
                    <Button variant="outline-primary" className="me-2">Login</Button>
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>
                    <Button variant="primary">Register</Button>
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
