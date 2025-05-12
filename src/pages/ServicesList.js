import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: white; /* Fond blanc */
  color: #1A73E8; /* Texte bleu moderne */
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
`;

const ListContainer = styled.div`
  background: #E6F7FF; /* Fond bleu clair moderne */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 122, 255, 0.2);
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #1A73E8, #0D47A1); /* Dégradé bleu moderne */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #F0F8FF; /* Fond bleu très clair */
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background: linear-gradient(45deg, #3A3A3A, #2A2A2A);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #D6EAF8; /* Fond bleu pâle */
  }

  &:hover {
    background: #A9C6E7; /* Fond bleu léger au survol */
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #444;
`;

const TableHeaderCell = styled.th`
  padding: 1.2rem;
  text-align: left;
  color: #1A73E8; /* Texte bleu moderne */
  border-bottom: 2px solid #444;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  margin: 0 0.3rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.delete ? '#444' : '#1A73E8'}; /* Bleu moderne */
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

function ServicesList() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate(); // Initialisation de useNavigate

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setServices([
        { id: 1, nom_serv: 'Service A' },
        { id: 2, nom_serv: 'Service B' },
      ]);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        await axios.delete(`/api/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  // Fonction pour rediriger vers la page EditService
  const handleEdit = (id) => {
    navigate(`/edit-service/${id}`); // Rediriger vers la page EditService avec l'ID
  };

  return (
    <Container>
      <Menu notifications={[]} />
      
      <MainContent>
        <ListContainer>
          <Title>Liste des Services</Title>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nom du Service</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            
            <tbody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.nom_serv}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleEdit(service.id)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </ActionButton>
                    <ActionButton delete onClick={() => handleDelete(service.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </ListContainer>
      </MainContent>
    </Container>
  );
}

export default ServicesList;
