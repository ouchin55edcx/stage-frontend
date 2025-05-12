import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

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

const AddButton = styled.button`
  background: linear-gradient(45deg, #4A90E2, #1D3557); /* Bleu moderne */
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

function UsersList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulation de données
    const mockUsers = [
      {
        id: 1,
        nom: 'Ahmed Ben Salah',
        email: 'ahmed.salah@example.com',
        poste: 'Développeur',
        tele: '+212 6 12 34 56 78',
        role: 'admin',
        service_id: 1
      },
      {
        id: 2,
        nom: 'Sara Alami',
        email: 'sara.alami@example.com',
        poste: 'Technicien',
        tele: '+212 6 23 45 67 89',
        role: 'employe',
        service_id: 2
      }
    ];
    setUsers(mockUsers);
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
    if (confirmDelete) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/edit/${id}`); // Rediriger vers le formulaire de modification
  };

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <Title>Liste des utilisateurs</Title>
        <AddButton onClick={() => navigate('/admin/users/add')}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter un utilisateur
        </AddButton>
        <Table>
          <thead>
            <tr>
              <Th>Nom</Th>
              <Th>Email</Th>
              <Th>Poste</Th>
              <Th>Téléphone</Th>
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
                  <ActionButton onClick={() => handleEdit(user.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </ActionButton>
                  <ActionButton delete onClick={() => handleDelete(user.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </ActionButton>
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
