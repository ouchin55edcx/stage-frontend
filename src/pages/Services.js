import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled, { keyframes } from 'styled-components';
import { fetchAllServices, createService, updateService, deleteService, searchServices } from '../services/service';
import { useNotifications } from '../contexts/NotificationContext';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const ServiceCard = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow:
    0 20px 40px rgba(0, 174, 239, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #00AEEF, #0066CC, #00AEEF);
    background-size: 200% 100%;
    animation: ${pulse} 3s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00AEEF 0%, #0066CC 50%, #004499 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  letter-spacing: -0.02em;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #00AEEF, #0066CC);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FormContainer = styled.div`
  margin-bottom: 3rem;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;



const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #e2e8f0, #cbd5e1) border-box;
  color: #334155;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    border: 2px solid transparent;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #00AEEF, #0066CC) border-box;
    box-shadow:
      0 0 0 4px rgba(0, 174, 239, 0.1),
      0 8px 16px -4px rgba(0, 174, 239, 0.2);
    outline: none;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f1f5f9;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.secondary
    ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    : 'linear-gradient(135deg, #00AEEF 0%, #0066CC 100%)'};
  color: ${props => props.secondary ? '#0066CC' : '#ffffff'};
  border: ${props => props.secondary ? '2px solid #00AEEF' : 'none'};
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.secondary
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    : '0 8px 16px -4px rgba(0, 174, 239, 0.4)'};
  position: relative;
  overflow: hidden;
  min-width: 120px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    background: ${props => props.secondary
      ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
      : 'linear-gradient(135deg, #0066CC 0%, #004499 100%)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.secondary
      ? '0 8px 16px -4px rgba(0, 0, 0, 0.15)'
      : '0 12px 24px -8px rgba(0, 174, 239, 0.5)'};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
    min-width: 100px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ServicesList = styled.div`
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 1.5rem;
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #00AEEF, #0066CC);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #0066CC, #004499);
  }
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #00AEEF, #0066CC);
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 174, 239, 0.1),
      0 4px 6px -2px rgba(0, 174, 239, 0.05);
    transform: translateY(-2px);
    border-color: rgba(0, 174, 239, 0.2);

    &::before {
      transform: scaleY(1);
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const ServiceName = styled.span`
  font-weight: 600;
  color: #1e293b;
  font-size: 1.1rem;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const IconButton = styled.button`
  background: ${props => props.delete
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : 'linear-gradient(135deg, #00AEEF 0%, #0066CC 100%)'};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.delete
    ? '0 4px 8px -2px rgba(239, 68, 68, 0.3)'
    : '0 4px 8px -2px rgba(0, 174, 239, 0.3)'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: ${props => props.delete
      ? '0 8px 16px -4px rgba(239, 68, 68, 0.4)'
      : '0 8px 16px -4px rgba(0, 174, 239, 0.4)'};
  }

  &:active {
    transform: translateY(0) scale(1);
  }

  svg {
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid #fecaca;
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 2px dashed #cbd5e1;
  margin: 2rem 0;

  &::before {
    content: '📋';
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  p {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #00AEEF;
  gap: 1rem;

  svg {
    font-size: 2.5rem;
    animation: ${pulse} 2s ease-in-out infinite;
  }

  &::after {
    content: 'Chargement des services...';
    font-size: 0.95rem;
    font-weight: 500;
    color: #64748b;
  }
`;



const Services = () => {
  const { showSuccess, showError, showConfirmation } = useNotifications();
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all services
  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      const errorMessage = 'Erreur lors du chargement des services. Veuillez réessayer.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      const errorMessage = "Le nom du service est requis";
      setError(errorMessage);
      showError(errorMessage);
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingService) {
        // Update existing service
        await updateService(editingService.id, name);
        showSuccess(`Service "${name}" modifié avec succès`);
      } else {
        // Create new service
        await createService(name);
        showSuccess(`Service "${name}" créé avec succès`);
      }

      // Reset form and refresh list
      setName('');
      setEditingService(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      const errorMessage = 'Erreur lors de l\'enregistrement du service. Veuillez réessayer.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (service) => {
    setEditingService(service);
    setName(service.name);
  };

  // Handle delete button click
  const handleDelete = async (service) => {
    const confirmed = await showConfirmation(
      'Supprimer le service',
      `Êtes-vous sûr de vouloir supprimer le service "${service.name}" ? Cette action est irréversible.`
    );

    if (confirmed) {
      setLoading(true);
      setError('');

      try {
        await deleteService(service.id);
        showSuccess(`Service "${service.name}" supprimé avec succès`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        const errorMessage = 'Erreur lors de la suppression du service. Veuillez réessayer.';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchServices();
      return;
    }

    setSearchLoading(true);
    setError('');

    try {
      const data = await searchServices(searchTerm);
      setServices(data);
      if (data.length === 0) {
        showError(`Aucun service trouvé pour "${searchTerm}"`);
      }
    } catch (error) {
      console.error('Error searching services:', error);
      const errorMessage = 'Erreur lors de la recherche des services. Veuillez réessayer.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSearchLoading(false);
    }
  };

  // Reset search and show all services
  const resetSearch = () => {
    setSearchTerm('');
    fetchServices();
  };

  return (
    <Container>
      <Menu />

      <MainContent>
        <ServiceCard>
          <Title>Gestion des Services</Title>

          {/* Form for adding/editing services */}
          <FormContainer>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du service"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPlus} />}
                {editingService ? 'Modifier' : 'Ajouter'}
              </Button>
              {editingService && (
                <Button
                  type="button"
                  secondary
                  onClick={() => {
                    setEditingService(null);
                    setName('');
                  }}
                >
                  Annuler
                </Button>
              )}
            </Form>

            {/* Search functionality */}
            <SearchContainer>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un service..."
                disabled={searchLoading}
              />
              <Button type="button" onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSearch} />}
                Rechercher
              </Button>
              {searchTerm && (
                <Button type="button" secondary onClick={resetSearch}>
                  Réinitialiser
                </Button>
              )}
            </SearchContainer>

            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormContainer>

          {/* Services list */}
          <ServicesList>
            {loading ? (
              <LoadingSpinner>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
              </LoadingSpinner>
            ) : services.length > 0 ? (
              services.map((service) => (
                <ServiceItem key={service.id}>
                  <ServiceName>{service.name}</ServiceName>
                  <ActionButtons>
                    <IconButton
                      onClick={() => handleEdit(service)}
                      title="Modifier le service"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                    <IconButton
                      delete
                      onClick={() => handleDelete(service)}
                      title="Supprimer le service"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </ActionButtons>
                </ServiceItem>
              ))
            ) : (
              <EmptyState>
                <p>Aucun service trouvé</p>
              </EmptyState>
            )}
          </ServicesList>
        </ServiceCard>
      </MainContent>
    </Container>
  );
};

export default Services;
