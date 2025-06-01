import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import Menu from './Menu';
import styled from 'styled-components';
import { getMaintenanceById, updateMaintenance } from '../services/maintenance';
import { fetchInterventions } from '../services/intervention';

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

const EditMaintenance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState({
    intervention_id: '',
    maintenance_type: 'Preventive',
    scheduled_date: '',
    observations: '',
    technician_id: ''
  });
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch intervention options
        const interventionsData = await fetchInterventions();
        console.log('Interventions data in EditMaintenance:', interventionsData); // Debug log
        setInterventions(Array.isArray(interventionsData) ? interventionsData : []);

        if (id !== '0') {
          // Fetch maintenance data
          const maintenanceResponse = await getMaintenanceById(id);
          console.log('Maintenance data:', maintenanceResponse); // Debug log
          setMaintenance(maintenanceResponse.data || maintenanceResponse);
        } else {
          // Example maintenance for demo purposes
          setMaintenance({
            intervention_id: '1',
            maintenance_type: 'Preventive',
            scheduled_date: '2025-05-10',
            observations: 'No specific observations',
            technician_id: '1'
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Redirecting to maintenance list.');
        navigate('/admin/maintenance/list');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'intervention_id') {
      // When intervention is selected, no need to set technician_id since we use technician_name from intervention
      setMaintenance({
        ...maintenance,
        [name]: value
      });
    } else {
      setMaintenance({
        ...maintenance,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id === '0') {
      alert("The example maintenance cannot be modified");
      return;
    }

    try {
      await updateMaintenance(id, maintenance);
      alert('Maintenance updated successfully!');
      navigate('/admin/maintenance/list');
    } catch (error) {
      console.error('Error updating maintenance:', error);
      alert(`Error: ${error.message || 'An error occurred while updating maintenance'}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Menu />
      <MainContent>
        <h2>Edit Maintenance</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Intervention:</label>
            <select
              name="intervention_id"
              value={maintenance.intervention_id}
              onChange={handleChange}
              disabled={id === '0'}
              required
            >
              <option value="">Select intervention</option>
              {interventions.map((intervention) => (
                <option key={intervention.id} value={intervention.id}>
                  {intervention.equipment?.name || 'Unknown Equipment'} - {intervention.technician_name} ({new Date(intervention.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Maintenance Type:</label>
            <select
              name="maintenance_type"
              value={maintenance.maintenance_type}
              onChange={handleChange}
              disabled={id === '0'}
              required
            >
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
              value={maintenance.scheduled_date}
              onChange={handleChange}
              disabled={id === '0'}
              required
            />
          </div>



          <div className="form-group">
            <label>Observations:</label>
            <textarea
              name="observations"
              value={maintenance.observations || ''}
              onChange={handleChange}
              disabled={id === '0'}
            />
          </div>

          <div className="form-group">
            <label>Technician:</label>
            <input
              name="technician_display"
              value={
                maintenance.intervention_id
                  ? interventions.find(i => i.id === parseInt(maintenance.intervention_id))?.technician_name || 'Unknown Technician'
                  : 'Select an intervention first'
              }
              readOnly
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/admin/maintenance/list')}
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={id === '0'}
            >
              <FaSave /> Save
            </button>
          </div>
        </form>

        <style jsx="true">{`
          h2 {
            color: #1e3a8a;
            margin-bottom: 30px;
          }

          form {
            background-color: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .form-group {
            margin-bottom: 20px;
          }

          label {
            display: block;
            margin-bottom: 8px;
            color: #1e3a8a;
            font-weight: 600;
          }

          input, select, textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 16px;
            font-family: inherit;
          }

          input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #1e3a8a;
          }

          input:disabled, select:disabled, textarea:disabled {
            background-color: #f3f4f6;
            cursor: not-allowed;
          }

          textarea {
            height: 100px;
            resize: vertical;
          }

          .button-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
            justify-content: flex-end;
          }

          button {
            padding: 12px 25px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
          }

          .save-btn {
            background: #1e3a8a;
            color: white;
          }

          .save-btn:hover:not(:disabled) {
            background: #2c4999;
          }

          .save-btn:disabled {
            background: #64748b;
            cursor: not-allowed;
          }

          .cancel-btn {
            background: #e5e7eb;
            color: #1e3a8a;
          }

          .cancel-btn:hover {
            background: #d1d5db;
          }
        `}</style>
      </MainContent>
    </Container>
  );
};

export default EditMaintenance;