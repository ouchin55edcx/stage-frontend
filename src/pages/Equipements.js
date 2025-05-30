import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Menu from './Menu';
import { getAllEquipments, createEquipment } from '../services/equipment';
import { fetchEmployers } from '../services/employer';
import { useNavigate } from 'react-router-dom';

// Définition du CSS dans un composant styled-components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f4f8; /* Fond blanc/bleu clair */
  color: #333333; /* Texte gris foncé */
  font-family: 'Segoe UI', sans-serif;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
`;

const EquipementForm = styled.div`
  background: #ffffff; /* Fond blanc pour le formulaire */
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 174, 239, 0.2); /* Teinte bleu clair pour l'ombre */
  max-width: 800px;
  margin: 0 auto 3rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00AEEF, #0066CC); /* Dégradé de bleu */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #666666; /* Gris clair pour les labels */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: #f7f7f7; /* Fond très clair pour les champs de saisie */
  color: #333333; /* Texte gris foncé */
  border: 1px solid #cccccc; /* Bordure gris clair */
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #00AEEF; /* Teinte de bleu clair */
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 174, 239, 0.2); /* Ombre légère en bleu clair */
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #00AEEF, #0066CC); /* Dégradé de bleu */
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
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

function Equipements() {
  const navigate = useNavigate();
  const [equipements, setEquipements] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'active', // Default to 'active'
    serial_number: '',
    brand: '',
    label: '',
    nsc: '',
    ip_address: '',
    processor: '',
    office_version: '',
    backup_enabled: false,
    employer_id: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipmentsResponse = await getAllEquipments();
        setEquipements(equipmentsResponse.data);

        const employersData = await fetchEmployers();
        console.log('Employers data:', employersData); // For debugging

        // Check if we have the expected data structure
        if (employersData && Array.isArray(employersData)) {
          setEmployers(employersData);
        } else if (employersData && employersData.employers && Array.isArray(employersData.employers)) {
          // If the data is wrapped in an employers property
          setEmployers(employersData.employers);
        } else {
          console.error('Unexpected employers data format:', employersData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.type.trim()) newErrors.type = "Le type est requis";
    if (!formData.serial_number.trim()) newErrors.serial_number = "Le numéro de série est requis";
    if (!formData.brand.trim()) newErrors.brand = "La marque est requise";
    if (!formData.label.trim()) newErrors.label = "Le libellé est requis";
    if (!formData.nsc.trim()) newErrors.nsc = "Le NSC est requis";

    // IP address validation
    if (formData.ip_address.trim()) {
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(formData.ip_address)) {
        newErrors.ip_address = "Format d'adresse IP invalide";
      }
    }

    // Employer validation
    if (!formData.employer_id) newErrors.employer_id = "Veuillez sélectionner un utilisateur";

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
      await createEquipment(formData);

      // Success message
      alert("Équipement ajouté avec succès !");

      // Redirect to equipment list page
      navigate('/admin/equipements/list');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'équipement:', error);
      alert(`Erreur: ${error.message || 'Une erreur est survenue lors de l\'ajout de l\'équipement'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Menu notifications={[]} />

      <MainContent>
        <EquipementForm>
          <Title>Ajouter un Équipement</Title>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              {/* Colonne de gauche */}
              <div>
                <FormGroup>
                  <Label>Nom</Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ borderColor: errors.name ? '#e74c3c' : '#cccccc' }}
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Type</Label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: '#f7f7f7',
                      color: '#333333',
                      border: errors.type ? '1px solid #e74c3c' : '1px solid #cccccc',
                      borderRadius: '8px'
                    }}>
                    <option value="">-- Sélectionner --</option>
                    <option value="PC">PC</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Printer">Imprimante</option>
                    <option value="Scanner">Scanner</option>
                    <option value="Server">Serveur</option>
                    <option value="Network">Équipement réseau</option>
                    <option value="Other">Autre</option>
                  </select>
                  {errors.type && <ErrorText>{errors.type}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>État</Label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: '#f7f7f7',
                      color: '#333333',
                      border: '1px solid #cccccc',
                      borderRadius: '8px'
                    }}>
                    <option value="active">Actif</option>
                    <option value="on_hold">En attente</option>
                    <option value="in_progress">En cours</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Label>Numéro de Série</Label>
                  <Input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    style={{ borderColor: errors.serial_number ? '#e74c3c' : '#cccccc' }}
                  />
                  {errors.serial_number && <ErrorText>{errors.serial_number}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Marque</Label>
                  <Input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    style={{ borderColor: errors.brand ? '#e74c3c' : '#cccccc' }}
                  />
                  {errors.brand && <ErrorText>{errors.brand}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Libellé</Label>
                  <Input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    style={{ borderColor: errors.label ? '#e74c3c' : '#cccccc' }}
                  />
                  {errors.label && <ErrorText>{errors.label}</ErrorText>}
                </FormGroup>
              </div>

              {/* Colonne de droite */}
              <div>
                <FormGroup>
                  <Label>NSC</Label>
                  <Input
                    type="text"
                    name="nsc"
                    value={formData.nsc}
                    onChange={handleChange}
                    style={{ borderColor: errors.nsc ? '#e74c3c' : '#cccccc' }}
                  />
                  {errors.nsc && <ErrorText>{errors.nsc}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Adresse IP</Label>
                  <Input
                    type="text"
                    name="ip_address"
                    value={formData.ip_address}
                    onChange={handleChange}
                    placeholder="ex: 192.168.1.100"
                    style={{ borderColor: errors.ip_address ? '#e74c3c' : '#cccccc' }}
                  />
                  {errors.ip_address && <ErrorText>{errors.ip_address}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Processeur</Label>
                  <Input
                    type="text"
                    name="processor"
                    value={formData.processor}
                    onChange={handleChange}
                    placeholder="ex: Intel i7"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Version Office</Label>
                  <Input
                    type="text"
                    name="office_version"
                    value={formData.office_version}
                    onChange={handleChange}
                    placeholder="ex: Office 365"
                  />
                </FormGroup>

                {/* Sauvegarde activée checkbox hidden for new equipment */}
                {/*
                <FormGroup>
                  <Checkbox>
                    <input
                      type="checkbox"
                      id="backup_enabled"
                      name="backup_enabled"
                      checked={formData.backup_enabled}
                      onChange={handleChange}
                    />
                    <Label htmlFor="backup_enabled" style={{ marginBottom: 0 }}>Sauvegarde activée</Label>
                  </Checkbox>
                </FormGroup>
                */}

                {/* Sélection de l'utilisateur */}
                <FormGroup>
                  <Label>Utilisateur</Label>
                  <select
                    name="employer_id"
                    value={formData.employer_id}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: '#f7f7f7',
                      color: '#333333',
                      border: errors.employer_id ? '1px solid #e74c3c' : '1px solid #cccccc',
                      borderRadius: '8px'
                    }}>
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
                  </select>
                  {errors.employer_id && <ErrorText>{errors.employer_id}</ErrorText>}
                </FormGroup>
              </div>
            </FormGrid>

            {/* Bouton d'ajout */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter l\'équipement'}
            </Button>
          </form>
        </EquipementForm>
      </MainContent>
    </Container>
  );
}

export default Equipements;
