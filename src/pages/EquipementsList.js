import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { getAllEquipments, deleteEquipment } from '../services/equipment';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f4f8;
  color: #333;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
`;

const ListContainer = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 123, 255, 0.2);
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00aaff, #005f99);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
  min-width: 1000px;
`;

const TableHeader = styled.thead`
  background: linear-gradient(45deg, #007acc, #005f99);
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f2f2f2;
  }

  &:hover {
    background: #e9f5fd;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

const TableHeaderCell = styled.th`
  padding: 1.2rem;
  text-align: left;
  color: #ffffff;
  border-bottom: 2px solid #ddd;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  margin: 0 0.3rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: ${props => props.delete ? '#ff3b30' : '#007acc'};
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.delete ? '#ff2a1b' : '#005f99'};
  }
`;

// Loader animations and components
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 300px;
`;

const LoaderSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #e3f2fd;
  border-top: 4px solid #007acc;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1.5rem;
`;

const LoaderText = styled.div`
  font-size: 1.1rem;
  color: #007acc;
  font-weight: 500;
  animation: ${pulse} 1.5s ease-in-out infinite;
  text-align: center;
`;

const LoaderSubtext = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
  text-align: center;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 300px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  color: #ff3b30;
  margin-bottom: 1rem;
`;

const ErrorText = styled.div`
  font-size: 1.2rem;
  color: #ff3b30;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ErrorSubtext = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

function EquipementList() {
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirmation } = useNotifications();
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const data = await getAllEquipments();
      console.log('Equipment data:', data); // Debug log

      // Ensure we're setting an array
      if (Array.isArray(data)) {
        setEquipements(data);
      } else if (data && typeof data === 'object') {
        // If it's an object with a data property that's an array
        if (data.data && Array.isArray(data.data)) {
          setEquipements(data.data);
        } else {
          // If it's a single equipment object, wrap it in an array
          setEquipements(data.id ? [data] : []);
        }
      } else {
        setEquipements([]);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching equipments:', err);
      setError('Failed to fetch equipments');
      setEquipements([]); // Set empty array to prevent map errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await showConfirmation(
      'Supprimer l\'équipement',
      'Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est irréversible.'
    );

    if (confirmed) {
      try {
        setIsDeleting(true);
        await deleteEquipment(id);
        // Refresh the list after successful deletion
        await fetchEquipments();
        showSuccess('Équipement supprimé avec succès');
      } catch (error) {
        console.error('Error deleting equipment:', error);
        showError(`Erreur lors de la suppression: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/equipements/edit/${id}`);
  };



  const getUserInfo = (employer) => {
    return employer ? `${employer.poste} (${employer.phone})` : 'Non attribué';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#28a745'; // Green
      case 'on_hold':
        return '#ffc107'; // Yellow
      case 'in_progress':
        return '#17a2b8'; // Blue
      default:
        return '#6c757d'; // Gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'on_hold':
        return 'En attente';
      case 'in_progress':
        return 'En cours';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Container>
        <Menu notifications={[]} />
        <MainContent>
          <ListContainer>
            <LoaderContainer>
              <LoaderSpinner />
              <LoaderText>Chargement des équipements...</LoaderText>
              <LoaderSubtext>Veuillez patienter pendant que nous récupérons les données</LoaderSubtext>
            </LoaderContainer>
          </ListContainer>
        </MainContent>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Menu notifications={[]} />
        <MainContent>
          <ListContainer>
            <ErrorContainer>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorText>Erreur de chargement</ErrorText>
              <ErrorSubtext>{error}</ErrorSubtext>
            </ErrorContainer>
          </ListContainer>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <ListContainer>
          <Title>Liste des équipements</Title>



          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>État</TableHeaderCell>
                <TableHeaderCell>Numéro Série</TableHeaderCell>
                <TableHeaderCell>Marque</TableHeaderCell>
                <TableHeaderCell>Libellé</TableHeaderCell>
                <TableHeaderCell>NSC</TableHeaderCell>
                <TableHeaderCell>Adresse IP</TableHeaderCell>
                <TableHeaderCell>Processeur</TableHeaderCell>
                <TableHeaderCell>Office</TableHeaderCell>
                <TableHeaderCell>Employé</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {Array.isArray(equipements) && equipements.map(equipement => (
                <TableRow key={equipement.id}>
                  <TableCell>{equipement.name || 'N/A'}</TableCell>
                  <TableCell>{equipement.type || 'N/A'}</TableCell>
                  <TableCell>
                    <span style={{
                      color: getStatusColor(equipement.status),
                      fontWeight: '500',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: `${getStatusColor(equipement.status)}20`
                    }}>
                      {getStatusLabel(equipement.status)}
                    </span>
                  </TableCell>
                  <TableCell>{equipement.serial_number || 'N/A'}</TableCell>
                  <TableCell>{equipement.brand || 'N/A'}</TableCell>
                  <TableCell>{equipement.label || 'N/A'}</TableCell>
                  <TableCell>{equipement.nsc || 'N/A'}</TableCell>
                  <TableCell>{equipement.ip_address || 'N/A'}</TableCell>
                  <TableCell>{equipement.processor || 'N/A'}</TableCell>
                  <TableCell>{equipement.office_version || 'N/A'}</TableCell>
                  <TableCell>{getUserInfo(equipement.employer)}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleEdit(equipement.id)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </ActionButton>
                    <ActionButton
                      delete
                      onClick={() => handleDelete(equipement.id)}
                      disabled={isDeleting}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
              {(!Array.isArray(equipements) || equipements.length === 0) && !loading && (
                <TableRow>
                  <TableCell colSpan="12" style={{ textAlign: 'center', padding: '2rem' }}>
                    Aucun équipement trouvé
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </ListContainer>
      </MainContent>
    </Container>
  );
}

export default EquipementList;
