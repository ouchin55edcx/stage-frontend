import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Menu from './Menu';
import styled from 'styled-components';
import {
  getMaintenancesByDate,
  createMaintenance
} from '../services/maintenance';
import { getAllEquipments } from '../services/equipment';
import { fetchEmployers } from '../services/employer';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f4f8;
  color: #333333;
  font-family: 'Segoe UI', sans-serif;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
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

  const handleDateClick = (date) => {
    setDate(date);
    const selectedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    fetchMaintenancesByDate(selectedDate);
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
      // Fetch equipments
      const equipmentsData = await getAllEquipments();
      console.log('Equipment data:', equipmentsData); // Debug log
      setEquipments(Array.isArray(equipmentsData) ? equipmentsData : []);

      // Fetch technicians (using employers as technicians)
      const techniciansResponse = await fetchEmployers();
      console.log('Technicians data:', techniciansResponse); // Debug log
      setTechnicians(Array.isArray(techniciansResponse) ? techniciansResponse : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    fetchMaintenancesByDate(currentDate);
    fetchEquipmentsAndTechnicians();
  }, [date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaintenance({ ...newMaintenance, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMaintenance(newMaintenance);
      alert('Maintenance added successfully!');

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

      // Refresh maintenances list
      const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      fetchMaintenancesByDate(currentDate);
    } catch (error) {
      console.error('Error adding maintenance:', error);
      alert(`Error: ${error.message || 'An error occurred while adding maintenance'}`);
    }
  };

  return (
    <Container>
      <Menu />
      <MainContent>
        <h1>Maintenance Management</h1>

        <div className="calendar-section">
          <h2>Select a Date</h2>
          <Calendar
            onChange={setDate}
            value={date}
            onClickDay={handleDateClick}
          />
        </div>

        <div className="maintenance-list">
          <h2>Maintenances for {date.toLocaleDateString()}</h2>
          {isLoading ? (
            <p>Loading maintenances...</p>
          ) : maintenances.length === 0 ? (
            <p>No maintenance scheduled for this date.</p>
          ) : (
            maintenances.map((maintenance) => (
              <div key={maintenance.id} className="maintenance-card">
                <h3>{maintenance.equipment?.name || 'Unknown Equipment'}</h3>
                <p><strong>Type:</strong> {maintenance.maintenance_type}</p>
                <p><strong>Scheduled Date:</strong> {maintenance.scheduled_date}</p>
                <p><strong>Performed Date:</strong> {maintenance.performed_date || 'Not performed yet'}</p>
                <p><strong>Next Maintenance Date:</strong> {maintenance.next_maintenance_date || 'Not scheduled'}</p>
                <p><strong>Observations:</strong> {maintenance.observations || 'No observations'}</p>
                <p><strong>Technician:</strong> {maintenance.technician?.full_name || 'Not assigned'}</p>
              </div>
            ))
          )}
        </div>

        <div className="maintenance-form">
          <h2>Add New Maintenance</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Equipment:</label>
              <select
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
              <label>Maintenance Type:</label>
              <select
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
              <label>Scheduled Date:</label>
              <input
                type="date"
                name="scheduled_date"
                value={newMaintenance.scheduled_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Performed Date:</label>
              <input
                type="date"
                name="performed_date"
                value={newMaintenance.performed_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Next Maintenance Date:</label>
              <input
                type="date"
                name="next_maintenance_date"
                value={newMaintenance.next_maintenance_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Observations:</label>
              <textarea
                name="observations"
                value={newMaintenance.observations}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Technician:</label>
              <select
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
            <button type="submit">Add Maintenance</button>
          </form>
        </div>
        <style jsx>{`
        h1, h2 {
          color: #007bff;
          margin-bottom: 1.5rem;
        }

        .calendar-section {
          margin-bottom: 2rem;
          background-color: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .react-calendar {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-family: 'Segoe UI', sans-serif;
        }

        .maintenance-list {
          margin-top: 2rem;
          background-color: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .maintenance-card {
          background-color: #f8f9fa;
          margin: 1rem 0;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
          border-left: 4px solid #007bff;
        }

        .maintenance-card h3 {
          color: #007bff;
          margin-top: 0;
        }

        .maintenance-form {
          margin-top: 2rem;
          background-color: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 1rem;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        button {
          background-color: #007bff;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        button:hover {
          background-color: #0069d9;
        }
      `}</style>
      </MainContent>
    </Container>
  );
};

export default MaintenancePage;
