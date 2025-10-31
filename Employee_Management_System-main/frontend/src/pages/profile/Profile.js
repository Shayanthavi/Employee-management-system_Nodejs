import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal, Tab, Tabs } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { BsPerson, BsEnvelope, BsTelephone, BsBriefcase, BsBuilding, BsPencilSquare, BsShield } from 'react-icons/bs';
import "../employee/Employees.css";
import "./Profile.css";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Form data for profile update
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    department: "",
    position: "",
    bio: ""
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordError, setPasswordError] = useState(null);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/profile");
      setUser(response.data.data);
      setFormData({
        username: response.data.data.username || "",
        email: response.data.data.email || "",
        fullName: response.data.data.fullName || "",
        phone: response.data.data.phone || "",
        department: response.data.data.department || "",
        position: response.data.data.position || "",
        bio: response.data.data.bio || ""
      });
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await api.patch("/user/profile", formData);
      setUser(response.data.data);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setSuccess(null);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    try {
      await api.post("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setError(null);
    // Reset form to current user data
    setFormData({
      username: user.username || "",
      email: user.email || "",
      fullName: user.fullName || "",
      phone: user.phone || "",
      department: user.department || "",
      position: user.position || "",
      bio: user.bio || ""
    });
  };

  if (loading) {
    return (
      <Container className="mt-4 employees-container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4 employees-container profile-container">
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

      <Row className="mb-4">
        <Col>
          <h2 className="employees-title">My Profile</h2>
        </Col>
      </Row>

      <Row>
        {/* Profile Card */}
        <Col lg={4} className="mb-4">
          <Card className="profile-card">
            <Card.Body className="text-center">
              <div className="profile-avatar-large mb-3">
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
              <h4 className="profile-username">{user?.fullName || user?.username || "User"}</h4>
              <p className="text-muted profile-position">{user?.position || "Employee"}</p>
              {user?.department && (
                <div className="profile-badge">
                  <BsBuilding className="me-2" />
                  {user.department}
                </div>
              )}
              
              <div className="profile-stats mt-4">
                <div className="profile-stat">
                  <div className="stat-label">Member Since</div>
                  <div className="stat-value">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                <div className="profile-stat">
                  <div className="stat-label">Last Updated</div>
                  <div className="stat-value">
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="mt-4 w-100"
                style={{ background: "#135D66", borderColor: "#135D66" }}
                onClick={() => setShowPasswordModal(true)}
              >
                <BsShield className="me-2" />
                Change Password
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Profile Details */}
        <Col lg={8}>
          <Card className="profile-card">
            <Card.Body>
              <Tabs defaultActiveKey="details" className="profile-tabs mb-4">
                <Tab eventKey="details" title="Profile Details">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Personal Information</h5>
                    {!editMode && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setEditMode(true)}
                        style={{ borderColor: "#135D66", color: "#135D66" }}
                      >
                        <BsPencilSquare className="me-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  <Form onSubmit={handleUpdateProfile}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <BsPerson className="me-2" />
                            Username
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <BsEnvelope className="me-2" />
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <BsPerson className="me-2" />
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="Enter your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <BsTelephone className="me-2" />
                            Phone
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="Enter your phone number"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <BsBuilding className="me-2" />
                            Department
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="Enter your department"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <BsBriefcase className="me-2" />
                            Position
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="Enter your position"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Tell us about yourself..."
                      />
                    </Form.Group>

                    {editMode && (
                      <div className="d-flex gap-2">
                        <Button 
                          type="submit" 
                          variant="primary"
                          style={{ background: "#135D66", borderColor: "#135D66" }}
                        >
                          Save Changes
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline-secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Form>
                </Tab>

                <Tab eventKey="activity" title="Activity">
                  <div className="profile-activity">
                    <h5 className="mb-4">Recent Activity</h5>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <BsPerson />
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">Profile Created</div>
                        <div className="activity-date">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <BsPencilSquare />
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">Last Profile Update</div>
                        <div className="activity-date">
                          {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => {
        setShowPasswordModal(false);
        setPasswordError(null);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleChangePassword}>
          <Modal.Body>
            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Enter current password"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Enter new password"
                minLength={6}
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Confirm new password"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordError(null);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              style={{ background: "#135D66", borderColor: "#135D66" }}
            >
              Change Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Profile;
