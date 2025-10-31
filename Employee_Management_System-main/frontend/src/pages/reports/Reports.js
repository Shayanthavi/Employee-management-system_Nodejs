import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Table, Spinner, Alert } from "react-bootstrap";
import { BsPeople, BsCalendar3, BsFileText, BsSearch, BsChevronLeft, BsChevronRight, BsDownload, BsPrinter, BsTelephone } from 'react-icons/bs';
import api from "../../services/api";
import "./Reports.css";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employeeReport, setEmployeeReport] = useState(null);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState({});

  // Filters
  const [filterDepartment, setFilterDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch reports data
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      if (filterDepartment) queryParams.push(`departmentId=${filterDepartment}`);
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      
      const response = await api.get(`/reports${queryString}`);
      setReportsData(response.data.data);
    } catch (err) {
      setError("Failed to load reports. Please try again.");
      console.error("Fetch reports error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch calendar data
  const fetchCalendarData = async () => {
    if (!selectedEmployee) return;
    
    try {
      const response = await api.get(`/reports/calendar?month=${currentMonth}&year=${currentYear}&employeeId=${selectedEmployee.id}`);
      if (response.data && response.data.data) {
        setCalendarData(response.data.data);
      }
    } catch (err) {
      console.error("Fetch calendar error:", err);
      // Don't show error for calendar, it's optional
    }
  };

  // Handle employee selection
  const handleEmployeeSelect = async (employee) => {
    setSelectedEmployee(employee);
    setSearchTerm(employee.name);
    setShowEmployeeDropdown(false);
    await fetchEmployeeReport(employee.id);
  };

  // Fetch employee report
  const fetchEmployeeReport = async (employeeId) => {
    try {
      setLoadingEmployee(true);
      setError(null);
      let queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      
      const response = await api.get(`/reports/employee/${employeeId}${queryString}`);
      
      if (response.data && response.data.success) {
        setEmployeeReport(response.data.data);
        // Fetch calendar data after successful employee report fetch
        fetchCalendarData();
      } else {
        throw new Error(response.data?.message || 'Failed to fetch employee report');
      }
    } catch (err) {
      console.error("Fetch employee report error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load employee report. Please try again.";
      setError(errorMessage);
      setSelectedEmployee(null);
      setEmployeeReport(null);
      setCalendarData({});
    } finally {
      setLoadingEmployee(false);
    }
  };

  // Filter employees based on search
  const filteredEmployees = reportsData?.employees?.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Format currency
  const formatCurrency = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  // Handle print
  const handlePrint = () => {
    if (!employeeReport) return;
    window.print();
  };

  // Handle export CSV
  const handleExportCSV = () => {
    if (!employeeReport) return;
    
    const csvContent = [
      ['Employee Report'],
      ['Name', employeeReport.employee.name],
      ['Email', employeeReport.employee.email],
      ['Department', employeeReport.employee.department],
      [''],
      ['Attendance Summary'],
      ['Total Days', employeeReport.statistics.totalDays],
      ['Present Days', employeeReport.statistics.presentDays],
      ['Absent Days', employeeReport.statistics.absentDays],
      ['Attendance Rate', `${employeeReport.statistics.attendanceRate}%`]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employeeReport.employee.name}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate, filterDepartment]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchCalendarData();
    }
  }, [currentMonth, currentYear, selectedEmployee]);

  // Generate calendar
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    let week = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = calendarData[dateStr] || { present: 0, absent: 0, leave: 0, total: 0 };
      
      week.push({
        day,
        date: dateStr,
        data: dayData
      });

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Add remaining empty cells
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }

    return calendar;
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  if (loading) {
    return (
      <div className="reports-container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" style={{ color: "#135D66" }} />
      </div>
    );
  }

  return (
    <div className="reports-container">
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3">
            <BsFileText style={{ color: "#135D66", fontSize: "28px" }} />
            <div>
              <h2 className="reports-title mb-1">Employee Reports & Analytics</h2>
              <p className="text-muted mb-0" style={{ fontSize: "14px" }}>View detailed reports and attendance for employees</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Search and Select Employee Section */}
      <Card className="dashboard-section mb-3" style={{ maxWidth: "1400px", margin: "0 auto" }}>
  <Card.Body style={{ background: "#fff", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #e5e7eb" }}>
          <Form.Group>
            <Form.Label className="fw-medium" style={{ fontSize: "1.05rem", color: "#135D66", fontWeight: 600, marginBottom: "0.5rem" }}>Search Employee</Form.Label>
            <div className="position-relative" style={{ marginBottom: "0.5rem" }}>
              <BsSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#135D66", zIndex: 2, fontSize: "1.1rem" }} />
              <Form.Control
                type="text"
                placeholder="Search by Name, Email, or Department"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowEmployeeDropdown(true);
                }}
                onFocus={() => setShowEmployeeDropdown(true)}
                onBlur={() => setTimeout(() => setShowEmployeeDropdown(false), 200)}
                style={{
                  paddingLeft: "40px",
                  borderRadius: "8px",
                  border: "1.5px solid #135D66",
                  fontSize: "1.05rem",
                  background: "#f8f9fa",
                  color: "#003C43",
                  fontWeight: 500,
                  boxShadow: "0 1px 4px rgba(19,93,102,0.07)",
                  transition: "border-color 0.2s, box-shadow 0.2s"
                }}
                autoComplete="off"
                onMouseOver={e => e.currentTarget.style.borderColor = '#28a745'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#135D66'}
              />
              {showEmployeeDropdown && searchTerm && filteredEmployees.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: "6px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                  zIndex: 1000,
                  maxHeight: "320px",
                  overflowY: "auto"
                }}>
                  {filteredEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      onMouseDown={() => handleEmployeeSelect(emp)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 14px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                    >
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#135D66",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        marginRight: "12px",
                        fontSize: "1rem"
                      }}>
                        {emp.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "500", color: "#003C43", fontSize: "0.98rem" }}>{emp.name}</div>
                        <div style={{ fontSize: "13px", color: "#6c757d" }}>
                          {emp.email} • {emp.department || 'No Department'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Form.Group>
        </Card.Body>
      </Card>

      {loadingEmployee && (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: "#135D66" }} />
          <p className="mt-2 text-muted">Loading employee report...</p>
        </div>
      )}

      {selectedEmployee && employeeReport && (
        <>
          {/* Today's Status Banner */}
          <div className="mb-3" style={{ 
            background: "linear-gradient(135deg, #E3FEF7 0%, #F0FDFB 100%)", 
            border: "1px solid #77B0AA",
            borderRadius: "12px",
            padding: "1rem 1.5rem"
          }}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <BsPeople style={{ fontSize: "1.5rem", color: "#135D66" }} />
                <div>
                  <h6 className="mb-0" style={{ color: "#003C43", fontWeight: "600" }}>
                    {employeeReport.employee.name} is <span style={{ 
                      color: employeeReport.todayStatus === 'Present' ? '#28a745' : employeeReport.todayStatus === 'Absent' ? '#dc3545' : '#6c757d',
                      fontWeight: "700"
                    }}>
                      {employeeReport.todayStatus || 'Not Marked'}
                    </span> today
                  </h6>
                  <small style={{ color: "#6c757d" }}>
                    Attendance Rate: <strong style={{ color: "#135D66" }}>{employeeReport.statistics.attendanceRate}%</strong> 
                    {' | '} Present: <strong>{employeeReport.statistics.presentDays}</strong> 
                    {' | '} Absent: <strong>{employeeReport.statistics.absentDays}</strong>
                  </small>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExportCSV}
                  style={{
                    background: "#135D66",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    padding: "0.45rem 1.1rem",
                    boxShadow: "0 1px 6px rgba(19,93,102,0.10)",
                    transition: "background 0.2s, box-shadow 0.2s"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#003C43';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(19,93,102,0.18)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#135D66';
                    e.currentTarget.style.boxShadow = '0 1px 6px rgba(19,93,102,0.10)';
                  }}
                >
                  <BsDownload className="me-1" />
                  Export
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handlePrint}
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                >
                  <BsPrinter className="me-1" />
                  Print
                </Button>
              </div>
            </div>
          </div>

          <Row className="g-4">
            {/* Left Section - Employee Details & Stats */}
            <Col lg={6}>
              {/* Employee Details */}
              <Card className="dashboard-section mb-3" style={{ height: "auto" }}>
                <Card.Body style={{ padding: "0.75rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#003C43", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "2px solid #77B0AA", display: "flex", alignItems: "center" }}>
                    <BsPeople className="me-2" size={20} />
                    Employee Details
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BsPeople size={16} style={{ color: "#135D66", marginRight: "0.5rem" }} />
                      <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>Name:</span>
                      <span style={{ marginLeft: "auto", fontWeight: "500", fontSize: "0.9rem" }}>{employeeReport.employee.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BsFileText size={16} style={{ color: "#135D66", marginRight: "0.5rem" }} />
                      <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>Email:</span>
                      <span style={{ marginLeft: "auto", fontWeight: "500", fontSize: "0.9rem" }}>{employeeReport.employee.email}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BsCalendar3 size={16} style={{ color: "#135D66", marginRight: "0.5rem" }} />
                      <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>Department:</span>
                      <span style={{ marginLeft: "auto", fontWeight: "500", fontSize: "0.9rem" }}>{employeeReport.employee.department}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BsTelephone size={16} style={{ color: "#135D66", marginRight: "0.5rem" }} />
                      <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>Phone:</span>
                      <span style={{ marginLeft: "auto", fontWeight: "500", fontSize: "0.9rem" }}>{employeeReport.employee.phone}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Attendance Stats */}
              <Card className="dashboard-section mb-3">
                <Card.Body style={{ padding: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "#003C43", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "2px solid #77B0AA" }}>
                    Attendance Overview
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ background: "#f8f9fa", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", padding: "0.5rem 0.3rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", color: "#2C3E50", fontWeight: "500", marginBottom: "0.05rem" }}>Total Days</div>
                      <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#2C3E50" }}>{employeeReport.statistics.totalDays}</div>
                    </div>
                    <div style={{ background: "#f8f9fa", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", padding: "0.5rem 0.3rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", color: "#2C3E50", fontWeight: "500", marginBottom: "0.05rem" }}>Present</div>
                      <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#28a745" }}>{employeeReport.statistics.presentDays}</div>
                    </div>
                    <div style={{ background: "#f8f9fa", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", padding: "0.5rem 0.3rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", color: "#135D66", fontWeight: "500", marginBottom: "0.05rem" }}>Rate</div>
                      <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#135D66" }}>{employeeReport.statistics.attendanceRate}%</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div style={{ background: "#f8f9fa", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", padding: "0.3rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", color: "#28a745", fontWeight: "500", marginBottom: "0.03rem" }}>Present Days</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#28a745" }}>{employeeReport.statistics.presentDays}</div>
                    </div>
                    <div style={{ background: "#f8f9fa", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", padding: "0.3rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", color: "#dc3545", fontWeight: "500", marginBottom: "0.03rem" }}>Absent Days</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#dc3545" }}>{employeeReport.statistics.absentDays}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

          {/* Right Section - Calendar */}
          <Col lg={6}>
            <Card className="dashboard-section" style={{ height: "520px" }}>
              <Card.Body style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#003C43", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "2px solid #77B0AA", display: "flex", alignItems: "center" }}>
                  <BsCalendar3 className="me-2" size={20} />
                  Attendance Calendar
                </h3>

                {/* Calendar Navigation */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <button
                    onClick={handlePreviousMonth}
                    style={{ 
                      background: "transparent", 
                      border: "none", 
                      cursor: "pointer",
                      padding: "0.25rem",
                      borderRadius: "4px",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#E3FEF7"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <BsChevronLeft size={20} style={{ color: "#135D66" }} />
                  </button>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#003C43", margin: 0 }}>
                    {monthNames[currentMonth - 1]} {currentYear}
                  </h4>
                  <button
                    onClick={handleNextMonth}
                    style={{ 
                      background: "transparent", 
                      border: "none", 
                      cursor: "pointer",
                      padding: "0.25rem",
                      borderRadius: "4px",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#E3FEF7"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <BsChevronRight size={20} style={{ color: "#135D66" }} />
                  </button>
                </div>

                {/* Calendar Days Header */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", marginBottom: "0.25rem", marginTop: "1rem" }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: "500", color: "#5A6C7D", padding: "0.25rem" }}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid - Compact Modern Design */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", marginBottom: "0.5rem" }}>
                  {generateCalendar().map((week, weekIndex) => (
                    week.map((dayObj, dayIndex) => {
                      const today = new Date();
                      const isToday = dayObj && 
                        dayObj.day === today.getDate() && 
                        currentMonth === (today.getMonth() + 1) && 
                        currentYear === today.getFullYear();
                      
                      // Check if it's weekend (Saturday = 6, Sunday = 0)
                      const isWeekend = dayObj && (dayIndex === 0 || dayIndex === 6);
                      
                      // Determine the status for this day
                      let dayStatus = null;
                      if (dayObj && dayObj.data.total > 0) {
                        if (dayObj.data.present > 0) {
                          dayStatus = 'present';
                        } else if (dayObj.data.absent > 0) {
                          dayStatus = 'absent';
                        } else if (dayObj.data.leave > 0) {
                          dayStatus = 'leave';
                        }
                      }
                      
                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          style={{ 
                            height: "2.5rem",
                            width: "100%",
                            backgroundColor: isToday ? '#135D66' : (dayObj ? '#fff' : 'transparent'),
                            border: dayObj ? '1px solid #e5e7eb' : 'none',
                            borderRadius: "0.9rem",
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: "0.875rem",
                            fontWeight: isToday ? '600' : '400',
                            color: isToday ? 'white' : (isWeekend ? '#9ca3af' : '#374151'),
                            cursor: dayObj ? 'pointer' : 'default',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (dayObj && !isToday) {
                              e.currentTarget.style.backgroundColor = '#f3f4f6';
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (dayObj && !isToday) {
                              e.currentTarget.style.backgroundColor = '#fff';
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          {dayObj && (
                            <>
                              <span>{dayObj.day}</span>
                              
                              {/* Status Indicator Dot */}
                              <div style={{
                                position: 'absolute',
                                bottom: '0.25rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '0.375rem',
                                height: '0.375rem',
                                borderRadius: '50%',
                                backgroundColor: 
                                  dayStatus === 'present' ? '#10b981' : 
                                  dayStatus === 'absent' ? '#ef4444' : 
                                  (isWeekend && !dayStatus) ? '#fbbf24' : 
                                  dayStatus === 'leave' ? '#fbbf24' : 
                                  'transparent'
                              }}></div>
                            </>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>

                {/* Legend - Modern Compact Design */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: "1.5rem", 
                  paddingTop: "0.75rem",
                  borderTop: "1px solid #e5e7eb",
                  marginTop: "3.5rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <span style={{ 
                      width: '0.5rem', 
                      height: '0.5rem', 
                      borderRadius: '50%', 
                      backgroundColor: '#10b981',
                      display: 'inline-block'
                    }}></span>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Present</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <span style={{ 
                      width: '0.5rem', 
                      height: '0.5rem', 
                      borderRadius: '50%', 
                      backgroundColor: '#ef4444',
                      display: 'inline-block'
                    }}></span>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Absent</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <span style={{ 
                      width: '0.5rem', 
                      height: '0.5rem', 
                      borderRadius: '50%', 
                      backgroundColor: '#fbbf24',
                      display: 'inline-block'
                    }}></span>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Weekend</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <span style={{ 
                      width: '0.75rem', 
                      height: '0.75rem', 
                      borderRadius: '0.25rem', 
                      backgroundColor: '#135D66',
                      display: 'inline-block'
                    }}></span>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Today</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </>
      )}


    </div>
  );
};

export default Reports;
