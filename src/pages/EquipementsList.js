import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import styled from 'styled-components';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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

function EquipementList() {
  const [equipements, setEquipements] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Exemple d'équipement pour test local sans backend
    setEquipements([{
      id: 1,
      nom: 'PC Bureau',
      type: 'PC',
      etat: 'actif',
      numero_serie: 'SN123456789',
      marque: 'Dell',
      libelle: 'Ordinateur principal',
      ecran: '24 pouces',
      nce: 'NCE-001',
      adresse_ip: '192.168.1.10',
      processeur: 'Intel Core i7',
      office: 'Office 2019',
      sauvegarde: 'Oui',
      user_id: 1
    }]);


    setUsers([{
      id: 1,
      nom: 'Ahmed El Amrani',
      role: 'Technicien'
    }]);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet équipement ?')) {
      setEquipements(prev => prev.filter(e => e.id !== id));
    }
  };

  const getUserName = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? `${user.nom} (${user.role})` : 'Non attribué';
  };

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
                <TableHeaderCell>Écran</TableHeaderCell>
                <TableHeaderCell>NCE</TableHeaderCell>
                <TableHeaderCell>Adresse IP</TableHeaderCell>
                <TableHeaderCell>Processeur</TableHeaderCell>
                <TableHeaderCell>Office</TableHeaderCell>
                <TableHeaderCell>Sauvegarde</TableHeaderCell>
                <TableHeaderCell>Utilisateur</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {equipements.map(equipement => (
                <TableRow key={equipement.id}>
                  <TableCell>{equipement.nom}</TableCell>
                  <TableCell>{equipement.type}</TableCell>
                  <TableCell>
                    <span style={{
                      color: equipement.etat === 'actif' ? '#28a745' :
                             equipement.etat === 'en_panne' ? '#dc3545' : '#ffc107',
                      fontWeight: '500'
                    }}>
                      {equipement.etat}
                    </span>
                  </TableCell>
                  <TableCell>{equipement.numero_serie}</TableCell>
                  <TableCell>{equipement.marque}</TableCell>
                  <TableCell>{equipement.libelle}</TableCell>
                  <TableCell>{equipement.ecran}</TableCell>
                  <TableCell>{equipement.nce}</TableCell>
                  <TableCell>{equipement.adresse_ip}</TableCell>
                  <TableCell>{equipement.processeur}</TableCell>
                  <TableCell>{equipement.office}</TableCell>
                  <TableCell>{equipement.sauvegarde}</TableCell>
                  <TableCell>{getUserName(equipement.user_id)}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => window.location.href = `/equipements/edit/${equipement.id}`}>
                      <FontAwesomeIcon icon={faEdit} />
                    </ActionButton>
                    <ActionButton delete onClick={() => handleDelete(equipement.id)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
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

export default EquipementList;
