import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import {
  getMaintenancesByDate,
  createMaintenance,
  getAllMaintenances
} from '../services/maintenance';
import { getAllEquipments } from '../services/equipment';
import { fetchEmployers } from '../services/employer';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faTools,
  faPlus,
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faExclamationTriangle,
  faClock,
  faWrench,
  faCalendarCheck,
  faUserCog,
  faSave,
  faTimes,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
`;

const MainContent = styled.div`
  margin-left: 270px;
  padding: 2rem;
  flex: 1;
  width: calc(100vw - 270px);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  color: #1e40af;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 2px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
`;

const CardTitle = styled.h2`
  color: #1e40af;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardBody = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &.primary {
    background: linear-gradient(to right, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);

    &:hover {
      background: linear-gradient(to right, #2563eb, #1d4ed8);
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(59, 130, 246, 0.4);
    }
  }

  &.secondary {
    background-color: white;
    color: #475569;
    border-color: #cbd5e1;

    &:hover {
      background-color: #f8fafc;
      color: #1e293b;
      border-color: #94a3b8;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #64748b;
`;

const Spinner = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 0.25rem solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #94a3b8;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: white;
  font-family: inherit;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: white;
  font-family: inherit;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: white;
  font-family: inherit;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const MaintenanceCards = styled.div`
  display: grid;
  gap: 1rem;
`;

const MaintenanceCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
`;

const MaintenanceCardHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8fafc;
`;

const MaintenanceCardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

const MaintenanceCardBody = styled.div`
  padding: 1rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  &.completed {
    background-color: #dcfce7;
    color: #16a34a;
  }

  &.scheduled {
    background-color: #dbeafe;
    color: #2563eb;
  }

  &.overdue {
    background-color: #fee2e2;
    color: #dc2626;
  }
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #64748b;
  width: 100px;
`;

const InfoValue = styled.span`
  color: #1e293b;
  flex: 1;
`;

const Observations = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
`;

const ObservationsText = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
`;

// Calendar Styled Components
const CalendarContainer = styled.div`
  width: 100%;
  max-width: 100%;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CalendarTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
`;

const CalendarNavButton = styled.button`
  background-color: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
  border-radius: 8px;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
    border-color: #94a3b8;
  }
`;

const CalendarWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const WeekdayLabel = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  color: #64748b;
  padding: 0.5rem 0;
`;

const CalendarDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

const CalendarDay = styled.div`
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #475569;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }

  &.empty {
    background-color: transparent;
    border-color: transparent;
    cursor: default;
  }

  &.today {
    color: #3b82f6;
    font-weight: 600;
    border-color: #93c5fd;

    &:after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #3b82f6;
    }
  }

  &.selected {
    background: linear-gradient(to bottom right, #3b82f6, #2563eb);
    color: white;
    font-weight: 600;
    border-color: #1d4ed8;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);

    &:after {
      display: none;
    }
  }

  &.has-maintenance {
    &:before {
      content: '';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #f59e0b;
    }
  }
`;

const Notification = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  color: white;
  font-weight: 500;
  max-width: 24rem;
  opacity: 0;
  transform: translateY(1rem);
  transition: all 0.3s ease;
  z-index: 1000;

  &.show {
    opacity: 1;
    transform: translateY(0);
  }

  &.success {
    background: linear-gradient(to right, #10b981, #059669);
  }

  &.error {
    background: linear-gradient(to right, #ef4444, #dc2626);
  }
`;

const MaintenancePage = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [newMaintenance, setNewMaintenance] = useState({
    equipment_id: '',
    maintenance_type: '',
    scheduled_date: '',
    performed_date: '',
    next_maintenance_date: '',
    observations: '',
    technician_id: '',
  });

  const handleDateClick = (selectedDay) => {
    setDate(selectedDay);
    const formattedDate = formatDate(selectedDay);
    fetchMaintenancesByDate(formattedDate);
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const fetchMaintenancesByDate = async (selectedDate) => {
    setIsLoading(true);
    try {
      const response = await getMaintenancesByDate(selectedDate);
      setMaintenances(response.data || []);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEquipmentsAndTechnicians = async () => {
    try {
      const equipmentsData = await getAllEquipments();
      setEquipments(Array.isArray(equipmentsData) ? equipmentsData : []);

      const techniciansResponse = await fetchEmployers();
      setTechnicians(Array.isArray(techniciansResponse) ? techniciansResponse : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const currentDate = formatDate(date);
    fetchMaintenancesByDate(currentDate);
    fetchEquipmentsAndTechnicians();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaintenance({ ...newMaintenance, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMaintenance(newMaintenance);

      // Reset form
      setNewMaintenance({
        equipment_id: '',
        maintenance_type: '',
        scheduled_date: '',
        performed_date: '',
        next_maintenance_date: '',
        observations: '',
        technician_id: '',
      });

      // Show success message
      showNotification('Maintenance added successfully!', 'success');

      // Refresh maintenances list
      const currentDate = formatDate(date);
      fetchMaintenancesByDate(currentDate);
    } catch (error) {
      console.error('Error adding maintenance:', error);
      showNotification(`Error: ${error.message || 'An error occurred'}`, 'error');
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }, 100);
  };

  // Get current month days for custom calendar
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Check if a date has maintenance scheduled
  const hasMaintenanceOnDate = (checkDate) => {
    const formattedDate = formatDate(checkDate);
    return maintenances.some(maintenance =>
      maintenance.scheduled_date === formattedDate ||
      maintenance.performed_date === formattedDate ||
      maintenance.next_maintenance_date === formattedDate
    );
  };

  const renderCalendar = () => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create days for the calendar
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <CalendarDay
          key={`empty-${i}`}
          className="empty"
        />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const isToday =
        currentDate.getDate() === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      const isSelected =
        currentDate.getDate() === date.getDate() &&
        currentDate.getMonth() === date.getMonth() &&
        currentDate.getFullYear() === date.getFullYear();

      const hasMaintenance = hasMaintenanceOnDate(currentDate);

      days.push(
        <CalendarDay
          key={`day-${day}`}
          className={`
            ${isToday ? 'today' : ''}
            ${isSelected ? 'selected' : ''}
            ${hasMaintenance ? 'has-maintenance' : ''}
          `}
          onClick={() => handleDateClick(new Date(currentYear, currentMonth, day))}
        >
          {day}
          {hasMaintenance && <span className="maintenance-indicator"></span>}
        </CalendarDay>
      );
    }

    return (
      <CalendarContainer>
        <CalendarHeader>
          <CalendarNavButton
            onClick={() => {
              const newDate = new Date(currentYear, currentMonth - 1, 1);
              setDate(newDate);
              fetchMaintenancesByDate(formatDate(newDate));
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </CalendarNavButton>
          <CalendarTitle>{monthNames[currentMonth]} {currentYear}</CalendarTitle>
          <CalendarNavButton
            onClick={() => {
              const newDate = new Date(currentYear, currentMonth + 1, 1);
              setDate(newDate);
              fetchMaintenancesByDate(formatDate(newDate));
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </CalendarNavButton>
        </CalendarHeader>
        <CalendarWeekdays>
          <WeekdayLabel>Sun</WeekdayLabel>
          <WeekdayLabel>Mon</WeekdayLabel>
          <WeekdayLabel>Tue</WeekdayLabel>
          <WeekdayLabel>Wed</WeekdayLabel>
          <WeekdayLabel>Thu</WeekdayLabel>
          <WeekdayLabel>Fri</WeekdayLabel>
          <WeekdayLabel>Sat</WeekdayLabel>
        </CalendarWeekdays>
        <CalendarDays>
          {days}
        </CalendarDays>
      </CalendarContainer>
    );
  };

  const renderMaintenanceStatus = (maintenance) => {
    if (maintenance.performed_date) {
      return <span className="status completed">Completed</span>;
    } else if (new Date(maintenance.scheduled_date) < new Date()) {
      return <span className="status overdue">Overdue</span>;
    } else {
      return <span className="status scheduled">Scheduled</span>;
    }
  };

  return (
    <div className="app-container">
      <Menu />
      <main className="main-content">
        <div className="page-header">
          <h1>Maintenance Management</h1>
          <div className="header-actions">
            <button className="button primary" onClick={() => document.getElementById('add-maintenance-form').scrollIntoView({ behavior: 'smooth' })}>
              Schedule Maintenance
            </button>
          </div>
        </div>

        <div className="content-grid">
          <section className="calendar-section">
            <div className="card">
              <div className="card-header">
                <h2>Maintenance Calendar</h2>
              </div>
              <div className="card-body">
                {renderCalendar()}
              </div>
            </div>
          </section>

          <section className="maintenance-list-section">
            <div className="card">
              <div className="card-header">
                <h2>Maintenances for {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading maintenances...</p>
                  </div>
                ) : maintenances.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <p>No maintenance scheduled for this date.</p>
                  </div>
                ) : (
                  <div className="maintenance-cards">
                    {maintenances.map((maintenance) => (
                      <div key={maintenance.id} className="maintenance-card">
                        <div className="maintenance-card-header">
                          <h3>{maintenance.equipment?.name || 'Unknown Equipment'}</h3>
                          {renderMaintenanceStatus(maintenance)}
                        </div>
                        <div className="maintenance-card-body">
                          <div className="info-row">
                            <span className="label">Type:</span>
                            <span className="value">{maintenance.maintenance_type}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Scheduled:</span>
                            <span className="value">{new Date(maintenance.scheduled_date).toLocaleDateString()}</span>
                          </div>
                          {maintenance.performed_date && (
                            <div className="info-row">
                              <span className="label">Performed:</span>
                              <span className="value">{new Date(maintenance.performed_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {maintenance.next_maintenance_date && (
                            <div className="info-row">
                              <span className="label">Next:</span>
                              <span className="value">{new Date(maintenance.next_maintenance_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="info-row">
                            <span className="label">Technician:</span>
                            <span className="value">{maintenance.technician?.full_name || 'Not assigned'}</span>
                          </div>
                          {maintenance.observations && (
                            <div className="observations">
                              <span className="label">Observations:</span>
                              <p>{maintenance.observations}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <section id="add-maintenance-form" className="maintenance-form-section">
          <div className="card">
            <div className="card-header">
              <h2>Schedule New Maintenance</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="equipment_id">Equipment</label>
                    <select
                      id="equipment_id"
                      name="equipment_id"
                      value={newMaintenance.equipment_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select equipment</option>
                      {equipments.map((equipment) => (
                        <option key={equipment.id} value={equipment.id}>
                          {equipment.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="maintenance_type">Maintenance Type</label>
                    <select
                      id="maintenance_type"
                      name="maintenance_type"
                      value={newMaintenance.maintenance_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Preventive">Preventive</option>
                      <option value="Corrective">Corrective</option>
                      <option value="Predictive">Predictive</option>
                      <option value="Condition-based">Condition-based</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="scheduled_date">Scheduled Date</label>
                    <input
                      type="date"
                      id="scheduled_date"
                      name="scheduled_date"
                      value={newMaintenance.scheduled_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="performed_date">Performed Date</label>
                    <input
                      type="date"
                      id="performed_date"
                      name="performed_date"
                      value={newMaintenance.performed_date}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="next_maintenance_date">Next Maintenance Date</label>
                    <input
                      type="date"
                      id="next_maintenance_date"
                      name="next_maintenance_date"
                      value={newMaintenance.next_maintenance_date}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="technician_id">Technician</label>
                    <select
                      id="technician_id"
                      name="technician_id"
                      value={newMaintenance.technician_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select technician</option>
                      {technicians.map((technician) => (
                        <option key={technician.id} value={technician.id}>
                          {technician.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="observations">Observations</label>
                  <textarea
                    id="observations"
                    name="observations"
                    value={newMaintenance.observations}
                    onChange={handleInputChange}
                    placeholder="Enter any relevant observations or notes"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="button secondary" onClick={() => {
                    setNewMaintenance({
                      equipment_id: '',
                      maintenance_type: '',
                      scheduled_date: '',
                      performed_date: '',
                      next_maintenance_date: '',
                      observations: '',
                      technician_id: '',
                    });
                  }}>
                    Clear Form
                  </button>
                  <button type="submit" className="button primary">
                    Schedule Maintenance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        /* Base Styles */
        :root {
          --primary-color: #2563eb;
          --primary-light: #3b82f6;
          --primary-dark: #1d4ed8;
          --success-color: #10b981;
          --warning-color: #f59e0b;
          --danger-color: #ef4444;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
          --gray-900: #111827;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --radius-sm: 0.125rem;
          --radius: 0.25rem;
          --radius-md: 0.375rem;
          --radius-lg: 0.5rem;
          --radius-xl: 0.75rem;
          --transition: all 0.2s ease;
        }

        .app-container {
          display: flex;
          min-height: 100vh;
          background-color: var(--gray-100);
          color: var(--gray-800);
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        }

        .main-content {
          margin-left: 250px;
          padding: 2rem;
          flex: 1;
          width: calc(100vw - 250px);
        }

        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          color: var(--gray-900);
          font-size: 1.875rem;
          font-weight: 700;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        /* Layout */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Cards */
        .card {
          background-color: #fff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h2 {
          color: var(--gray-800);
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .card-body {
          padding: 1.5rem;
          flex: 1;
        }

        /* Calendar */
        .custom-calendar {
          width: 100%;
          max-width: 100%;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .calendar-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          color: var(--gray-800);
        }

        .calendar-nav-btn {
          background-color: transparent;
          border: 1px solid var(--gray-300);
          color: var(--gray-700);
          border-radius: var(--radius);
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.25rem;
          transition: var(--transition);
        }

        .calendar-nav-btn:hover {
          background-color: var(--gray-100);
          color: var(--gray-900);
          border-color: var(--gray-400);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .calendar-weekdays div {
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--gray-600);
          padding: 0.5rem 0;
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
        }

        .calendar-day {
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          color: var(--gray-700);
          border-radius: var(--radius);
          border: 1px solid transparent;
          cursor: pointer;
          transition: var(--transition);
        }

        .calendar-day:hover {
          background-color: var(--gray-100);
          border-color: var(--gray-300);
        }

        .calendar-day.empty {
          background-color: transparent;
          border-color: transparent;
          cursor: default;
        }

        .calendar-day.today {
          color: var(--primary-color);
          font-weight: 600;
          border-color: var(--primary-light);
        }

        .calendar-day.selected {
          background-color: var(--primary-color);
          color: white;
          font-weight: 600;
          border-color: var(--primary-dark);
        }

        .calendar-day.selected:hover {
          background-color: var(--primary-dark);
        }

        /* Maintenance Cards */
        .maintenance-cards {
          display: grid;
          gap: 1rem;
        }

        .maintenance-card {
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          background-color: white;
          transition: var(--transition);
        }

        .maintenance-card:hover {
          box-shadow: var(--shadow);
          transform: translateY(-2px);
        }

        .maintenance-card-header {
          padding: 1rem;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--gray-50);
          border-radius: var(--radius) var(--radius) 0 0;
        }

        .maintenance-card-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-800);
        }

        .maintenance-card-body {
          padding: 1rem;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status.completed {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .status.scheduled {
          background-color: #dbeafe;
          color: #2563eb;
        }

        .status.overdue {
          background-color: #fee2e2;
          color: #dc2626;
        }

        .info-row {
          display: flex;
          margin-bottom: 0.5rem;
        }

        .label {
          font-weight: 500;
          color: var(--gray-600);
          width: 100px;
        }

        .value {
          color: var(--gray-800);
          flex: 1;
        }

        .observations {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px dashed var(--gray-200);
        }

        .observations p {
          margin: 0.5rem 0 0;
          font-size: 0.875rem;
          color: var(--gray-700);
          line-height: 1.5;
        }

        /* Form */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--gray-700);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius);
          background-color: white;
          font-family: inherit;
          font-size: 1rem;
          color: var(--gray-800);
          transition: var(--transition);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-light);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        /* Buttons */
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius);
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: var(--transition);
          border: 1px solid transparent;
        }

        .button.primary {
          background-color: var(--primary-color);
          color: white;
        }

        .button.primary:hover {
          background-color: var(--primary-dark);
        }

        .button.secondary {
          background-color: white;
          color: var(--gray-700);
          border-color: var(--gray-300);
        }

        .button.secondary:hover {
          background-color: var(--gray-100);
          color: var(--gray-900);
        }

        /* Loading Spinner */
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: var(--gray-500);
        }

        .spinner {
          width: 2.5rem;
          height: 2.5rem;
          border: 0.25rem solid var(--gray-200);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
          color: var(--gray-500);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        /* Notifications */
        .notification {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          padding: 1rem 1.5rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          color: white;
          font-weight: 500;
          max-width: 24rem;
          opacity: 0;
          transform: translateY(1rem);
          transition: all 0.3s ease;
        }

        .notification.show {
          opacity: 1;
          transform: translateY(0);
        }

        .notification.success {
          background-color: var(--success-color);
        }

        .notification.error {
          background-color: var(--danger-color);
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;