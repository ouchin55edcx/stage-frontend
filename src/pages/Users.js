import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faBriefcase, faPhone, faBuilding, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { fetchAllServices } from '../services/service';
import { createEmployer } from '../services/employer';
import { useNotifications } from '../contexts/NotificationContext';

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

const UserFormContainer = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow:
    0 20px 40px rgba(0, 174, 239, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  max-width: 900px;
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

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid #fecaca;
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #16a34a;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid #bbf7d0;
  box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '✅';
    font-size: 1.2rem;
  }
`;

function Users() {
  // Enhanced Users form with modern styling
  const { showSuccess, showError } = useNotifications();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    poste: '',
    tele: '',
    service_id: '',
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      setServicesLoading(true);
      try {
        const data = await fetchAllServices();
        setServices(data);
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
        showError('Erreur lors du chargement des services');
      } finally {
        setServicesLoading(false);
      }
    };
    loadServices();
  }, [showError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.nom.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('L\'email doit être valide');
      return false;
    }
    if (!formData.poste.trim()) {
      setError('Le poste est requis');
      return false;
    }
    if (!formData.tele.trim()) {
      setError('Le téléphone est requis');
      return false;
    }
    if (!formData.service_id) {
      setError('Le service est requis');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Map formData to employerData for API
    const employerData = {
      full_name: formData.nom,
      email: formData.email,
      poste: formData.poste,
      phone: formData.tele,
      service_id: formData.service_id,
    };

    try {
      await createEmployer(employerData);
      const successMessage = `Utilisateur "${formData.nom}" ajouté avec succès!`;
      setSuccess(successMessage);
      showSuccess(successMessage);

      // Reset form
      setFormData({
        nom: '',
        email: '',
        poste: '',
        tele: '',
        service_id: '',
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'employeur:', error);
      const errorMessage = 'Erreur lors de l\'ajout de l\'utilisateur. Veuillez réessayer.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <UserFormContainer>
          <Title>Ajouter un Utilisateur</Title>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup delay="0.1s">
                <Label>
                  <FontAwesomeIcon icon={faUser} />
                  Nom complet
                </Label>
                <Input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Entrez le nom complet"
                  required
                />
              </FormGroup>

              <FormGroup delay="0.2s">
                <Label>
                  <FontAwesomeIcon icon={faEnvelope} />
                  Adresse email
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  required
                />
              </FormGroup>

              <FormGroup delay="0.3s">
                <Label>
                  <FontAwesomeIcon icon={faBriefcase} />
                  Poste
                </Label>
                <Input
                  type="text"
                  name="poste"
                  value={formData.poste}
                  onChange={handleChange}
                  placeholder="Titre du poste"
                  required
                />
              </FormGroup>

              <FormGroup delay="0.4s">
                <Label>
                  <FontAwesomeIcon icon={faPhone} />
                  Téléphone
                </Label>
                <Input
                  type="tel"
                  name="tele"
                  value={formData.tele}
                  onChange={handleChange}
                  placeholder="+33 1 23 45 67 89"
                  required
                />
              </FormGroup>
            </FormGrid>

            <FormGroup delay="0.5s">
              <Label>
                <FontAwesomeIcon icon={faBuilding} />
                Service
              </Label>
              <Select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                required
                disabled={servicesLoading}
              >
                <option value="">
                  {servicesLoading ? 'Chargement des services...' : 'Sélectionner un service'}
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <Button type="submit" disabled={loading || servicesLoading}>
              {loading ? (
                <LoadingSpinner>
                  <FontAwesomeIcon icon={faSpinner} />
                  Ajout en cours...
                </LoadingSpinner>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Ajouter l'utilisateur
                </>
              )}
            </Button>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
          </form>
        </UserFormContainer>
      </MainContent>
    </Container>
  );
}

export default Users;
