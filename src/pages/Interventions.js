import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Menu from './Menu';
import { createIntervention } from '../services/intervention';
import { getAllEquipments } from '../services/equipment';
import { useNotifications } from '../contexts/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faUser,
  faStickyNote,
  faDesktop,
  faSpinner,
  faPlus,
  faTools,
  faClipboardList
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

const InterventionFormContainer = styled.div`
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

const Textarea = styled.textarea`
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
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

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
  margin-bottom: 1.5rem;
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

const InterventionsForm = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [date, setDate] = useState('');
  const [technician_name, setTechnicianName] = useState('');
  const [note, setNote] = useState('');
  const [equipment_id, setEquipmentId] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les équipements depuis l'API
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        const data = await getAllEquipments();
        console.log('Equipment data:', data); // Debug log

        // Ensure we're working with an array
        if (Array.isArray(data)) {
          setEquipments(data);
        } else if (data && typeof data === 'object') {
          // If it's an object with nested data, try to find the array
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            setEquipments(possibleArrays[0]);
          } else {
            // If no arrays found, convert the object to an array if it has equipment-like properties
            if (data.id) {
              setEquipments([data]);
            } else {
              setEquipments([]);
              console.error('No equipment data found in response');
            }
          }
        } else {
          setEquipments([]);
          console.error('Unexpected equipment data format:', data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des équipements:', err);
        setError('Impossible de charger les équipements. Veuillez réessayer plus tard.');
        setEquipments([]); // Ensure equipments is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []); // Charge les équipements une seule fois lors du montage du composant

  const handleInterventionSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !technician_name || !note || !equipment_id) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    try {
      setLoading(true);

      // Préparer les données pour l'API
      const interventionData = {
        date,
        technician_name,
        note,
        equipment_id: parseInt(equipment_id, 10)
      };

      // Envoyer la requête à l'API pour ajouter l'intervention
      await createIntervention(interventionData);

      // Rediriger vers la liste des interventions après succès
      showSuccess("Intervention enregistrée avec succès !");
      navigate('/admin/interventions/list');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'intervention:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement de l\'intervention.');
      showError(err.message || 'Une erreur est survenue lors de l\'enregistrement de l\'intervention.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Menu />

      <MainContent>
        <InterventionFormContainer>
          <Title>Nouvelle Intervention</Title>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <form onSubmit={handleInterventionSubmit}>
            <FormGroup delay="0.1s">
              <Label>
                <FontAwesomeIcon icon={faCalendarAlt} />
                Date de l'Intervention
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup delay="0.2s">
              <Label>
                <FontAwesomeIcon icon={faUser} />
                Nom du Technicien
              </Label>
              <Input
                type="text"
                value={technician_name}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="Entrez le nom du technicien"
                disabled={loading}
              />
            </FormGroup>

            <FormGroup delay="0.3s">
              <Label>
                <FontAwesomeIcon icon={faStickyNote} />
                Note de l'Intervention
              </Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Décrivez les détails de l'intervention, les problèmes rencontrés, les solutions appliquées..."
                disabled={loading}
              />
            </FormGroup>

            <FormGroup delay="0.4s">
              <Label>
                <FontAwesomeIcon icon={faDesktop} />
                Équipement
              </Label>
              <Select
                value={equipment_id}
                onChange={(e) => setEquipmentId(e.target.value)}
                disabled={loading}
              >
                <option value="">Sélectionnez un équipement</option>
                {Array.isArray(equipments) && equipments.length > 0 ? (
                  equipments.map((equipment) => (
                    <option key={equipment.id} value={equipment.id}>
                      🖥️ {equipment.name || 'Sans nom'} - {equipment.type || 'N/A'} {equipment.serial_number ? `(${equipment.serial_number})` : ''}
                    </option>
                  ))
                ) : (
                  <option disabled>Aucun équipement disponible</option>
                )}
              </Select>
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoadingSpinner>
                  <FontAwesomeIcon icon={faSpinner} />
                  Enregistrement en cours...
                </LoadingSpinner>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} />
                  Enregistrer l'Intervention
                </>
              )}
            </Button>
          </form>
        </InterventionFormContainer>
      </MainContent>
    </Container>
  );
};

export default InterventionsForm;
