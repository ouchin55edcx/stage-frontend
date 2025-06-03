import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
import { fetchLicenses, createLicense, deleteLicense } from '../services/license';
import { useNotifications } from '../contexts/NotificationContext';

// Styled Components
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

const ListContainer = styled.div`
  background: #F4F7FF;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(30, 144, 255, 0.3);
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1E90FF;
  text-align: center;
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  max-width: 500px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #1E90FF;
  border-radius: 8px 0 0 8px;
  outline: none;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  background: #1E90FF;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddButton = styled.button`
  background: #1E90FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  transition: all 0.3s;

  &:hover {
    background: #4682B4;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #E6F0FF;
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
    background: #C0C0C0;
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
  color: #1E90FF;
  border-bottom: 2px solid #444;
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

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  color: #1E90FF;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
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
  border: 1px solid #1E90FF;
  border-radius: 8px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  background: #1E90FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;

  &:hover {
    background: #4682B4;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #FF6B6B;
  margin-bottom: 1rem;
  text-align: center;
`;

const LicenseManagement = () => {
  const { showSuccess, showError, showConfirmation } = useNotifications();
  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    key: '',
    expiration_date: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fetch licenses on component mount
  useEffect(() => {
    fetchLicenseData();
  }, []);

  // Filter licenses when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLicenses(licenses);
    } else {
      const filtered = licenses.filter(license => 
        license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLicenses(filtered);
    }
  }, [searchTerm, licenses]);

  const fetchLicenseData = async () => {
    try {
      setLoading(true);
      const data = await fetchLicenses();
      setLicenses(data);
      setFilteredLicenses(data);
    } catch (err) {
      console.error('Error fetching licenses:', err);
      setError('Erreur lors du chargement des licences: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirmation(
      'Supprimer la licence',
      'Êtes-vous sûr de vouloir supprimer cette licence ? Cette action est irréversible.'
    );

    if (confirmed) {
      try {
        await deleteLicense(id);
        setLicenses(licenses.filter(license => license.id !== id));
        showSuccess('Licence supprimée avec succès !');
      } catch (err) {
        console.error('Error deleting license:', err);
        showError('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-licence/${id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await createLicense(formData);
      setShowModal(false);
      setFormData({
        name: '',
        type: '',
        key: '',
        expiration_date: ''
      });
      fetchLicenseData(); // Refresh the list
      showSuccess('Licence ajoutée avec succès !');
    } catch (err) {
      console.error('Error adding license:', err);
      setFormError(err.message || "Erreur lors de l'ajout de la licence");
      showError(err.message || "Erreur lors de l'ajout de la licence");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Menu />

      <MainContent>
        <ListContainer>
          <Title>Gestion des Licences</Title>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <AddButton onClick={() => setShowModal(true)}>
              <FaPlus /> Ajouter une licence
            </AddButton>

            <form onSubmit={handleSearch}>
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchButton type="submit">
                  <FaSearch />
                </SearchButton>
              </SearchContainer>
            </form>
          </div>

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
                {filteredLicenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="5" style={{ textAlign: 'center' }}>Aucune licence trouvée</TableCell>
                  </TableRow>
                ) : (
                  filteredLicenses.map((license) => (
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
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Ajouter une licence</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            {formError && <ErrorMessage>{formError}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Nom :</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Type :</Label>
                <Input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Clé :</Label>
                <Input
                  type="text"
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Date d'expiration :</Label>
                <Input
                  type="date"
                  name="expiration_date"
                  value={formData.expiration_date}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <SubmitButton
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Ajout en cours...' : 'Ajouter'}
              </SubmitButton>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default LicenseManagement;
