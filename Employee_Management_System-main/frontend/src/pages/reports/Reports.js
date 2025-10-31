import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Table, Spinner, Alert } from "react-bootstrap";
import { BsPeople, BsCalendar3, BsFileText, BsSearch, BsChevronLeft, BsChevronRight, BsDownload, BsPrinter } from 'react-icons/bs';
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
      <Card className="dashboard-section mb-3">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-medium">Select Employee</Form.Label>
                <Form.Select
                  value={selectedEmployee?.id || ""}
                  onChange={(e) => {
                    const emp = reportsData?.employees?.find(emp => emp.id === parseInt(e.target.value));
                    if (emp) {
                      handleEmployeeSelect(emp);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">-- Select an employee --</option>
                  {reportsData?.employees?.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department || 'No Department'}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-medium">Or Search Employee</Form.Label>
                <div className="position-relative">
                  <BsSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#999", zIndex: 1 }} />
                  <Form.Control
                    type="text"
                    placeholder="Search by Name / Email / Department..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowEmployeeDropdown(true);
                    }}
                    onFocus={() => setShowEmployeeDropdown(true)}
                    onBlur={() => setTimeout(() => setShowEmployeeDropdown(false), 200)}
                    style={{ paddingLeft: "40px" }}
                  />
                  
                  {showEmployeeDropdown && searchTerm && filteredEmployees.length > 0 && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      marginTop: "4px",
                      background: "white",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                      maxHeight: "300px",
                      overflowY: "auto"
                    }}>
                      {filteredEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => handleEmployeeSelect(emp)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #f0f0f0"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                        >
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "#135D66",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "500",
                            marginRight: "12px"
                          }}>
                            {emp.name?.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "500", color: "#2C3E50" }}>{emp.name}</div>
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
            </Col>
          </Row>
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
          <Alert variant="info" className="mb-3" style={{ 
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
                  variant="outline-primary"
                  size="sm"
                  onClick={handleExportCSV}
                  style={{ borderColor: "#135D66", color: "#135D66", fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
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
          </Alert>

          <Row className="g-3">
            {/* Left Section - Employee Details & Attendance Table */}
            <Col lg={6}>
              {/* Employee Details - Compact */}
              <Card className="dashboard-section mb-3">
                <Card.Body className="py-2 px-3">
                  <div className="dashboard-section-title mb-2" style={{ paddingBottom: "0.5rem", fontSize: "1rem" }}>
                    <BsPeople className="me-2" />
                    Employee Details
                  </div>
                  <Row className="g-2">
                    <Col sm={6}>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Name:</small>
                      <div className="fw-medium" style={{ fontSize: "0.88rem" }}>{employeeReport.employee.name}</div>
                    </Col>
                    <Col sm={6}>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Email:</small>
                      <div className="fw-medium" style={{ fontSize: "0.88rem" }}>{employeeReport.employee.email}</div>
                    </Col>
                    <Col sm={6}>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Department:</small>
                      <div className="fw-medium" style={{ fontSize: "0.88rem" }}>{employeeReport.employee.department}</div>
                    </Col>
                    <Col sm={6}>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Phone:</small>
                      <div className="fw-medium" style={{ fontSize: "0.88rem" }}>{employeeReport.employee.phone}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

            {/* Attendance Records Table - Positioned here */}
            {employeeReport.attendance?.length > 0 && (
              <Card className="dashboard-section mb-3">
                <Card.Body className="p-0">
                  <div style={{ maxHeight: "265px", overflowY: "auto" }}>
                    <Table className="dashboard-table mb-0">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeeReport.attendance.slice(0, 8).map((record, index) => (
                          <tr key={index}>
                            <td>{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                            <td>
                              <span className={`status-badge status-${record.status.toLowerCase()}`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  {employeeReport.attendance.length > 8 && (
                    <div className="text-center py-2" style={{ background: "#f8f9fa", fontSize: "11px", color: "#6c757d" }}>
                      Showing 8 of {employeeReport.attendance.length} records
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Right Section - Calendar */}
          <Col lg={6}>
            <Card className="dashboard-section mb-3" style={{ height: "fit-content" }}>
              <Card.Body className="py-3">
                <div className="dashboard-section-title mb-3">
                  <BsCalendar3 className="me-2" />
                  Attendance Calendar
                </div>

                {/* Calendar Navigation */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Button
                    variant="link"
                    onClick={handlePreviousMonth}
                    style={{ color: "#135D66", textDecoration: "none", padding: "4px" }}
                  >
                    <BsChevronLeft size={20} />
                  </Button>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: "15px" }}>{monthNames[currentMonth - 1]} {currentYear}</h6>
                  <Button
                    variant="link"
                    onClick={handleNextMonth}
                    style={{ color: "#135D66", textDecoration: "none", padding: "4px" }}
                  >
                    <BsChevronRight size={20} />
                  </Button>
                </div>

                {/* Calendar */}
                <div className="calendar-grid" style={{ height: "360px" }}>
                  <div className="calendar-header">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="calendar-day-name" style={{ fontSize: "12px", padding: "4px", height: "30px" }}>{day}</div>
                    ))}
                  </div>
                  <div className="calendar-body" style={{ height: "330px" }}>
                    {generateCalendar().map((week, weekIndex) => (
                      <div key={weekIndex} className="calendar-week" style={{ height: "55px" }}>
                        {week.map((dayObj, dayIndex) => {
                          const today = new Date();
                          const isToday = dayObj && 
                            dayObj.day === today.getDate() && 
                            currentMonth === (today.getMonth() + 1) && 
                            currentYear === today.getFullYear();
                          
                          // Check if it's weekend (Saturday = 6, Sunday = 0)
                          const isWeekend = dayObj && dayIndex === 0 || dayIndex === 6;
                          
                          // Determine the status for this day (only one status possible)
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
                              key={dayIndex}
                              className={`calendar-day ${!dayObj ? 'empty' : ''}`}
                              style={{ 
                                height: "55px",
                                backgroundColor: isToday ? '#135D66' : '',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '8px'
                              }}
                            >
                              {dayObj && (
                                <>
                                  <div className="day-number" style={{ 
                                    fontSize: "13px", 
                                    fontWeight: isToday ? '600' : '400',
                                    color: isToday ? 'white' : 'inherit'
                                  }}>{dayObj.day}</div>
                                  
                                  {/* Show weekend/holiday yellow dot */}
                                  {isWeekend && !dayStatus && (
                                    <div style={{
                                      position: 'absolute',
                                      bottom: '8px',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      width: '8px',
                                      height: '8px',
                                      borderRadius: '50%',
                                      backgroundColor: '#ffc107'
                                    }} title="Weekend/Holiday"></div>
                                  )}
                                  
                                  {/* Show green dot for present */}
                                  {dayStatus === 'present' && (
                                    <div style={{
                                      position: 'absolute',
                                      bottom: '8px',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      width: '8px',
                                      height: '8px',
                                      borderRadius: '50%',
                                      backgroundColor: '#28a745'
                                    }} title="Present"></div>
                                  )}
                                  
                                  {/* Show red dot for absent */}
                                  {dayStatus === 'absent' && (
                                    <div style={{
                                      position: 'absolute',
                                      bottom: '8px',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      width: '8px',
                                      height: '8px',
                                      borderRadius: '50%',
                                      backgroundColor: '#dc3545'
                                    }} title="Absent"></div>
                                  )}
                                  
                                  {/* Show yellow dot for leave */}
                                  {dayStatus === 'leave' && (
                                    <div style={{
                                      position: 'absolute',
                                      bottom: '8px',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      width: '8px',
                                      height: '8px',
                                      borderRadius: '50%',
                                      backgroundColor: '#ffc107'
                                    }} title="On Leave"></div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="calendar-legend mt-2" style={{ height: "30px" }}>
                  <div className="legend-item">
                    <span style={{ 
                      display: 'inline-block',
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#28a745',
                      marginRight: '6px'
                    }}></span>
                    <span style={{ fontSize: "11px" }}>Present</span>
                  </div>
                  <div className="legend-item">
                    <span style={{ 
                      display: 'inline-block',
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#dc3545',
                      marginRight: '6px'
                    }}></span>
                    <span style={{ fontSize: "11px" }}>Absent</span>
                  </div>
                  <div className="legend-item">
                    <span style={{ 
                      display: 'inline-block',
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ffc107',
                      marginRight: '6px'
                    }}></span>
                    <span style={{ fontSize: "11px" }}>Weekend/Holiday</span>
                  </div>
                  <div className="legend-item">
                    <span style={{ 
                      display: 'inline-block',
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '2px', 
                      backgroundColor: '#135D66',
                      marginRight: '6px'
                    }}></span>
                    <span style={{ fontSize: "11px" }}>Today</span>
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
