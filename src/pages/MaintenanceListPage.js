import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import styled from 'styled-components';
import Menu from './Menu';
import Modal from '../components/Modal';
import { getAllMaintenances, deleteMaintenance, getMaintenanceById, updateMaintenance } from '../services/maintenance';
import { fetchInterventions } from '../services/intervention';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 30px;
  margin-left: 250px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #1e3a8a;
  margin: 0;
`;

const AddButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1e3a8a;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  font-weight: bold;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #1e3a8a;
`;

const FilterSelect = styled.select`
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  min-width: 150px;
`;

const MaintenanceListPage = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaintenanceId, setEditingMaintenanceId] = useState(null);
  const [editMaintenance, setEditMaintenance] = useState({
    intervention_id: '',
    maintenance_type: 'Preventive',
    scheduled_date: '',
    observations: '',
    technician_id: ''
  });
  const [interventions, setInterventions] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  const fetchMaintenances = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {
        month: selectedMonth,
        year: selectedYear
      };

      console.log('Fetching maintenances with filters:', filters);
      const response = await getAllMaintenances(filters);
      console.log('Maintenances response:', response);

      // Handle different response formats
      if (Array.isArray(response)) {
        setMaintenances(response);
      } else if (response && Array.isArray(response.data)) {
        setMaintenances(response.data);
      } else {
        setMaintenances([]);
      }
    } catch (error) {
      console.error('Error loading maintenances:', error);
      setError('Failed to load maintenance records. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchMaintenances();
  }, [fetchMaintenances]);

  const handleMonthSelect = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearSelect = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleEdit = async (id) => {
    setEditingMaintenanceId(id);
    setEditLoading(true);

    try {
      // Fetch intervention options
      const interventionsData = await fetchInterventions();
      setInterventions(Array.isArray(interventionsData) ? interventionsData : []);

      if (id !== '0') {
        // Fetch maintenance data
        const maintenanceResponse = await getMaintenanceById(id);
        setEditMaintenance(maintenanceResponse.data || maintenanceResponse);
      } else {
        // Example maintenance for demo purposes
        setEditMaintenance({
          intervention_id: '1',
          maintenance_type: 'Preventive',
          scheduled_date: '2025-05-10',
          observations: 'No specific observations',
          technician_id: '1'
        });
      }

      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error loading maintenance data:', error);
      alert('Error loading maintenance data.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await deleteMaintenance(id);
        alert('Maintenance record deleted successfully');
        fetchMaintenances();
      } catch (error) {
        console.error('Error deleting maintenance:', error);
        alert(`Error: ${error.message || 'An error occurred while deleting the maintenance record'}`);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'intervention_id') {
      // When intervention is selected, no need to set technician_id since we use technician_name from intervention
      setEditMaintenance({
        ...editMaintenance,
        [name]: value
      });
    } else {
      setEditMaintenance({
        ...editMaintenance,
        [name]: value
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingMaintenanceId === '0') {
      alert("The example maintenance cannot be modified");
      return;
    }

    try {
      await updateMaintenance(editingMaintenanceId, editMaintenance);
      alert('Maintenance updated successfully!');
      setIsEditModalOpen(false);
      fetchMaintenances(); // Refresh the list
    } catch (error) {
      console.error('Error updating maintenance:', error);
      alert(`Error: ${error.message || 'An error occurred while updating maintenance'}`);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingMaintenanceId(null);
    setEditMaintenance({
      intervention_id: '',
      maintenance_type: 'Preventive',
      scheduled_date: '',
      observations: '',
      technician_id: ''
    });
  };

  return (
    <Container>
      <Menu />
      <MainContent>
        <PageHeader>
          <Title>Maintenance Records</Title>
          <AddButton to="/admin/maintenance">
            <FaPlus /> Add Maintenance
          </AddButton>
        </PageHeader>

        {error && (
          <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#fee2e2', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <FilterSection>
          <FilterGroup>
            <FilterLabel>Month</FilterLabel>
            <FilterSelect value={selectedMonth} onChange={handleMonthSelect}>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Year</FilterLabel>
            <FilterSelect value={selectedYear} onChange={handleYearSelect}>
              {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterSection>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading maintenance records...</div>
        ) : (
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', backgroundColor: '#1e3a8a', color: 'white', textAlign: 'left' }}>Equipment</th>
                  <th style={{ padding: '12px', backgroundColor: '#1e3a8a', color: 'white', textAlign: 'left' }}>Intervention Date</th>
                  <th style={{ padding: '12px', backgroundColor: '#1e3a8a', color: 'white', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '12px', backgroundColor: '#1e3a8a', color: 'white', textAlign: 'left' }}>Scheduled Date</th>
                  <th style={{ padding: '12px', backgroundColor: '#1e3a8a', color: 'white', textAlign: 'left' }}>Observations</th>
                  <th style={{ padding: '12px', backgroundColor: '#1e3a8a', color: 'white', textAlign: 'left' }}>Technician</th>
                  <th style={{ padding: '12px', backgroundColor: '#1e3a8a', color: 'white', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenances.length > 0 ? (
                  maintenances.map((maintenance) => (
                    <tr key={maintenance.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>{maintenance.intervention?.equipment?.name || 'Unknown Equipment'}</td>
                      <td style={{ padding: '12px' }}>{maintenance.intervention?.date ? new Date(maintenance.intervention.date).toLocaleDateString() : '-'}</td>
                      <td style={{ padding: '12px' }}>{maintenance.maintenance_type}</td>
                      <td style={{ padding: '12px' }}>{maintenance.scheduled_date ? new Date(maintenance.scheduled_date).toLocaleDateString() : '-'}</td>
                      <td style={{ padding: '12px' }}>{maintenance.observations || '-'}</td>
                      <td style={{ padding: '12px' }}>{maintenance.intervention?.technician_name || 'Not assigned'}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEdit(maintenance.id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e3a8a', fontSize: '1.2rem', margin: '0 5px' }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(maintenance.id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.2rem', margin: '0 5px' }}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      No maintenance records found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Maintenance Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          title="Edit Maintenance"
        >
          {editLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
          ) : (
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Intervention:</label>
                <select
                  name="intervention_id"
                  value={editMaintenance.intervention_id}
                  onChange={handleEditChange}
                  disabled={editingMaintenanceId === '0'}
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
                  value={editMaintenance.maintenance_type}
                  onChange={handleEditChange}
                  disabled={editingMaintenanceId === '0'}
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
                  value={editMaintenance.scheduled_date}
                  onChange={handleEditChange}
                  disabled={editingMaintenanceId === '0'}
                  required
                />
              </div>

              <div className="form-group">
                <label>Observations:</label>
                <textarea
                  name="observations"
                  value={editMaintenance.observations || ''}
                  onChange={handleEditChange}
                  disabled={editingMaintenanceId === '0'}
                />
              </div>

              <div className="form-group">
                <label>Technician:</label>
                <input
                  name="technician_display"
                  value={
                    editMaintenance.intervention_id
                      ? interventions.find(i => i.id === parseInt(editMaintenance.intervention_id))?.technician_name || 'Unknown Technician'
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
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={editingMaintenanceId === '0'}
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </Modal>

        <style jsx="true">{`
          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #1e3a8a;
            font-weight: 600;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 16px;
            font-family: inherit;
            box-sizing: border-box;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #1e3a8a;
          }

          .form-group input:disabled,
          .form-group select:disabled,
          .form-group textarea:disabled {
            background-color: #f3f4f6;
            cursor: not-allowed;
          }

          .form-group textarea {
            height: 100px;
            resize: vertical;
          }

          .button-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
            justify-content: flex-end;
          }

          .button-group button {
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

export default MaintenanceListPage;
