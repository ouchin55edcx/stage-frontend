import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { fetchAllServices, createService, updateService, deleteService, searchServices } from '../services/service';

// Styled Components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  color: #333;
  font-family: 'Segoe UI', sans-serif;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
`;

const ServiceCard = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(26, 115, 232, 0.15);
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #1A73E8, #0D47A1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormContainer = styled.div`
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #d0d7de;
  background: #ffffff;
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #1A73E8;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.2);
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${props => props.secondary ? '#f0f4f8' : '#1A73E8'};
  color: ${props => props.secondary ? '#1A73E8' : '#ffffff'};
  border: ${props => props.secondary ? '1px solid #1A73E8' : 'none'};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.secondary ? '#e6f0ff' : '#0D47A1'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ServicesList = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  max-height: 500px;
  overflow-y: auto;
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.8rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(26, 115, 232, 0.15);
    transform: translateY(-2px);
  }
`;

const ServiceName = styled.span`
  font-weight: 500;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const IconButton = styled.button`
  background: ${props => props.delete ? '#f44336' : '#1A73E8'};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #1A73E8;
`;

const Services = () => {
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
      setError('Erreur lors du chargement des services. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Le nom du service est requis");
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingService) {
        // Update existing service
        await updateService(editingService.id, name);
      } else {
        // Create new service
        await createService(name);
      }

      // Reset form and refresh list
      setName('');
      setEditingService(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Erreur lors de l\'enregistrement du service. Veuillez réessayer.');
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
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      setLoading(true);
      setError('');

      try {
        await deleteService(id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        setError('Erreur lors de la suppression du service. Veuillez réessayer.');
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
    } catch (error) {
      console.error('Error searching services:', error);
      setError('Erreur lors de la recherche des services. Veuillez réessayer.');
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
                    <IconButton onClick={() => handleEdit(service)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                    <IconButton delete onClick={() => handleDelete(service.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </ActionButtons>
                </ServiceItem>
              ))
            ) : (
              <EmptyState>Aucun service trouvé</EmptyState>
            )}
          </ServicesList>
        </ServiceCard>
      </MainContent>
    </Container>
  );
};

export default Services;
