// src/pages/Licences.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Menu from './Menu';
import Modal from '../components/Modal';
import { createLicense, fetchLicenses, getLicenseById, updateLicense, deleteLicense } from '../services/license';
import { useNavigate } from 'react-router-dom';

// Styled components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #FFFFFF;
  color: #333333;
`;

const MainContent = styled.div`
  margin-left: 270px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 270px);
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1E90FF;
`;

const ListContainer = styled.div`
  background: #F4F7FF;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(30, 144, 255, 0.3);
  max-width: 1200px;
  margin: 0 auto;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1E90FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0066CC;
    transform: translateY(-2px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: #1E90FF;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #F4F7FF;
  }

  &:hover {
    background: #E6F0FF;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #E6E6E6;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  margin: 0 0.3rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.delete ? '#FF6B6B' : '#1E90FF'};
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #1E90FF;
  background-color: #F4F7FF;
  color: #333333;
  outline: none;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #1E90FF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  margin-top: 1rem;

  &:hover {
    background-color: #0066CC;
  }

  &:disabled {
    background-color: #CCCCCC;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #FF6B6B;
  margin-bottom: 1rem;
  text-align: center;
`;

const Licences = () => {
  const navigate = useNavigate();

  // State for licenses list
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    key: '',
    expiration_date: ''
  });

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLicense, setEditLicense] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Fetch licenses on component mount
  useEffect(() => {
    const fetchLicenseData = async () => {
      try {
        setLoading(true);
        const data = await fetchLicenses();
        setLicenses(data);
      } catch (err) {
        console.error('Error fetching licenses:', err);
        setError('Erreur lors du chargement des licences: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenseData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Handle form input changes for add modal
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form input changes for edit modal
  const handleEditChange = (e) => {
    setEditLicense({ ...editLicense, [e.target.name]: e.target.value });
  };

  // Handle add license form submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createLicense(formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        type: '',
        key: '',
        expiration_date: ''
      });

      // Refresh the licenses list
      const data = await fetchLicenses();
      setLicenses(data);

      alert('Licence ajoutée avec succès !');
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors de l'ajout de la licence");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit license form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    try {
      await updateLicense(editLicense.id, editLicense);
      setShowEditModal(false);
      setEditLicense(null);

      // Refresh the licenses list
      const data = await fetchLicenses();
      setLicenses(data);

      alert('Licence modifiée avec succès !');
    } catch (err) {
      console.error('Error updating license:', err);
      setEditError('Erreur lors de la mise à jour: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Open edit modal with license data
  const handleEdit = async (id) => {
    try {
      setEditLoading(true);
      const data = await getLicenseById(id);
      setEditLicense(data);
      setShowEditModal(true);
    } catch (err) {
      console.error('Error fetching license:', err);
      alert('Erreur lors du chargement de la licence: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle license deletion
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette licence ?')) {
      try {
        await deleteLicense(id);
        setLicenses(licenses.filter(license => license.id !== id));
        alert('Licence supprimée avec succès !');
      } catch (err) {
        console.error('Error deleting license:', err);
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  // Backward compatibility function for any references to the old function name
  const handleSubmit = handleAddSubmit;

  return (
    <Container>
      <Menu />
      <MainContent>
        <ListContainer>
          <Title>Gestion des Licences</Title>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <AddButton onClick={() => setShowAddModal(true)}>
            <FaPlus /> Ajouter une licence
          </AddButton>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement des licences...</div>
          ) : (
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
                {licenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="5" style={{ textAlign: 'center' }}>Aucune licence trouvée</TableCell>
                  </TableRow>
                ) : (
                  licenses.map((license) => (
                    <TableRow key={license.id}>
                      <TableCell>{license.name}</TableCell>
                      <TableCell>{license.type}</TableCell>
                      <TableCell>{license.key}</TableCell>
                      <TableCell>{formatDate(license.expiration_date)}</TableCell>
                      <TableCell>
                        <ActionButton onClick={() => handleEdit(license.id)}>
                          <FaEdit />
                        </ActionButton>
                        <ActionButton delete onClick={() => handleDelete(license.id)}>
                          <FaTrash />
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </ListContainer>
      </MainContent>

      {/* Add License Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter une licence"
      >
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleAddSubmit}>
          <FormGroup>
            <Label>Nom :</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Type :</Label>
            <Input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Clé :</Label>
            <Input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Date d'expiration :</Label>
            <Input
              type="date"
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </SubmitButton>
        </form>
      </Modal>

      {/* Edit License Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier la licence"
      >
        {editError && <ErrorMessage>{editError}</ErrorMessage>}

        {editLicense && (
          <form onSubmit={handleEditSubmit}>
            <FormGroup>
              <Label>Nom :</Label>
              <Input
                type="text"
                name="name"
                value={editLicense.name}
                onChange={handleEditChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Type :</Label>
              <Input
                type="text"
                name="type"
                value={editLicense.type}
                onChange={handleEditChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Clé :</Label>
              <Input
                type="text"
                name="key"
                value={editLicense.key}
                onChange={handleEditChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Date d'expiration :</Label>
              <Input
                type="date"
                name="expiration_date"
                value={editLicense.expiration_date}
                onChange={handleEditChange}
                required
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={editLoading}
            >
              {editLoading ? 'Enregistrement...' : 'Sauvegarder'}
            </SubmitButton>
          </form>
        )}
      </Modal>
    </Container>
  );
};

export default Licences;
