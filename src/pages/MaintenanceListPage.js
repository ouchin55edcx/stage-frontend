import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import styled from 'styled-components';
import Menu from './Menu';
import { getAllMaintenances, deleteMaintenance } from '../services/maintenance';

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

  const handleEdit = (id) => {
    navigate(`/admin/edit-maintenance/${id}`);
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

  return (
    <Container>
      <Menu />
      <MainContent>
        <PageHeader>
          <Title>Maintenance Records</Title>
          <AddButton to="/admin/add-maintenance">
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
                      <td style={{ padding: '12px' }}>{maintenance.technician?.full_name || 'Not assigned'}</td>
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
      </MainContent>
    </Container>
  );
};

export default MaintenanceListPage;
