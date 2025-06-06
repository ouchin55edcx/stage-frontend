import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Menu from './Menu';
import { getEquipmentById, updateEquipment } from '../services/equipment';
import { fetchEmployers } from '../services/employer';
import { useNotifications } from '../contexts/NotificationContext';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #FFFFFF; /* Fond blanc */
  color: black; /* Texte en noir pour contraster avec le fond blanc */
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
`;

const FormContainer = styled.div`
  background: #FFFFFF; /* Fond blanc pour le formulaire */
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 122, 255, 0.1); /* Teinte bleue moderne */
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00A9FF, #004D7F); /* Teinte bleue moderne */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  background: #FFFFFF; /* Fond blanc pour les champs */
  color: black; /* Texte noir pour les champs */
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Léger ombrage pour les champs */

  &:focus {
    outline: none;
    border-color: #00A9FF;
    box-shadow: 0 0 0 2px rgba(0, 169, 255, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  background: #FFFFFF;
  color: black;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #00A9FF;
    box-shadow: 0 0 0 2px rgba(0, 169, 255, 0.2);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333333; /* Texte plus sombre pour les labels */
  font-weight: 500;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  background-color: ${props => props.disabled ? '#cccccc' : '#00A9FF'}; /* Teinte bleue moderne */
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.3s ease;

  &:hover {
    background-color: ${props => props.disabled ? '#cccccc' : '#004D7F'}; /* Teinte bleue plus foncée */
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  font-weight: 500;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    width: auto;
    margin: 0;
  }

  label {
    margin: 0;
    display: inline;
  }
`;

function EditEquipement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'active',
    serial_number: '',
    brand: '',
    label: '',
    nsc: '',
    ip_address: '',
    processor: '',
    office_version: '',
    backup_enabled: false,
    employer_id: ''
  });

  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch equipment data
        const equipmentData = await getEquipmentById(id);
        if (equipmentData && equipmentData.data) {
          setFormData(equipmentData.data);
        } else {
          showError('Équipement non trouvé');
          navigate('/admin/equipements/list');
        }

        // Fetch employers for dropdown
        const employersData = await fetchEmployers();
        if (Array.isArray(employersData)) {
          setEmployers(employersData);
        } else if (employersData && employersData.employers && Array.isArray(employersData.employers)) {
          setEmployers(employersData.employers);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        showError(`Erreur: ${error.message || 'Une erreur est survenue lors du chargement des données'}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name?.trim()) newErrors.name = "Le nom est requis";
    if (!formData.type?.trim()) newErrors.type = "Le type est requis";

    // IP address validation
    if (formData.ip_address?.trim()) {
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(formData.ip_address)) {
        newErrors.ip_address = "Format d'adresse IP invalide";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure backup_enabled is always false
      const equipmentData = {
        ...formData,
        backup_enabled: false
      };

      await updateEquipment(id, equipmentData);
      showSuccess('Équipement modifié avec succès !');
      navigate('/admin/equipements/list');
    } catch (error) {
      console.error('Error updating equipment:', error);
      showError(`Erreur: ${error.message || 'Une erreur est survenue lors de la modification'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <FormContainer>
          <Title>Modifier l'équipement</Title>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement des données...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormGrid>
                {/* Colonne de gauche */}
                <div>
                  <FormGroup>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      error={errors.name}
                    />
                    {errors.name && <ErrorText>{errors.name}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      id="type"
                      name="type"
                      value={formData.type || ''}
                      onChange={handleChange}
                      error={errors.type}
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="PC">PC</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Printer">Imprimante</option>
                      <option value="Scanner">Scanner</option>
                      <option value="Server">Serveur</option>
                      <option value="Network">Équipement réseau</option>
                      <option value="Other">Autre</option>
                    </Select>
                    {errors.type && <ErrorText>{errors.type}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="status">État</Label>
                    <Select
                      id="status"
                      name="status"
                      value={formData.status || 'active'}
                      onChange={handleChange}
                    >
                      <option value="active">Actif</option>
                      <option value="on_hold">En attente</option>
                      <option value="in_progress">En cours</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="serial_number">Numéro de Série</Label>
                    <Input
                      id="serial_number"
                      name="serial_number"
                      value={formData.serial_number || ''}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="brand">Marque</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand || ''}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="label">Libellé</Label>
                    <Input
                      id="label"
                      name="label"
                      value={formData.label || ''}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </div>

                {/* Colonne de droite */}
                <div>
                  <FormGroup>
                    <Label htmlFor="nsc">NSC</Label>
                    <Input
                      id="nsc"
                      name="nsc"
                      value={formData.nsc || ''}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="ip_address">Adresse IP</Label>
                    <Input
                      id="ip_address"
                      name="ip_address"
                      value={formData.ip_address || ''}
                      onChange={handleChange}
                      placeholder="ex: 192.168.1.100"
                      error={errors.ip_address}
                    />
                    {errors.ip_address && <ErrorText>{errors.ip_address}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="processor">Processeur</Label>
                    <Input
                      id="processor"
                      name="processor"
                      value={formData.processor || ''}
                      onChange={handleChange}
                      placeholder="ex: Intel i7"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="office_version">Version Office</Label>
                    <Input
                      id="office_version"
                      name="office_version"
                      value={formData.office_version || ''}
                      onChange={handleChange}
                      placeholder="ex: Office 365"
                    />
                  </FormGroup>



                  <FormGroup>
                    <Label htmlFor="employer_id">Utilisateur</Label>
                    <Select
                      id="employer_id"
                      name="employer_id"
                      value={formData.employer_id || ''}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {employers && employers.length > 0 ? (
                        employers.map((employer) => (
                          <option key={employer.id} value={employer.id}>
                            {employer.full_name || 'Utilisateur sans nom'}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>Chargement des utilisateurs...</option>
                      )}
                    </Select>
                  </FormGroup>
                </div>
              </FormGrid>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </SubmitButton>
            </form>
          )}
        </FormContainer>
      </MainContent>
    </Container>
  );
}

export default EditEquipement;
