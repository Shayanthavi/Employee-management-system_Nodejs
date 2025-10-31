import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Alert, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import "./Dashboard.css";
import { FaUsers, FaCalendarCheck, FaCalendarAlt } from "react-icons/fa";
import { UserCheck, CalendarClock, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        
        // Fetch all data from separate endpoints
        const [empRes, attRes, leaveRes] = await Promise.all([
          api.get("/employees"),
          api.get("/attendance"),
          api.get("/leave")
        ]);
        
        // Add status to employees (active by default, can be enhanced based on business logic)
        const employeesWithStatus = (empRes.data.data || []).map(emp => ({
          ...emp,
          status: emp.status || 'active' // Default to active if not set
        }));
        
        setEmployees(employeesWithStatus);
        setAttendance(attRes.data.data || []);
        setLeaves(leaveRes.data.data || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await api.delete(`/employees/${employeeId}`);
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee. Please try again.");
    }
  }

  const handleUpdate = (employeeId) => {
    navigate(`/employee/${employeeId}`);
  }

  // Recent activity (last 5 attendance and leave records)
  const recentAttendance = attendance.slice(-5).reverse();
  const recentLeaves = leaves.slice(-5).reverse();

  if (loading) {
    return (
      <div className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading dashboard data...</p>
      </div>
    );
  }


  // New summary card calculations
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const pendingLeaves = leaves.filter(l => l.status && l.status.toLowerCase() === 'pending').length;
  const approvedLeaves = leaves.filter(l => l.status && l.status.toLowerCase() === 'approved').length;
  const rejectedLeaves = leaves.filter(l => l.status && l.status.toLowerCase() === 'rejected').length;
  const today = new Date().toISOString().slice(0, 10);
  
  // Department-wise employee distribution
  const deptCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  const departmentData = Object.entries(deptCounts).map(([name, value]) => ({
    name,
    value,
    color: '#135D66'
  }));

  // Today's attendance - Present vs Absent (all employees not marked present are absent)
  const todayAttendanceRecords = attendance.filter(a => (a.date || a.startDate || '').slice(0, 10) === today);
  const presentToday = todayAttendanceRecords.filter(a => a.status === 'Present').length;
  const absentToday = employees.length - presentToday; // All not present are absent
  
  const attendanceComparisonData = [
    { name: 'Present', value: presentToday, color: '#135D66' },
    { name: 'Absent', value: absentToday, color: '#E8E8E8' }
  ];

  const leaveStatusData = [
    { name: 'Pending', value: pendingLeaves, color: '#135D66' },
    { name: 'Approved', value: approvedLeaves, color: '#77B0AA' },
    { name: 'Rejected', value: rejectedLeaves, color: '#E8E8E8' }
  ];

  return (

  <div className="dashboard-container"> 
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Responsive summary cards row */}
      <div className={`dashboard-summary-row-grid`}>
        <div className="dashboard-summary-card dashboard-section">
          <div className="dashboard-summary-label"><FaUsers className="dashboard-summary-icon" style={{marginRight:8, color:'#135D66'}}/>Total Employees</div>
          <div className="dashboard-summary-value-row" style={{justifyContent:'space-between'}}>
            <div className="dashboard-summary-value" style={{textAlign:'left'}}>{employees.length}</div>
            <ResponsiveContainer width={60} height={40}>
              <PieChart>
                <Pie data={departmentData} dataKey="value" cx="50%" cy="50%" innerRadius={12} outerRadius={18}>
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#135D66' : '#E8E8E8'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="dashboard-summary-card dashboard-section">
          <div className="dashboard-summary-label"><UserCheck style={{marginRight:8, color:'#135D66'}} size={22}/> Departments</div>
          <div className="dashboard-summary-value-row" style={{justifyContent:'space-between'}}>
            <div className="dashboard-summary-value" style={{textAlign:'left'}}>{Object.keys(deptCounts).length}</div>
            <div style={{height:'28px',width:'60px',background:'#E8E8E8',borderRadius:'6px',overflow:'hidden',display:'flex',alignItems:'center'}}>
              <div style={{height:'100%',width:`${Math.min(Object.keys(deptCounts).length/10,1)*100}%`,background:'#135D66',transition:'width 0.3s'}}></div>
            </div>
          </div>
        </div>
        <div className="dashboard-summary-card dashboard-section">
          <div className="dashboard-summary-label"><CalendarClock style={{marginRight:8, color:'#135D66'}} size={22}/> Today's Attendance</div>
          <div className="dashboard-summary-value-row" style={{justifyContent:'space-between'}}>
            <div className="dashboard-summary-value" style={{textAlign:'left'}}>{presentToday}</div>
            <ResponsiveContainer width={60} height={40}>
              <PieChart>
                <Pie data={attendanceComparisonData} dataKey="value" cx="50%" cy="50%" innerRadius={12} outerRadius={18}>
                  {attendanceComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="dashboard-summary-card dashboard-section">
          <div className="dashboard-summary-label"><FaCalendarAlt className="dashboard-summary-icon" style={{marginRight:8, color:'#135D66'}}/>Total Leave Requests</div>
          <div className="dashboard-summary-value-row" style={{justifyContent:'space-between'}}>
            <div className="dashboard-summary-value" style={{textAlign:'left'}}>{leaves.length}</div>
            <ResponsiveContainer width={60} height={40}>
              <PieChart>
                <Pie data={leaveStatusData} dataKey="value" cx="50%" cy="50%" innerRadius={12} outerRadius={18}>
                  {leaveStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="dashboard-summary-card dashboard-section">
          <div className="dashboard-summary-label"><Users style={{marginRight:8, color:'#135D66'}} size={22}/> Pending Leave Requests</div>
          <div className="dashboard-summary-value-row" style={{justifyContent:'space-between'}}>
            <div className="dashboard-summary-value" style={{textAlign:'left'}}>{pendingLeaves}</div>
            <div style={{height:'28px',width:'60px',background:'#E8E8E8',borderRadius:'6px',overflow:'hidden',display:'flex',alignItems:'center'}}>
              <div style={{height:'100%',width:`${leaves.length > 0 ? (pendingLeaves/leaves.length)*100 : 0}%`,background:'#135D66',transition:'width 0.3s'}}></div>
            </div>
          </div>
        </div>
      </div>

  <div className="dashboard-row-cards" style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'1.1rem'}}>
        <div className="dashboard-section" style={{flex:'1 1 340px',minWidth:'320px'}}>
          <div className="dashboard-section-title" style={{display:'flex',alignItems:'center',gap:8}}>
            <FaCalendarCheck style={{fontSize:'1.3em'}} /> Recent Attendance
          </div>
          <Table size="sm" className="dashboard-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.map(a => (
                <tr key={a.id}>
                  <td>{a.employeeName}</td>
                  <td>{a.date || a.startDate}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="dashboard-section" style={{flex:'1 1 340px',minWidth:'320px'}}>
          <div className="dashboard-section-title" style={{display:'flex',alignItems:'center',gap:8}}>
            <FaCalendarAlt style={{color:'var(--accent, #77B0AA)',fontSize:'1.3em'}} /> Recent Leave Requests
          </div>
          <Table size="sm" className="dashboard-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeaves.map(l => (
                <tr key={l.id}>
                  <td>{l.employeeName}</td>
                  <td>{l.startDate}</td>
                  <td>{l.endDate}</td>
                  <td>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="dashboard-row-cards" style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'1.1rem'}}>
        {/* Employees on Leave Today */}
        <div className="dashboard-section" style={{flex:'1 1 340px',minWidth:'320px'}}>
          <div className="dashboard-section-title" style={{display:'flex',alignItems:'center',gap:8}}>
            <FaCalendarAlt style={{color:'var(--accent, #77B0AA)',fontSize:'1.3em'}} /> Employees on Leave Today
          </div>
          <Table size="sm" className="dashboard-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {leaves.filter(l => {
                if (!l.startDate || !l.endDate) return false;
                const today = new Date().toISOString().slice(0, 10);
                return today >= l.startDate && today <= l.endDate;
              }).map(l => (
                <tr key={l.id}>
                  <td>{l.employeeName}</td>
                  <td>{l.startDate}</td>
                  <td>{l.endDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {/* Attendance Trend Chart */}
        <div className="dashboard-section" style={{flex:'1 1 340px',minWidth:'320px'}}>
          <div className="dashboard-section-title" style={{display:'flex',alignItems:'center',gap:8}}>
            <FaCalendarCheck style={{color:'var(--accent, #77B0AA)',fontSize:'1.3em'}} /> Attendance Trend (Last 14 Days)
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={getAttendanceTrend(attendance)}
                dataKey="present"
                nameKey="date"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#77B0AA"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Helper: Attendance trend for last 14 days
function getAttendanceTrend(attendance) {
  const days = 14;
  const today = new Date();
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const present = attendance.filter(a => (a.date || a.startDate || '').slice(0, 10) === dateStr && a.status && a.status.toLowerCase() === 'present').length;
    trend.push({ date: dateStr, present });
  }
  return trend;
}

export default Dashboard;
