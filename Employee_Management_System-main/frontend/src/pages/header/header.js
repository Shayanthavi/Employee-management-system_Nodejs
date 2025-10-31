import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { FaCrown, FaTachometerAlt, FaUsers, FaCalendarCheck, FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./header.css";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar className="custom-navbar" variant="dark" expand="lg" style={{ minHeight: '60px', padding: '0.5rem 2rem' }}>
      <Container fluid>
        {/* Logo moved to QuickSidebar */}
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          {/* Navigation links moved to Sidebar */}
          <Nav className="me-auto" style={{ alignItems: 'center' }} />
          <Nav className="ms-auto" style={{ alignItems: 'center' }}>
            {isAuthenticated() ? (
              <>
                <span className="user-avatar">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </span>
                <Navbar.Text className="me-3 text-light">
                  {user?.username}
                </Navbar.Text>
                <Button 
                  variant="outline-light" 
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;