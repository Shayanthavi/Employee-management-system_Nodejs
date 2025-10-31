import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Button, Modal, Row, Col, Form as RBForm } from "react-bootstrap";
import api from "../../services/api";
import { BsPencilSquare, BsTrash, BsEye } from 'react-icons/bs';
import "../header/header.css";
import "../employee/Employees.css";
import "./AttendanceModern.css";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formData, setFormData] = useState({ employeeName: "", date: "", status: "Present" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewRecord, setViewRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/attendance");
      setAttendance(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/attendance/${id}`);
      setAttendance(attendance.filter(a => a.id !== id));
    } catch (err) {
      setError("Failed to delete record.");
    }
  };

  const handleEdit = (record) => {
    setModalType("edit");
    setEditId(record.id);
    setFormData({ employeeName: record.employeeName, date: record.date, status: record.status });
    setShowModal(true);
  };

  const handleAdd = () => {
    setModalType("add");
    setEditId(null);
    setFormData({ employeeName: "", date: "", status: "Present" });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({ employeeName: "", date: "", status: "Present" });
    setEditId(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "add") {
        const response = await api.post("/attendance", formData);
        setAttendance([...attendance, response.data.data]);
      } else {
        const response = await api.patch(`/attendance/${editId}`, formData);
        setAttendance(attendance.map(a => a.id === editId ? response.data.data : a));
      }
      handleModalClose();
    } catch (err) {
      setError("Failed to save record.");
    }
  };

  // Filtered attendance
  const filteredAttendance = attendance.filter(a => {
    const matchesSearch = (a.employeeName && a.employeeName.toLowerCase().includes(search.toLowerCase())) || (a.date && a.date.includes(search));
    const matchesStatus = filterStatus ? a.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttendance = filteredAttendance.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="mt-4 employees-container">
      <div className="dashboard-section employees-controls mb-3">
        <div className="d-flex flex-wrap align-items-center w-100" style={{gap: '1rem'}}>
          <RBForm.Control
            type="text"
            placeholder="Search by Employee ID or Date"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-bar"
            style={{maxWidth: 260}}
          />
          <RBForm.Select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="filter-dropdown"
            style={{maxWidth: 180}}
          >
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </RBForm.Select>
          <div style={{flex: 1}}></div>
          <Button 
            variant="primary" 
            className="add-employee-btn ms-auto" 
            onClick={handleAdd}
            size="md"
          >
            Add Attendance
          </Button>
        </div>
      </div>
      <div className="dashboard-section">
        <h2 className="employees-title">Attendance Records</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover className="employees-table dashboard-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAttendance.map(record => (
                <tr key={record.id}>
                  <td>{record.employeeName}</td>
                  <td>{record.date}</td>
                  <td>{record.status}</td>
                  <td>
                    <button className="action-icon-btn edit me-2" onClick={() => handleEdit(record)} title="Edit">
                      <span><BsPencilSquare /></span>
                    </button>
                    <button className="action-icon-btn delete me-2" onClick={() => handleDelete(record.id)} title="Delete">
                      <span><BsTrash /></span>
                    </button>
                    <button className="action-icon-btn view" onClick={() => setViewRecord(record)} title="View">
                      <span><BsEye /></span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        
        {/* Pagination Controls */}
        {!loading && !error && filteredAttendance.length > 0 && (
          <div className="pagination-container">
            <button 
              className="pagination-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              className="pagination-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "add" ? "Add Attendance" : "Edit Attendance"}</Modal.Title>
        </Modal.Header>
        <RBForm onSubmit={handleModalSubmit}>
          <Modal.Body>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Employee Name</RBForm.Label>
              <RBForm.Control type="text" name="employeeName" value={formData.employeeName} onChange={handleInputChange} required />
            </RBForm.Group>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Date</RBForm.Label>
              <RBForm.Control type="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </RBForm.Group>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Status</RBForm.Label>
              <RBForm.Select name="status" value={formData.status} onChange={handleInputChange} required>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </RBForm.Select>
            </RBForm.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
            <Button variant="primary" type="submit">{modalType === "add" ? "Add" : "Save"}</Button>
          </Modal.Footer>
        </RBForm>
      </Modal>

      {/* View Attendance Modal */}
      <Modal show={!!viewRecord} onHide={() => setViewRecord(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Attendance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewRecord && (
            <div className="p-2">
              <h5 className="mb-3">Employee Name: <span style={{color:'#c84662'}}>{viewRecord.employeeName}</span></h5>
              <p><strong>Date:</strong> {viewRecord.date}</p>
              <p><strong>Status:</strong> {viewRecord.status}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewRecord(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Attendance;
