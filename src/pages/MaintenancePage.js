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
  faFilter,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import MaintenanceForm from '../components/MaintenanceForm';

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

  &.filtered {
    background: linear-gradient(to bottom right, #8b5cf6, #7c3aed);
    color: white;
    font-weight: 600;
    border-color: #6d28d9;
    box-shadow: 0 2px 4px rgba(124, 58, 237, 0.3);

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

  .filter-indicator {
    position: absolute;
    bottom: 4px;
    right: 4px;
    font-size: 0.5rem;
    color: white;
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
  const [allMaintenances, setAllMaintenances] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [monthMaintenances, setMonthMaintenances] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    equipment_id: '',
    maintenance_type: '',
    scheduled_date: '',
    performed_date: '',
    next_maintenance_date: '',
    observations: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // Default to 2 cards per page

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = async (selectedDay) => {
    setDate(selectedDay);
    const formattedDate = formatDate(selectedDay);

    // Set the filter date to the selected date
    setFilterDate(formattedDate);

    // Apply filter by the selected date from calendar
    setIsFiltering(true);
    setIsLoading(true);

    try {
      console.log('Calendar date clicked:', formattedDate);

      // Option 1: Filter from already loaded maintenances
      if (allMaintenances.length > 0) {
        console.log('Filtering from loaded maintenances by calendar selection');

        // Debug the maintenances data
        console.log('All maintenances:', allMaintenances);

        const filtered = allMaintenances.filter(maintenance => {
          // Normalize dates for comparison
          const normalizedMaintenanceDate = normalizeDate(maintenance.scheduled_date);
          const normalizedFilterDate = normalizeDate(formattedDate);

          // Check if scheduled_date matches the filter date
          const matches = normalizedMaintenanceDate === normalizedFilterDate;
          console.log(`Maintenance ${maintenance.id || 'unknown'}: ${maintenance.scheduled_date} (normalized: ${normalizedMaintenanceDate}) matches ${formattedDate} (normalized: ${normalizedFilterDate})? ${matches}`);
          return matches;
        });

        console.log('Filtered maintenances by calendar:', filtered);
        setMaintenances(filtered);
      }
      // Option 2: Fetch filtered maintenances from API
      else {
        console.log('Fetching filtered maintenances from API by calendar selection');
        // Try to fetch with specific scheduled_date filter
        const response = await getAllMaintenances({ scheduled_date: formattedDate });

        if (Array.isArray(response) && response.length > 0) {
          console.log('Got filtered response from API:', response);
          setMaintenances(response);
        } else if (response && Array.isArray(response.data) && response.data.length > 0) {
          console.log('Got filtered response.data from API:', response.data);
          setMaintenances(response.data);
        } else {
          // If no results with filter, try direct date endpoint
          console.log('No results with filter, trying direct date endpoint');
          const dateResponse = await getMaintenancesByDate(formattedDate);

          if (Array.isArray(dateResponse)) {
            console.log('Got array response from date endpoint:', dateResponse);
            setMaintenances(dateResponse);
          } else if (dateResponse && Array.isArray(dateResponse.data)) {
            console.log('Got response.data from date endpoint:', dateResponse.data);
            setMaintenances(dateResponse.data);
          } else {
            console.log('No maintenances found for date:', formattedDate);
            setMaintenances([]);
          }
        }
      }
    } catch (error) {
      console.error('Error filtering by calendar date:', error);
      setMaintenances([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Format date for month-based filtering (YYYY-MM)
  const formatMonth = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  // Normalize date for comparison (handles different date formats)
  const normalizeDate = (dateStr) => {
    if (!dateStr) return '';

    try {
      // If it's already a Date object
      if (dateStr instanceof Date) {
        return formatDate(dateStr);
      }

      // If it's a string in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }

      // If it's a string in M/D/YYYY format (like 5/20/2025)
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        const parts = dateStr.split('/');
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }

      // For any other format, try to create a Date object and format it
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return formatDate(date);
      }
    } catch (error) {
      console.error('Error normalizing date:', error, dateStr);
    }

    // Return original if we can't normalize
    return dateStr;
  };

  // Fetch maintenances for a specific date
  const fetchMaintenancesByDate = async (selectedDate) => {
    setIsLoading(true);
    try {
      console.log('Fetching maintenances for date:', selectedDate);
      const response = await getMaintenancesByDate(selectedDate);
      console.log('Response from getMaintenancesByDate:', response);

      // Since we updated getMaintenancesByDate to use getAllMaintenances,
      // the response format will be consistent with getAllMaintenances
      if (Array.isArray(response)) {
        console.log('Setting maintenances from array response:', response);
        setMaintenances(response);
      } else if (response && Array.isArray(response.data)) {
        console.log('Setting maintenances from response.data:', response.data);
        setMaintenances(response.data);
      } else {
        console.log('No maintenances found for date, setting empty array');
        setMaintenances([]);
      }
    } catch (error) {
      console.error('Error fetching maintenances for date:', error);
      setMaintenances([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all maintenances for the current month
  const fetchMonthMaintenances = async (year, month) => {
    try {
      // Create filters for the current month
      const filters = {
        year: year,
        month: month + 1 // Month is 0-indexed in JS Date, but we need 1-indexed for API
      };

      const response = await getAllMaintenances(filters);

      // Handle different response formats
      if (Array.isArray(response)) {
        setMonthMaintenances(response);
      } else if (response && Array.isArray(response.data)) {
        setMonthMaintenances(response.data);
      } else {
        setMonthMaintenances([]);
        console.warn('Unexpected response format from getAllMaintenances:', response);
      }
    } catch (error) {
      console.error('Error fetching month maintenances:', error);
      setMonthMaintenances([]);
    }
  };

  // Fetch all maintenances
  const fetchAllMaintenances = async () => {
    setIsLoading(true);
    try {
      const response = await getAllMaintenances();

      // Handle different response formats
      if (Array.isArray(response)) {
        setAllMaintenances(response);
        // If not filtering, set maintenances to all maintenances
        if (!isFiltering) {
          setMaintenances(response);
        }
      } else if (response && Array.isArray(response.data)) {
        setAllMaintenances(response.data);
        // If not filtering, set maintenances to all maintenances
        if (!isFiltering) {
          setMaintenances(response.data);
        }
      } else {
        setAllMaintenances([]);
        if (!isFiltering) {
          setMaintenances([]);
        }
        console.warn('Unexpected response format from getAllMaintenances:', response);
      }
    } catch (error) {
      console.error('Error fetching all maintenances:', error);
      setAllMaintenances([]);
      if (!isFiltering) {
        setMaintenances([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filter by scheduled date
  const applyScheduledDateFilter = async () => {
    setIsFiltering(true);
    setIsLoading(true);

    if (!filterDate) {
      // If no filter date is set, show all maintenances
      setMaintenances(allMaintenances);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Applying filter for scheduled date:', filterDate);

      // Option 1: Filter from already loaded maintenances
      if (allMaintenances.length > 0) {
        console.log('Filtering from loaded maintenances');
        const filtered = allMaintenances.filter(maintenance => {
          // Normalize dates for comparison
          const normalizedMaintenanceDate = normalizeDate(maintenance.scheduled_date);
          const normalizedFilterDate = normalizeDate(filterDate);

          // Check if scheduled_date matches the filter date
          const matches = normalizedMaintenanceDate === normalizedFilterDate;
          console.log(`Maintenance ${maintenance.id}: ${maintenance.scheduled_date} (normalized: ${normalizedMaintenanceDate}) matches ${filterDate} (normalized: ${normalizedFilterDate})? ${matches}`);
          return matches;
        });

        console.log('Filtered maintenances:', filtered);
        setMaintenances(filtered);
      }
      // Option 2: Fetch filtered maintenances from API
      else {
        console.log('Fetching filtered maintenances from API');
        const response = await getAllMaintenances({ scheduled_date: filterDate });

        if (Array.isArray(response)) {
          setMaintenances(response);
        } else if (response && Array.isArray(response.data)) {
          setMaintenances(response.data);
        } else {
          setMaintenances([]);
        }
      }
    } catch (error) {
      console.error('Error applying filter:', error);
      setMaintenances([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear filter and show all maintenances
  const clearFilter = () => {
    setFilterDate('');
    setIsFiltering(false);
    setMaintenances(allMaintenances);

    // Reset to current date view
    const currentDate = formatDate(date);
    fetchMaintenancesByDate(currentDate);
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
    // Initial data loading
    const currentDate = formatDate(date);
    fetchMaintenancesByDate(currentDate);
    fetchMonthMaintenances(date.getFullYear(), date.getMonth());
    fetchAllMaintenances(); // Fetch all maintenances for filtering
    fetchEquipmentsAndTechnicians();
  }, []);

  // When the month changes, fetch maintenances for the new month
  useEffect(() => {
    console.log('Month changed, fetching maintenances for:', date.getFullYear(), date.getMonth() + 1);
    fetchMonthMaintenances(date.getFullYear(), date.getMonth());

    // Also fetch maintenances for the current date when month changes
    const currentDate = formatDate(date);
    fetchMaintenancesByDate(currentDate);
  }, [date.getFullYear(), date.getMonth()]);

  // Reset pagination when maintenances change
  useEffect(() => {
    setCurrentPage(1);
  }, [maintenances.length, isFiltering, filterDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaintenance({ ...newMaintenance, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure dates are properly formatted
      const formattedMaintenance = {
        ...newMaintenance,
        scheduled_date: newMaintenance.scheduled_date || formatDate(new Date()),
      };

      await createMaintenance(formattedMaintenance);

      // Reset form
      setNewMaintenance({
        equipment_id: '',
        maintenance_type: '',
        scheduled_date: '',
        performed_date: '',
        next_maintenance_date: '',
        observations: '',
      });

      // Show success message
      showNotification('Maintenance added successfully!', 'success');

      // Refresh maintenances list for current date
      const currentDate = formatDate(date);
      fetchMaintenancesByDate(currentDate);

      // Refresh month maintenances to update calendar indicators
      fetchMonthMaintenances(date.getFullYear(), date.getMonth());

      // Refresh all maintenances for filtering
      fetchAllMaintenances();
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
    const normalizedCheckDate = normalizeDate(formattedDate);

    // Use the monthMaintenances array which contains all maintenances for the current month
    return monthMaintenances.some(maintenance => {
      const normalizedScheduledDate = normalizeDate(maintenance.scheduled_date);
      const normalizedPerformedDate = normalizeDate(maintenance.performed_date);
      const normalizedNextDate = normalizeDate(maintenance.next_maintenance_date);

      return normalizedScheduledDate === normalizedCheckDate ||
             normalizedPerformedDate === normalizedCheckDate ||
             normalizedNextDate === normalizedCheckDate;
    });
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

      // Check if this day is the filtered date
      const currentDateFormatted = formatDate(new Date(currentYear, currentMonth, day));
      const isFilteredDate = isFiltering && normalizeDate(filterDate) === normalizeDate(currentDateFormatted);

      days.push(
        <CalendarDay
          key={`day-${day}`}
          className={`
            ${isToday ? 'today' : ''}
            ${isSelected ? 'selected' : ''}
            ${isFilteredDate ? 'filtered' : ''}
            ${hasMaintenance ? 'has-maintenance' : ''}
          `}
          onClick={() => handleDateClick(new Date(currentYear, currentMonth, day))}
          title={hasMaintenance ? 'Has scheduled maintenance' : 'No scheduled maintenance'}
        >
          {day}
          {hasMaintenance && <span className="maintenance-indicator"></span>}
          {isFilteredDate && (
            <span className="filter-indicator">
              <FontAwesomeIcon icon={faFilter} />
            </span>
          )}
        </CalendarDay>
      );
    }

    return (
      <CalendarContainer>
        <CalendarHeader>
          <CalendarNavButton
            onClick={async () => {
              // Navigate to previous month
              const newDate = new Date(currentYear, currentMonth - 1, 1);
              setDate(newDate);

              // If filtering is active, update the filter to the first day of the month
              if (isFiltering) {
                const formattedDate = formatDate(newDate);
                setFilterDate(formattedDate);
                setIsLoading(true);

                try {
                  console.log('Month navigation with active filter, new date:', formattedDate);

                  // Try to fetch with specific scheduled_date filter
                  const response = await getAllMaintenances({ scheduled_date: formattedDate });

                  if (Array.isArray(response) && response.length > 0) {
                    console.log('Got filtered response from API:', response);
                    setMaintenances(response);
                  } else if (response && Array.isArray(response.data) && response.data.length > 0) {
                    console.log('Got filtered response.data from API:', response.data);
                    setMaintenances(response.data);
                  } else {
                    // If no results with filter, try direct date endpoint
                    console.log('No results with filter, trying direct date endpoint');
                    const dateResponse = await getMaintenancesByDate(formattedDate);

                    if (Array.isArray(dateResponse)) {
                      console.log('Got array response from date endpoint:', dateResponse);
                      setMaintenances(dateResponse);
                    } else if (dateResponse && Array.isArray(dateResponse.data)) {
                      console.log('Got response.data from date endpoint:', dateResponse.data);
                      setMaintenances(dateResponse.data);
                    } else {
                      console.log('No maintenances found for date:', formattedDate);
                      setMaintenances([]);
                    }
                  }
                } catch (error) {
                  console.error('Error during month navigation with filter:', error);
                  setMaintenances([]);
                } finally {
                  setIsLoading(false);
                }
              } else {
                // If not filtering, just fetch maintenances for the first day
                fetchMaintenancesByDate(formatDate(newDate));
              }

              // Month maintenances will be fetched by the useEffect that watches for month changes
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </CalendarNavButton>
          <CalendarTitle>
            {monthNames[currentMonth]} {currentYear}
            {isFiltering && (
              <span className="calendar-filter-indicator" title="Calendar filtering is active">
                <FontAwesomeIcon icon={faFilter} style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }} />
              </span>
            )}
          </CalendarTitle>
          <CalendarNavButton
            onClick={async () => {
              // Navigate to next month
              const newDate = new Date(currentYear, currentMonth + 1, 1);
              setDate(newDate);

              // If filtering is active, update the filter to the first day of the month
              if (isFiltering) {
                const formattedDate = formatDate(newDate);
                setFilterDate(formattedDate);
                setIsLoading(true);

                try {
                  console.log('Month navigation with active filter, new date:', formattedDate);

                  // Try to fetch with specific scheduled_date filter
                  const response = await getAllMaintenances({ scheduled_date: formattedDate });

                  if (Array.isArray(response) && response.length > 0) {
                    console.log('Got filtered response from API:', response);
                    setMaintenances(response);
                  } else if (response && Array.isArray(response.data) && response.data.length > 0) {
                    console.log('Got filtered response.data from API:', response.data);
                    setMaintenances(response.data);
                  } else {
                    // If no results with filter, try direct date endpoint
                    console.log('No results with filter, trying direct date endpoint');
                    const dateResponse = await getMaintenancesByDate(formattedDate);

                    if (Array.isArray(dateResponse)) {
                      console.log('Got array response from date endpoint:', dateResponse);
                      setMaintenances(dateResponse);
                    } else if (dateResponse && Array.isArray(dateResponse.data)) {
                      console.log('Got response.data from date endpoint:', dateResponse.data);
                      setMaintenances(dateResponse.data);
                    } else {
                      console.log('No maintenances found for date:', formattedDate);
                      setMaintenances([]);
                    }
                  }
                } catch (error) {
                  console.error('Error during month navigation with filter:', error);
                  setMaintenances([]);
                } finally {
                  setIsLoading(false);
                }
              } else {
                // If not filtering, just fetch maintenances for the first day
                fetchMaintenancesByDate(formatDate(newDate));
              }

              // Month maintenances will be fetched by the useEffect that watches for month changes
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
    if (!maintenance) {
      return <span className="status scheduled">Unknown</span>;
    }

    if (maintenance.performed_date) {
      return <span className="status completed">Completed</span>;
    } else if (maintenance.scheduled_date && new Date(maintenance.scheduled_date) < new Date()) {
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
            <div className="filter-container">
              <div className="filter-group">
                <label htmlFor="filter-date">
                  <FontAwesomeIcon icon={faFilter} style={{ marginRight: '0.5rem' }} />
                  Filter by Scheduled Date:
                </label>
                <input
                  type="date"
                  id="filter-date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="filter-input"
                />
                <button
                  className="button secondary filter-button"
                  onClick={applyScheduledDateFilter}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faSearch} style={{ marginRight: '0.5rem' }} />
                  Apply Filter
                </button>
                <button
                  className="button secondary filter-button"
                  onClick={clearFilter}
                  disabled={isLoading || !isFiltering}
                >
                  <FontAwesomeIcon icon={faTimes} style={{ marginRight: '0.5rem' }} />
                  Clear Filter
                </button>
              </div>
            </div>
            <button className="button primary" onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
              Schedule Maintenance
            </button>
          </div>
        </div>

        {/* Maintenance Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Schedule New Maintenance"
        >
          <MaintenanceForm
            onSubmitSuccess={() => {
              setIsModalOpen(false);
              // Refresh the maintenance data
              fetchMaintenancesByDate(formatDate(date));
              fetchMonthMaintenances(date.getFullYear(), date.getMonth());
              fetchAllMaintenances();
            }}
            onCancel={() => setIsModalOpen(false)}
            currentDate={formatDate(date)}
          />
        </Modal>

        <div className="content-grid">
          <section className="calendar-section">
            <div className="card">
              <div className="card-header">
                <h2>
                  Maintenance Calendar
                  {isFiltering && filterDate && (
                    <span className="filter-badge" style={{ marginLeft: '0.75rem', fontSize: '0.75rem' }}>
                      <FontAwesomeIcon icon={faFilter} style={{ marginRight: '0.5rem' }} />
                      Filtering Active
                    </span>
                  )}
                </h2>
                <div className="calendar-actions">
                  <button
                    className={`button ${isFiltering ? 'primary' : 'secondary'}`}
                    onClick={async () => {
                      if (isFiltering) {
                        // If already filtering, clear the filter
                        clearFilter();
                      } else {
                        // If not filtering, apply filter for current date
                        const formattedDate = formatDate(date);
                        setFilterDate(formattedDate);
                        setIsFiltering(true);
                        setIsLoading(true);

                        try {
                          console.log('Filter by Calendar button clicked, date:', formattedDate);

                          // Try to fetch with specific scheduled_date filter
                          const response = await getAllMaintenances({ scheduled_date: formattedDate });

                          if (Array.isArray(response) && response.length > 0) {
                            console.log('Got filtered response from API:', response);
                            setMaintenances(response);
                          } else if (response && Array.isArray(response.data) && response.data.length > 0) {
                            console.log('Got filtered response.data from API:', response.data);
                            setMaintenances(response.data);
                          } else {
                            // If no results with filter, try direct date endpoint
                            console.log('No results with filter, trying direct date endpoint');
                            const dateResponse = await getMaintenancesByDate(formattedDate);

                            if (Array.isArray(dateResponse)) {
                              console.log('Got array response from date endpoint:', dateResponse);
                              setMaintenances(dateResponse);
                            } else if (dateResponse && Array.isArray(dateResponse.data)) {
                              console.log('Got response.data from date endpoint:', dateResponse.data);
                              setMaintenances(dateResponse.data);
                            } else {
                              console.log('No maintenances found for date:', formattedDate);
                              setMaintenances([]);
                            }
                          }
                        } catch (error) {
                          console.error('Error applying calendar filter:', error);
                          setMaintenances([]);
                        } finally {
                          setIsLoading(false);
                        }
                      }
                    }}
                    title={isFiltering ? "Clear calendar filter" : "Filter by calendar selection"}
                  >
                    <FontAwesomeIcon
                      icon={isFiltering ? faTimes : faFilter}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {isFiltering ? 'Clear Filter' : 'Filter by Calendar'}
                  </button>
                </div>
              </div>
              <div className="card-body">
                {renderCalendar()}
              </div>
            </div>
          </section>

          <section className="maintenance-list-section">
            <div className="card">
              <div className="card-header">
                <h2>
                  {isFiltering && filterDate
                    ? `Maintenances Scheduled for ${new Date(filterDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                    : isFiltering
                      ? 'All Maintenances'
                      : `Maintenances for ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                  }
                </h2>
                {isFiltering && (
                  <span className="filter-badge">
                    <FontAwesomeIcon icon={faFilter} style={{ marginRight: '0.5rem' }} />
                    Filtered
                  </span>
                )}
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
                    {isFiltering && filterDate ? (
                      <p>No maintenance scheduled for {new Date(filterDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
                    ) : isFiltering ? (
                      <p>No maintenance records found.</p>
                    ) : (
                      <p>No maintenance scheduled for this date.</p>
                    )}
                    {isFiltering && (
                      <button
                        className="button secondary"
                        onClick={clearFilter}
                        style={{ marginTop: '1rem' }}
                      >
                        <FontAwesomeIcon icon={faTimes} style={{ marginRight: '0.5rem' }} />
                        Clear Filter
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="maintenance-cards">
                      {maintenances
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((maintenance) => (
                        <div key={maintenance.id || Math.random()} className="maintenance-card">
                          <div className="maintenance-card-header">
                            <h3>
                              {maintenance.intervention?.equipment?.name || 'Unknown Equipment'}
                              {maintenance.intervention && (
                                <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280' }}>
                                  {' '}(Intervention: {new Date(maintenance.intervention.date).toLocaleDateString()})
                                </span>
                              )}
                            </h3>
                            {renderMaintenanceStatus(maintenance)}
                          </div>
                          <div className="maintenance-card-body">
                            <div className="info-row">
                              <span className="label">Type:</span>
                              <span className="value">{maintenance.maintenance_type || 'Not specified'}</span>
                            </div>
                            {maintenance.scheduled_date && (
                              <div className="info-row">
                                <span className="label">Scheduled:</span>
                                <span className="value">
                                  {new Date(maintenance.scheduled_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}

                            <div className="info-row">
                              <span className="label">Technician:</span>
                              <span className="value">
                                {maintenance.intervention?.technician_name || 'Not assigned'}
                              </span>
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

                    <Pagination
                      currentPage={currentPage}
                      totalItems={maintenances.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>


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

        /* Pagination Styles */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1.5rem;
          gap: 1rem;
        }

        .pagination-button {
          background-color: white;
          border: 1px solid var(--gray-300);
          color: var(--gray-700);
          border-radius: var(--radius);
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .pagination-button:hover:not(:disabled) {
          background-color: var(--gray-100);
          color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 0.875rem;
          color: var(--gray-600);
          font-weight: 500;
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

        /* Filter Styles */
        .filter-container {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .filter-group {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .filter-group label {
          font-weight: 500;
          color: #475569;
          display: flex;
          align-items: center;
        }

        .filter-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .filter-button {
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }

        .filter-badge {
          display: inline-flex;
          align-items: center;
          background-color: #dbeafe;
          color: #2563eb;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
        }

        @media (max-width: 768px) {
          .header-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group label {
            margin-bottom: 0.5rem;
          }
        }

        /* Calendar Filter Styles */
        .calendar-actions {
          display: flex;
          gap: 0.5rem;
        }

        .calendar-filter-indicator {
          color: #7c3aed;
        }

        @media (max-width: 768px) {
          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .calendar-actions {
            margin-top: 0.75rem;
            width: 100%;
          }

          .calendar-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;