import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getAllEquipments, deleteEquipment } from '../services/equipment';
import { useNavigate } from 'react-router-dom';

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

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.8rem 1.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #00aaff, #005f99);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

function EquipementList() {
  const navigate = useNavigate();
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const response = await getAllEquipments();
      setEquipements(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching equipments:', err);
      setError('Failed to fetch equipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      try {
        setIsDeleting(true);
        await deleteEquipment(id);
        // Refresh the list after successful deletion
        await fetchEquipments();
        alert('Équipement supprimé avec succès');
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert(`Erreur lors de la suppression: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/equipements/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/equipements/add');
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

  if (loading) return <MainContent><ListContainer><Title>Loading...</Title></ListContainer></MainContent>;
  if (error) return <MainContent><ListContainer><Title>{error}</Title></ListContainer></MainContent>;

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <ListContainer>
          <Title>Liste des équipements</Title>

          <AddButton onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter un équipement
          </AddButton>

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
                <TableHeaderCell>Sauvegarde</TableHeaderCell>
                <TableHeaderCell>Employé</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {equipements.map(equipement => (
                <TableRow key={equipement.id}>
                  <TableCell>{equipement.name}</TableCell>
                  <TableCell>{equipement.type}</TableCell>
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
                  <TableCell>{equipement.serial_number}</TableCell>
                  <TableCell>{equipement.brand}</TableCell>
                  <TableCell>{equipement.label}</TableCell>
                  <TableCell>{equipement.nsc}</TableCell>
                  <TableCell>{equipement.ip_address}</TableCell>
                  <TableCell>{equipement.processor}</TableCell>
                  <TableCell>{equipement.office_version}</TableCell>
                  <TableCell>{equipement.backup_enabled ? 'Oui' : 'Non'}</TableCell>
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
              {equipements.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan="13" style={{ textAlign: 'center', padding: '2rem' }}>
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
