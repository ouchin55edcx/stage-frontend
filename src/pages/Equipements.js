import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Menu from './Menu';
import { getAllEquipments, createEquipment } from '../services/equipment';
import { fetchEmployers } from '../services/employer';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDesktop,
  faLaptop,
  faPrint,
  faServer,
  faNetworkWired,
  faTag,
  faBarcode,
  faUser,
  faSpinner,
  faPlus,
  faWifi,
  faMicrochip,
  faFileWord
} from '@fortawesome/free-solid-svg-icons';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const EquipementForm = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow:
    0 20px 40px rgba(0, 174, 239, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  max-width: 1000px;
  margin: 0 auto 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #00AEEF, #0066CC, #00AEEF);
    background-size: 200% 100%;
    animation: ${pulse} 3s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00AEEF 0%, #0066CC 50%, #004499 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  letter-spacing: -0.02em;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #00AEEF, #0066CC);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.95rem;

  svg {
    color: #00AEEF;
    font-size: 1.1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #e2e8f0, #cbd5e1) border-box;
  color: #334155;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    border: 2px solid transparent;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #00AEEF, #0066CC) border-box;
    box-shadow:
      0 0 0 4px rgba(0, 174, 239, 0.1),
      0 8px 16px -4px rgba(0, 174, 239, 0.2);
    outline: none;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f1f5f9;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #e2e8f0, #cbd5e1) border-box;
  color: #334155;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:focus {
    border: 2px solid transparent;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #00AEEF, #0066CC) border-box;
    box-shadow:
      0 0 0 4px rgba(0, 174, 239, 0.1),
      0 8px 16px -4px rgba(0, 174, 239, 0.2);
    outline: none;
    transform: translateY(-1px);
  }

  option {
    padding: 0.5rem;
    background: white;
    color: #334155;
  }
`;

const Button = styled.button`
  padding: 1.25rem 2rem;
  background: ${props => props.disabled
    ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
    : 'linear-gradient(135deg, #00AEEF 0%, #0066CC 100%)'};
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.disabled
    ? 'none'
    : '0 8px 16px -4px rgba(0, 174, 239, 0.4)'};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #0066CC 0%, #004499 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 24px -8px rgba(0, 174, 239, 0.5);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorText = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #fecaca;
  box-shadow: 0 2px 4px -1px rgba(220, 38, 38, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '⚠️';
    font-size: 1rem;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  }

  input {
    width: 1.25rem;
    height: 1.25rem;
    margin: 0;
    cursor: pointer;
    accent-color: #00AEEF;
  }

  label {
    margin: 0;
    display: inline;
    cursor: pointer;
    font-weight: 500;
    color: #334155;
  }
`;

function Equipements() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
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
      showSuccess("Équipement ajouté avec succès !");

      // Redirect to equipment list page
      navigate('/admin/equipements/list');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'équipement:', error);
      showError(`Erreur: ${error.message || 'Une erreur est survenue lors de l\'ajout de l\'équipement'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PC': return faDesktop;
      case 'Laptop': return faLaptop;
      case 'Printer': return faPrint;
      case 'Server': return faServer;
      case 'Network': return faNetworkWired;
      default: return faDesktop;
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
                <FormGroup delay="0.1s">
                  <Label>
                    <FontAwesomeIcon icon={faTag} />
                    Nom
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Entrez le nom de l'équipement"
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormGroup>

                <FormGroup delay="0.2s">
                  <Label>
                    <FontAwesomeIcon icon={formData.type ? getTypeIcon(formData.type) : faDesktop} />
                    Type
                  </Label>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">-- Sélectionner un type --</option>
                    <option value="PC">💻 PC</option>
                    <option value="Laptop">💻 Laptop</option>
                    <option value="Printer">🖨️ Imprimante</option>
                    <option value="Scanner">📄 Scanner</option>
                    <option value="Server">🖥️ Serveur</option>
                    <option value="Network">🌐 Équipement réseau</option>
                    <option value="Other">📦 Autre</option>
                  </Select>
                  {errors.type && <ErrorText>{errors.type}</ErrorText>}
                </FormGroup>

                <FormGroup delay="0.3s">
                  <Label>
                    <FontAwesomeIcon icon={faBarcode} />
                    État
                  </Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">✅ Actif</option>
                    <option value="on_hold">⏸️ En attente</option>
                    <option value="in_progress">🔄 En cours</option>
                  </Select>
                </FormGroup>

                <FormGroup delay="0.4s">
                  <Label>
                    <FontAwesomeIcon icon={faBarcode} />
                    Numéro de Série
                  </Label>
                  <Input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    placeholder="ex: SN123456789"
                  />
                  {errors.serial_number && <ErrorText>{errors.serial_number}</ErrorText>}
                </FormGroup>

                <FormGroup delay="0.5s">
                  <Label>
                    <FontAwesomeIcon icon={faTag} />
                    Marque
                  </Label>
                  <Input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="ex: Dell, HP, Lenovo"
                  />
                  {errors.brand && <ErrorText>{errors.brand}</ErrorText>}
                </FormGroup>

                <FormGroup delay="0.6s">
                  <Label>
                    <FontAwesomeIcon icon={faTag} />
                    Libellé
                  </Label>
                  <Input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="Description courte de l'équipement"
                  />
                  {errors.label && <ErrorText>{errors.label}</ErrorText>}
                </FormGroup>
              </div>

              {/* Colonne de droite */}
              <div>
                <FormGroup delay="0.7s">
                  <Label>
                    <FontAwesomeIcon icon={faBarcode} />
                    NSC
                  </Label>
                  <Input
                    type="text"
                    name="nsc"
                    value={formData.nsc}
                    onChange={handleChange}
                    placeholder="Numéro de série constructeur"
                  />
                  {errors.nsc && <ErrorText>{errors.nsc}</ErrorText>}
                </FormGroup>

                <FormGroup delay="0.8s">
                  <Label>
                    <FontAwesomeIcon icon={faWifi} />
                    Adresse IP
                  </Label>
                  <Input
                    type="text"
                    name="ip_address"
                    value={formData.ip_address}
                    onChange={handleChange}
                    placeholder="ex: 192.168.1.100"
                  />
                  {errors.ip_address && <ErrorText>{errors.ip_address}</ErrorText>}
                </FormGroup>

                <FormGroup delay="0.9s">
                  <Label>
                    <FontAwesomeIcon icon={faMicrochip} />
                    Processeur
                  </Label>
                  <Input
                    type="text"
                    name="processor"
                    value={formData.processor}
                    onChange={handleChange}
                    placeholder="ex: Intel Core i7-12700K"
                  />
                </FormGroup>

                <FormGroup delay="1.0s">
                  <Label>
                    <FontAwesomeIcon icon={faFileWord} />
                    Version Office
                  </Label>
                  <Input
                    type="text"
                    name="office_version"
                    value={formData.office_version}
                    onChange={handleChange}
                    placeholder="ex: Microsoft Office 365"
                  />
                </FormGroup>

                {/* Sélection de l'utilisateur */}
                <FormGroup delay="1.1s">
                  <Label>
                    <FontAwesomeIcon icon={faUser} />
                    Utilisateur
                  </Label>
                  <Select
                    name="employer_id"
                    value={formData.employer_id}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner un utilisateur</option>
                    {employers && employers.length > 0 ? (
                      employers.map((employer) => (
                        <option key={employer.id} value={employer.id}>
                          👤 {employer.full_name || 'Utilisateur sans nom'}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Chargement des utilisateurs...</option>
                    )}
                  </Select>
                  {errors.employer_id && <ErrorText>{errors.employer_id}</ErrorText>}
                </FormGroup>
              </div>
            </FormGrid>

            {/* Bouton d'ajout */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner>
                  <FontAwesomeIcon icon={faSpinner} />
                  Ajout en cours...
                </LoadingSpinner>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} />
                  Ajouter l'équipement
                </>
              )}
            </Button>
          </form>
        </EquipementForm>
      </MainContent>
    </Container>
  );
}

export default Equipements;
