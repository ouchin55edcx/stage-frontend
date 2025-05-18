import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Menu from './Menu';
import { createMaintenance } from '../services/maintenance';
import { getAllEquipments } from '../services/equipment';
import { fetchEmployers } from '../services/employer';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 30px;
  max-width: 800px;
  margin-left: 250px;
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #1e3a8a;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #1e3a8a;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #1e3a8a;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #1e3a8a;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
  height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1e3a8a;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  background: ${props => props.primary ? '#1e3a8a' : '#e5e7eb'};
  color: ${props => props.primary ? 'white' : '#1e3a8a'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? '#2c4999' : '#d1d5db'};
  }
`;

const AddMaintenancePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    equipment_id: '',
    maintenance_type: '',
    scheduled_date: '',
    performed_date: '',
    next_maintenance_date: '',
    observations: '',
    technician_id: '',
  });
  const [equipments, setEquipments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch equipment options
        const equipmentsData = await getAllEquipments();
        console.log('Equipment data in AddMaintenancePage:', equipmentsData); // Debug log
        setEquipments(Array.isArray(equipmentsData) ? equipmentsData : []);

        // Fetch technician options (using employers as technicians)
        const techniciansResponse = await fetchEmployers();
        console.log('Technicians data in AddMaintenancePage:', techniciansResponse); // Debug log
        setTechnicians(Array.isArray(techniciansResponse) ? techniciansResponse : []);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load form data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await createMaintenance(formData);
      alert('Maintenance added successfully!');
      navigate('/admin/maintenance/list');
    } catch (error) {
      console.error('Error adding maintenance:', error);
      setError(error.message || 'An error occurred while adding maintenance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Menu />
      <MainContent>
        <Title>Add New Maintenance</Title>

        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <FormContainer>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Equipment:</Label>
              <Select
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
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Maintenance Type:</Label>
              <Select
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
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Scheduled Date:</Label>
              <Input
                type="date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Performed Date (if already done):</Label>
              <Input
                type="date"
                name="performed_date"
                value={formData.performed_date}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Next Maintenance Date:</Label>
              <Input
                type="date"
                name="next_maintenance_date"
                value={formData.next_maintenance_date}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Observations:</Label>
              <TextArea
                name="observations"
                value={formData.observations}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Technician:</Label>
              <Select
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
              </Select>
            </FormGroup>

            <ButtonGroup>
              <Button
                type="button"
                onClick={() => navigate('/admin/maintenance/list')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                primary
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Maintenance'}
              </Button>
            </ButtonGroup>
          </form>
        </FormContainer>
      </MainContent>
    </Container>
  );
};

export default AddMaintenancePage;
