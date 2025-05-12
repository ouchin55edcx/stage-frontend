import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importation des icônes
import { useNavigate } from 'react-router-dom'; // Remplacer useHistory par useNavigate
import Menu from './Menu';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #FFFFFF; /* Fond blanc */
  color: #333333; /* Texte sombre pour le contraste */
`;

const MainContent = styled.div`
  margin-left: 270px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 270px);
`;

const ListContainer = styled.div`
  background: #F4F7FF; /* Fond bleu clair */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(30, 144, 255, 0.3); /* Ombre bleue claire */
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1E90FF; /* Teinte bleue moderne */
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #E6F0FF; /* Fond bleu clair pour le tableau */
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background: linear-gradient(45deg, #3A3A3A, #2A2A2A);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #DCDCDC;
  }

  &:hover {
    background: #3A3A3A;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #444;
  text-align: center;
`;

const TableHeaderCell = styled.th`
  padding: 1.2rem;
  text-align: center;
  color: #1E90FF; /* Teinte bleue pour les en-têtes */
  border-bottom: 2px solid #444;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  margin: 0 0.3rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.delete ? '#4682B4' : '#1E90FF'}; /* Teinte bleue pour le bouton */
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const LicencesList = () => {
  // Liste des licences exemple
  const [licences, setLicences] = useState([
    {
      _id: '1',
      nom: 'Licence Windows 10',
      type: 'Système d\'exploitation',
      cle: 'XYZ123ABC',
      date_expiration: '2025-12-31',
    },
    {
      _id: '2',
      nom: 'Licence Microsoft Office',
      type: 'Logiciel',
      cle: 'ABC987XYZ',
      date_expiration: '2026-06-30',
    },
    {
      _id: '3',
      nom: 'Licence Adobe Photoshop',
      type: 'Logiciel',
      cle: 'PHOT1234AB',
      date_expiration: '2027-03-15',
    },
  ]);

  const navigate = useNavigate(); // Hook pour la navigation avec useNavigate

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette licence ?')) {
      setLicences(licences.filter(licence => licence._id !== id));
      alert('Licence supprimée avec succès !');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-licence/${id}`); // Redirection vers la page de modification avec useNavigate
  };

  return (
    <Container>
      <Menu />

      <MainContent>
        <ListContainer>
          <Title>Liste des Licences</Title>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Clé</TableHeaderCell>
                <TableHeaderCell>Date d'expiration</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            
            <tbody>
              {licences.map((licence) => (
                <TableRow key={licence._id}>
                  <TableCell>{licence.nom}</TableCell>
                  <TableCell>{licence.type}</TableCell>
                  <TableCell>{licence.cle}</TableCell>
                  <TableCell>{formatDate(licence.date_expiration)}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleEdit(licence._id)}>
                      <FaEdit /> {/* Icône de modification */}
                    </ActionButton>
                    <ActionButton delete onClick={() => handleDelete(licence._id)}>
                      <FaTrash /> {/* Icône de suppression */}
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
};

export default LicencesList;
