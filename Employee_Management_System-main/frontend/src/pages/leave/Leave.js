import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Button, Modal, Row, Col, Form as RBForm } from "react-bootstrap";
import { BsPencilSquare, BsTrash, BsEye } from 'react-icons/bs';
import api from "../../services/api";
import "../header/header.css";
import "../employee/Employees.css";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formData, setFormData] = useState({ employeeName: "", startDate: "", endDate: "", reason: "", status: "Pending" });
  const [editId, setEditId] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchLeaves = async () => {
    try {
      const response = await api.get("/leave");
      setLeaves(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch leave records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/leave/${id}`);
      setLeaves(leaves.filter(l => l.id !== id));
    } catch (err) {
      setError("Failed to delete record.");
    }
  };

  const handleEdit = (record) => {
    setModalType("edit");
    setEditId(record.id);
    setFormData({ employeeName: record.employeeName, startDate: record.startDate, endDate: record.endDate, reason: record.reason, status: record.status });
    setShowModal(true);
  };

  const handleAdd = () => {
    setModalType("add");
    setEditId(null);
    setFormData({ employeeName: "", startDate: "", endDate: "", reason: "", status: "Pending" });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({ employeeName: "", startDate: "", endDate: "", reason: "", status: "Pending" });
    setEditId(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "add") {
        const response = await api.post("/leave", formData);
        setLeaves([...leaves, response.data.data]);
      } else {
        const response = await api.patch(`/leave/${editId}`, formData);
        setLeaves(leaves.map(l => l.id === editId ? response.data.data : l));
      }
      handleModalClose();
    } catch (err) {
      setError("Failed to save record.");
    }
  };

  // Filtered leaves
  const filteredLeaves = leaves.filter(l => {
    const matchesSearch = (l.employeeName && l.employeeName.toLowerCase().includes(search.toLowerCase())) || (l.reason && l.reason.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus ? l.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaves = filteredLeaves.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="mt-4 employees-container">
      <div className="dashboard-section employees-controls mb-3">
        <div className="d-flex flex-wrap align-items-center w-100" style={{gap: '1rem'}}>
          <RBForm.Control
            type="text"
            placeholder="Search by Employee Name or Reason"
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </RBForm.Select>
          <div style={{flex: 1}}></div>
          <Button 
            variant="primary" 
            className="add-employee-btn ms-auto" 
            onClick={handleAdd}
            size="md"
          >
            Add Leave
          </Button>
        </div>
      </div>
      <div className="dashboard-section">
        <h2 className="employees-title">Leave Records</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover className="employees-table dashboard-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeaves.map(record => (
                <tr key={record.id}>
                  <td>{record.employeeName}</td>
                  <td>{record.startDate}</td>
                  <td>{record.endDate}</td>
                  <td>{record.reason}</td>
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
        {!loading && !error && filteredLeaves.length > 0 && (
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
      {/* Add/Edit Leave Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "add" ? "Add Leave" : "Edit Leave"}</Modal.Title>
        </Modal.Header>
        <RBForm onSubmit={handleModalSubmit}>
          <Modal.Body>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Employee Name</RBForm.Label>
              <RBForm.Control type="text" name="employeeName" value={formData.employeeName} onChange={handleInputChange} required />
            </RBForm.Group>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Start Date</RBForm.Label>
              <RBForm.Control type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
            </RBForm.Group>
            <RBForm.Group className="mb-3">
              <RBForm.Label>End Date</RBForm.Label>
              <RBForm.Control type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
            </RBForm.Group>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Reason</RBForm.Label>
              <RBForm.Control type="text" name="reason" value={formData.reason} onChange={handleInputChange} required />
            </RBForm.Group>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Status</RBForm.Label>
              <RBForm.Select name="status" value={formData.status} onChange={handleInputChange} required>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </RBForm.Select>
            </RBForm.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
            <Button variant="primary" type="submit">{modalType === "add" ? "Add" : "Save"}</Button>
          </Modal.Footer>
        </RBForm>
      </Modal>
      {/* View Leave Modal */}
      <Modal show={!!viewRecord} onHide={() => setViewRecord(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Leave Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewRecord && (
            <div className="p-2">
              <h5 className="mb-3">Employee Name: <span style={{color:'#c84662'}}>{viewRecord.employeeName}</span></h5>
              <p><strong>Start Date:</strong> {viewRecord.startDate}</p>
              <p><strong>End Date:</strong> {viewRecord.endDate}</p>
              <p><strong>Reason:</strong> {viewRecord.reason}</p>
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

export default Leave;
