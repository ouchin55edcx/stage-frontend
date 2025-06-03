import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { fetchEmployers, toggleEmployerStatus } from '../services/employer';
import { useNotifications } from '../contexts/NotificationContext';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #F1F5F9; /* Teinte de bleu clair */
  color: #2B2D42; /* Bleu foncé */
  font-family: 'Segoe UI', sans-serif;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #4A90E2, #1D3557); /* Teintes de bleu moderne */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #FFFFFF; /* Fond blanc */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 1.5rem;
  text-align: left;
  background: #1D3557; /* Bleu foncé */
  color: #FFFFFF;
  border-bottom: 2px solid #4A90E2; /* Teinte bleue claire */
`;

const Td = styled.td`
  padding: 1.5rem;
  border-bottom: 1px solid #E1E4E8;
`;

const ActionButton = styled.button`
  background: ${props => props.delete ? 
    'linear-gradient(45deg, #E63946, #D32F2F)' : 
    'linear-gradient(45deg, #4A90E2, #1D3557)'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;



const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => props.active ? '#E8F5E9' : '#FFEBEE'};
  color: ${props => props.active ? '#2E7D32' : '#C62828'};
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? 
    'linear-gradient(45deg, #2E7D32, #1B5E20)' : 
    'linear-gradient(45deg, #C62828, #B71C1C)'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

function UsersList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { showError } = useNotifications();

  useEffect(() => {
    const loadEmployers = async () => {
      try {
        const data = await fetchEmployers();
        setUsers(
          data.map(emp => ({
            id: emp.id,
            nom: emp.full_name,
            email: emp.email,
            poste: emp.poste,
            tele: emp.phone,
            role: emp.role || 'employe',
            service_id: emp.service_id,
            is_active: emp.is_active
          }))
        );
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        showError('Erreur lors du chargement des utilisateurs');
      }
    };
    loadEmployers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await toggleEmployerStatus(id);
      if (response.message) {
        const updatedUsers = users.map(user => {
          if (user.id === id) {
            return { ...user, is_active: response.is_active };
          }
          return user;
        });
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      showError('Erreur lors du changement de statut de l\'utilisateur');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <Title>Liste des utilisateurs</Title>

        <Table>
          <thead>
            <tr>
              <Th>Nom</Th>
              <Th>Email</Th>
              <Th>Poste</Th>
              <Th>Téléphone</Th>
              <Th>Statut</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <Td>{user.nom}</Td>
                <Td>{user.email}</Td>
                <Td>{user.poste}</Td>
                <Td>{user.tele}</Td>
                <Td>
                  <StatusBadge active={user.is_active}>
                    {user.is_active ? 'Actif' : 'Inactif'}
                  </StatusBadge>
                </Td>
                <Td>
                  <ActionButton onClick={() => handleEdit(user.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </ActionButton>
                  <ToggleButton 
                    active={user.is_active}
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.is_active ? 'Désactiver' : 'Activer'}
                  </ToggleButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </MainContent>
    </Container>
  );
}

export default UsersList;
