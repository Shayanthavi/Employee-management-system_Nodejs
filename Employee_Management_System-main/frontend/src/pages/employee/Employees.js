import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Button, Modal, Form as RBForm, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { BsPencilSquare, BsTrash, BsEye } from 'react-icons/bs';
import "../header/header.css";
import "./Employees.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", department: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [viewRecord, setViewRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employee/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      setError("Failed to delete employee.");
    }
  };

  const handleEdit = (emp) => {
    setModalType("edit");
    setEditId(emp.id);
    setFormData({ name: emp.name, email: emp.email, phone: emp.phone, department: emp.department });
    setShowModal(true);
  };

  const handleAdd = () => {
    setModalType("add");
    setEditId(null);
    setFormData({ name: "", email: "", phone: "", department: "" });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", department: "" });
    setEditId(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "add") {
        const response = await api.post("/employee", formData);
        setEmployees([...employees, response.data.data]);
      } else {
        const response = await api.patch(`/employee/${editId}`, formData);
        setEmployees(employees.map(emp => emp.id === editId ? response.data.data : emp));
      }
      handleModalClose();
    } catch (err) {
      setError("Failed to save employee.");
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept ? emp.department === filterDept : true;
    return matchesSearch && matchesDept;
  });

  // Get unique departments for filter dropdown
  const departments = Array.from(new Set(employees.map(emp => emp.department))).filter(Boolean);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="mt-4 employees-container">
      <div className="dashboard-section employees-controls mb-3">
        <div className="d-flex flex-wrap align-items-center w-100" style={{gap: '1rem'}}>
          <RBForm.Control
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-bar"
            style={{maxWidth: 260}}
          />
          <RBForm.Select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="filter-dropdown"
            style={{maxWidth: 180}}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </RBForm.Select>
          <div style={{flex: 1}}></div>
          <Button 
            variant="primary" 
            className="add-employee-btn ms-auto" 
            onClick={handleAdd}
            size="md"
          >
            Add Employee
          </Button>
        </div>
      </div>
      <div className="dashboard-section">
        <h2 className="employees-title">All Employees</h2>
        {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
  <Table striped bordered hover className="employees-table dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department}</td>
                <td>
                  <button className="action-icon-btn edit me-2" onClick={() => handleEdit(emp)} title="Edit">
                    <span><BsPencilSquare /></span>
                  </button>
                  <button className="action-icon-btn delete me-2" onClick={() => handleDelete(emp.id)} title="Delete">
                    <span><BsTrash /></span>
                  </button>
                  <button className="action-icon-btn view" onClick={() => setViewRecord(emp)} title="View">
                    <span><BsEye /></span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        )}
        
        {/* Pagination Controls */}
        {!loading && !error && filteredEmployees.length > 0 && (
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
          <Modal.Title>{modalType === "add" ? "Add Employee" : "Edit Employee"}</Modal.Title>
        </Modal.Header>
        <RBForm onSubmit={handleModalSubmit}>
          <Modal.Body>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Name</RBForm.Label>
              <RBForm.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </RBForm.Group>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Email</RBForm.Label>
              <RBForm.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </RBForm.Group>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Phone</RBForm.Label>
              <RBForm.Control type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </RBForm.Group>
            <RBForm.Group className="mb-3">
              <RBForm.Label>Department</RBForm.Label>
              <RBForm.Control type="text" name="department" value={formData.department} onChange={handleInputChange} required />
            </RBForm.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
            <Button variant="primary" type="submit">{modalType === "add" ? "Add" : "Save"}</Button>
          </Modal.Footer>
        </RBForm>
      </Modal>

      {/* View Employee Modal */}
      <Modal show={!!viewRecord} onHide={() => setViewRecord(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewRecord && (
            <div className="p-2">
              <h5 className="mb-3">Name: <span style={{color:'#c84662'}}>{viewRecord.name}</span></h5>
              <p><strong>Email:</strong> {viewRecord.email}</p>
              <p><strong>Phone:</strong> {viewRecord.phone}</p>
              <p><strong>Department:</strong> {viewRecord.department}</p>
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

export default Employees;
