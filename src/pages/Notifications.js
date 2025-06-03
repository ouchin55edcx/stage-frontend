import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Menu from './Menu';
import { fetchDeclarations, deleteDeclaration, updateDeclaration } from '../services/declaration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes, faSpinner, faUser, faBuilding, faIdCard, faPhone, faEnvelope, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../contexts/NotificationContext';

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

const Title = styled.h1`
  font-size: 2rem;
  color: #2196f3;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.2s;
  border-left: 5px solid #2196f3;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin: 0;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const CardDescription = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const EditButton = styled(Button)`
  background-color: #2196f3;
  color: white;

  &:hover:not(:disabled) {
    background-color: #1976d2;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;
  color: white;

  &:hover:not(:disabled) {
    background-color: #d32f2f;
  }
`;

const ResolveButton = styled(Button)`
  background-color: #4caf50;
  color: white;

  &:hover:not(:disabled) {
    background-color: #388e3c;
  }
`;

const RejectButton = styled(Button)`
  background-color: #ff9800;
  color: white;

  &:hover:not(:disabled) {
    background-color: #f57c00;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'resolved': return '#e8f5e9';
      case 'rejected': return '#ffebee';
      case 'in_progress': return '#fff8e1';
      default: return '#e3f2fd';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'resolved': return '#388e3c';
      case 'rejected': return '#d32f2f';
      case 'in_progress': return '#f57c00';
      default: return '#1976d2';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const EmployerInfo = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid #2196f3;
`;

const EmployerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: #2196f3;
`;

const EmployerDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.8rem;
`;

const EmployerDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;
`;

const DetailIcon = styled(FontAwesomeIcon)`
  color: #2196f3;
  width: 16px;
`;

const DeclarationInfo = styled.div`
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

function Notifications() {
  const { showError } = useNotifications();
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAllDeclarations();
  }, []);

  const fetchAllDeclarations = async () => {
    setLoading(true);
    try {
      const data = await fetchDeclarations();
      setDeclarations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching declarations:', err);
      setError('Impossible de charger les déclarations. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette déclaration ?')) {
      setActionLoading(id);
      try {
        await deleteDeclaration(id);
        setDeclarations(declarations.filter(decl => decl.id !== id));
      } catch (err) {
        console.error('Error deleting declaration:', err);
        alert('Erreur lors de la suppression de la déclaration.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      await updateDeclaration(id, { status });
      setDeclarations(declarations.map(decl =>
        decl.id === id ? { ...decl, status } : decl
      ));
    } catch (err) {
      console.error(`Error updating declaration status to ${status}:`, err);
      showError(`Erreur lors de la mise à jour du statut de la déclaration.`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'resolved': return 'Résolu';
      case 'rejected': return 'Rejeté';
      case 'in_progress': return 'En cours';
      default: return 'Nouveau';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <Title>Déclarations de pannes</Title>

        {loading ? (
          <EmptyState>
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p>Chargement des déclarations...</p>
          </EmptyState>
        ) : error ? (
          <EmptyState>
            <p>{error}</p>
          </EmptyState>
        ) : declarations.length === 0 ? (
          <EmptyState>
            <p>Aucune déclaration trouvée.</p>
          </EmptyState>
        ) : (
          declarations.map(declaration => (
            <Card key={declaration.id}>
              <CardHeader>
                <CardTitle>{declaration.issue_title}</CardTitle>
                <StatusBadge status={declaration.status || 'new'}>
                  {getStatusLabel(declaration.status || 'new')}
                </StatusBadge>
              </CardHeader>

              {/* Declaration Information */}
              <DeclarationInfo>
                <InfoRow>
                  <DetailIcon icon={faCalendarAlt} />
                  <span>Déclaré le: {formatDate(declaration.created_at)}</span>
                </InfoRow>
                {declaration.updated_at && declaration.updated_at !== declaration.created_at && (
                  <InfoRow>
                    <DetailIcon icon={faCalendarAlt} />
                    <span>Mis à jour le: {formatDate(declaration.updated_at)}</span>
                  </InfoRow>
                )}
              </DeclarationInfo>

              {/* Employer Information */}
              {declaration.employer && (
                <EmployerInfo>
                  <EmployerHeader>
                    <FontAwesomeIcon icon={faUser} />
                    Informations de l'employé
                  </EmployerHeader>
                  <EmployerDetails>
                    <EmployerDetail>
                      <DetailIcon icon={faUser} />
                      <span>{declaration.employer.full_name}</span>
                    </EmployerDetail>

                    {declaration.employer.email && (
                      <EmployerDetail>
                        <DetailIcon icon={faEnvelope} />
                        <span>{declaration.employer.email}</span>
                      </EmployerDetail>
                    )}

                    {declaration.employer.poste && (
                      <EmployerDetail>
                        <DetailIcon icon={faIdCard} />
                        <span>{declaration.employer.poste}</span>
                      </EmployerDetail>
                    )}

                    {declaration.employer.phone && (
                      <EmployerDetail>
                        <DetailIcon icon={faPhone} />
                        <span>{declaration.employer.phone}</span>
                      </EmployerDetail>
                    )}

                    {(declaration.employer.service || declaration.employer.service_name) && (
                      <EmployerDetail>
                        <DetailIcon icon={faBuilding} />
                        <span>{declaration.employer.service || declaration.employer.service_name}</span>
                      </EmployerDetail>
                    )}
                  </EmployerDetails>
                </EmployerInfo>
              )}

              <CardDescription>{declaration.description}</CardDescription>
              <CardActions>
                <ResolveButton
                  onClick={() => handleStatusChange(declaration.id, 'resolved')}
                  disabled={actionLoading === declaration.id || declaration.status === 'resolved'}
                >
                  {actionLoading === declaration.id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faCheck} />
                  )}
                  Résoudre
                </ResolveButton>
                <RejectButton
                  onClick={() => handleStatusChange(declaration.id, 'rejected')}
                  disabled={actionLoading === declaration.id || declaration.status === 'rejected'}
                >
                  {actionLoading === declaration.id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                  Rejeter
                </RejectButton>
                <DeleteButton
                  onClick={() => handleDelete(declaration.id)}
                  disabled={actionLoading === declaration.id}
                >
                  {actionLoading === declaration.id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faTrash} />
                  )}
                  Supprimer
                </DeleteButton>
              </CardActions>
            </Card>
          ))
        )}
      </MainContent>
    </Container>
  );
}

export default Notifications;
