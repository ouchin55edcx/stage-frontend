import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createMaintenance } from '../services/maintenance';
import { getAllEquipments } from '../services/equipment';
import { fetchEmployers } from '../services/employer';

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

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

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const MaintenanceForm = ({ onSubmitSuccess, onCancel, currentDate }) => {
  const [formData, setFormData] = useState({
    equipment_id: '',
    maintenance_type: '',
    scheduled_date: currentDate ? new Date(currentDate).toISOString().split('T')[0] : '',
    performed_date: '',
    next_maintenance_date: '',
    observations: '',
    technician_id: '',
  });

  const [equipments, setEquipments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch equipments and technicians when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipmentsResponse, techniciansResponse] = await Promise.all([
          getAllEquipments(),
          fetchEmployers()
        ]);
        
        setEquipments(equipmentsResponse);
        setTechnicians(techniciansResponse);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to load form data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await createMaintenance(formData);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error creating maintenance:', error);
      setError('Failed to create maintenance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      equipment_id: '',
      maintenance_type: '',
      scheduled_date: currentDate ? new Date(currentDate).toISOString().split('T')[0] : '',
      performed_date: '',
      next_maintenance_date: '',
      observations: '',
      technician_id: '',
    });
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FormGrid>
        <FormGroup>
          <FormLabel htmlFor="equipment_id">Equipment</FormLabel>
          <FormSelect
            id="equipment_id"
            name="equipment_id"
            value={formData.equipment_id}
            onChange={handleChange}
            required
          >
            <option value="">Select equipment</option>
            {equipments.map((equipment) => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.name}
              </option>
            ))}
          </FormSelect>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="maintenance_type">Maintenance Type</FormLabel>
          <FormSelect
            id="maintenance_type"
            name="maintenance_type"
            value={formData.maintenance_type}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="Preventive">Preventive</option>
            <option value="Corrective">Corrective</option>
            <option value="Predictive">Predictive</option>
            <option value="Condition-based">Condition-based</option>
          </FormSelect>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="scheduled_date">Scheduled Date</FormLabel>
          <FormInput
            type="date"
            id="scheduled_date"
            name="scheduled_date"
            value={formData.scheduled_date}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="performed_date">Performed Date</FormLabel>
          <FormInput
            type="date"
            id="performed_date"
            name="performed_date"
            value={formData.performed_date}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="next_maintenance_date">Next Maintenance Date</FormLabel>
          <FormInput
            type="date"
            id="next_maintenance_date"
            name="next_maintenance_date"
            value={formData.next_maintenance_date}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="technician_id">Technician</FormLabel>
          <FormSelect
            id="technician_id"
            name="technician_id"
            value={formData.technician_id}
            onChange={handleChange}
            required
          >
            <option value="">Select technician</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.full_name}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
      </FormGrid>

      <FormGroup className="full-width">
        <FormLabel htmlFor="observations">Observations</FormLabel>
        <FormTextarea
          id="observations"
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          placeholder="Enter any relevant observations or notes"
        />
      </FormGroup>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
        <Button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" className="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit" className="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Maintenance'}
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceForm;
