import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createMaintenance } from '../services/maintenance';
import { fetchInterventions } from '../services/intervention';

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
    intervention_id: '',
    maintenance_type: '',
    scheduled_date: currentDate ? new Date(currentDate).toISOString().split('T')[0] : '',
    performed_date: '',
    next_maintenance_date: '',
    observations: '',
    technician_id: '',
  });

  const [interventions, setInterventions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch interventions when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const interventionsResponse = await fetchInterventions();
        console.log('Fetched interventions:', interventionsResponse); // Debug log
        setInterventions(interventionsResponse);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to load form data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'intervention_id') {
      // When intervention is selected, automatically set the technician_id and equipment_id
      const selectedIntervention = interventions.find(intervention => intervention.id === parseInt(value));
      console.log('Selected intervention:', selectedIntervention); // Debug log
      setFormData(prev => ({
        ...prev,
        [name]: value,
        technician_id: selectedIntervention?.technician_id || selectedIntervention?.intervenant_id || '',
        equipment_id: selectedIntervention?.equipment_id || selectedIntervention?.equipement_id || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Client-side validation
    if (!formData.intervention_id) {
      setError('Please select an intervention');
      setIsLoading(false);
      return;
    }

    if (!formData.maintenance_type) {
      setError('Please select a maintenance type');
      setIsLoading(false);
      return;
    }

    if (!formData.scheduled_date) {
      setError('Please select a scheduled date');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting maintenance form with data:', formData);
      await createMaintenance(formData);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error creating maintenance:', error);
      // Show the specific error message from the server
      setError(error.message || 'Failed to create maintenance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      intervention_id: '',
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
          <FormLabel htmlFor="intervention_id">Intervention</FormLabel>
          <FormSelect
            id="intervention_id"
            name="intervention_id"
            value={formData.intervention_id}
            onChange={handleChange}
            required
          >
            <option value="">Select intervention</option>
            {interventions.map((intervention) => (
              <option key={intervention.id} value={intervention.id}>
                Technician: {intervention.technician_name || intervention.nom_inter || 'Unknown'} | Equipment: {intervention.equipment?.name || 'Unknown'} | Date: {new Date(intervention.date || intervention.date_intervention).toLocaleDateString()}
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
          <FormLabel htmlFor="technician_display">Technician</FormLabel>
          <FormInput
            id="technician_display"
            name="technician_display"
            value={
              formData.intervention_id
                ? interventions.find(i => i.id === parseInt(formData.intervention_id))?.technician_name ||
                  interventions.find(i => i.id === parseInt(formData.intervention_id))?.nom_inter ||
                  'Unknown Technician'
                : 'Select an intervention first'
            }
            readOnly
            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
          />
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
