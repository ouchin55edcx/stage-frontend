import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom'; 
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import FontAwesome icons

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #FFFFFF; /* Fond blanc */
  color: black; /* Texte noir */
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
`;

const ListContainer = styled.div`
  background: #FFFFFF; /* Fond blanc */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 174, 239, 0.2); /* Ombre bleue moderne */
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00AEEF, #007BA7); /* Teinte bleue moderne */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #E6F7FF; /* Fond bleu clair pour la table */
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background: linear-gradient(45deg, #007BA7, #005F75); /* Teinte bleue foncée pour l'en-tête */
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #F0F8FF; /* Légère alternance de fond clair */
  }

  &:hover {
    background: #B3D8FF; /* Fond bleu clair au survol */
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #CCCCCC;
`;

const TableHeaderCell = styled.th`
  padding: 1.2rem;
  text-align: left;
  color: #FFFFFF;
  border-bottom: 2px solid #CCCCCC;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  margin: 0 0.3rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: ${props => props.delete ? '#007BA7' : '#00AEEF'}; /* Teintes bleues pour les boutons */
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.delete ? '#005F75' : '#007BA7'}; /* Effet de survol */
  }
`;

function InterventionsList() {
  const [interventions, setInterventions] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchInterventions();
    fetchEquipements();

    const testIntervention = {
      id: 9999,
      dateIntervention: new Date().toISOString(),
      nomInter: 'Technicien Test',
      equipmentId: 1,
      note: 'Ceci est une intervention test.'
    };
    setInterventions(prev => [...prev, testIntervention]);
  }, []);

  const fetchInterventions = () => {
    axios.get('/api/interventions')
      .then(response => setInterventions(prev => [...prev, ...response.data]))
      .catch(error => console.error('Erreur:', error));
  };

  const fetchEquipements = () => {
    axios.get('/api/equipements')
      .then(response => setEquipements(response.data))
      .catch(error => console.error('Erreur:', error));
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette intervention ?')) {
      axios.delete(`/api/interventions/${id}`)
        .then(() => fetchInterventions())
        .catch(error => console.error('Erreur:', error));
    }
  };

  const getEquipmentName = (equipmentId) => {
    const equipment = equipements.find(e => e.id === equipmentId);
    return equipment ? equipment.nom : 'Équipement inconnu';
  };

  const handleEdit = (id) => {
    navigate(`/edit-intervention/${id}`);
  };

  return (
    <Container>
      <Menu notifications={[]} />
      
      <MainContent>
        <ListContainer>
          <Title>Liste des Interventions</Title>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Intervenant</TableHeaderCell>
                <TableHeaderCell>Équipement</TableHeaderCell>
                <TableHeaderCell>Note</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            
            <tbody>
              {interventions.map(intervention => (
                <TableRow key={intervention.id}>
                  <TableCell>{new Date(intervention.dateIntervention).toLocaleDateString()}</TableCell>
                  <TableCell>{intervention.nomInter}</TableCell>
                  <TableCell>{getEquipmentName(intervention.equipmentId)}</TableCell>
                  <TableCell style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>
                    {intervention.note}
                  </TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleEdit(intervention.id)}>
                      <FaEdit /> {/* Modifier icon */}
                    </ActionButton>
                    <ActionButton delete onClick={() => handleDelete(intervention.id)}>
                      <FaTrashAlt /> {/* Supprimer icon */}
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

export default InterventionsList;
