import React, { useEffect, useState } from "react";
import { Table, Container, Form, Button, Alert, Spinner } from "react-bootstrap";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/departments");
        const result = await response.json();
        setDepartments(result.data || []);
      } catch (err) {
        setError("Failed to fetch departments.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:8080/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDept })
      });
      const result = await response.json();
      if (result.success) {
        setDepartments([...departments, result.data]);
        setSuccess("Department added successfully.");
        setNewDept("");
      } else {
        setError(result.message || "Failed to add department.");
      }
    } catch (err) {
      setError("Failed to add department.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Departments</h2>
      <Form onSubmit={handleAddDepartment} className="mb-3">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="New Department Name"
            value={newDept}
            onChange={e => setNewDept(e.target.value)}
            required
          />
        </Form.Group>
  <Button type="submit" className="btn mt-2">Add Department</Button>
      </Form>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
  <Table className="table"> 
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dept => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Departments;
