import React, { useState, useEffect } from 'react';
import { createEquipment } from '../services/equipment';
import { fetchEmployers } from '../services/employer';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const EquipementForm = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
`;

const FormColumnsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: #555;
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #0056b3;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #0056b3;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #0056b3;
  }
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 40px;
  position: relative;
`;

const SubmitButton = styled.button`
  padding: 12px 50px;
  font-size: 16px;
  background-color: #0056b3;
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  font-size: 14px;
  margin-top: 10px;
`;

const LoadingMessage = styled.div`
  color: #007bff;
  font-size: 14px;
  margin-top: 10px;
`;

function AddEquipement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: '',
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadEmployers = async () => {
      setIsLoading(true);
      try {
        const response = await fetchEmployers();
        console.log('API Response:', response); // For debugging

        // Check if the response has the expected structure with employers array
        if (response && response.employers && Array.isArray(response.employers)) {
          setEmployers(response.employers);
          console.log('Employers loaded:', response.employers);
        } else if (Array.isArray(response)) {
          // If the response is directly an array
          setEmployers(response);
          console.log('Employers loaded (array):', response);
        } else {
          console.error('Unexpected employers data format:', response);
          // Fallback to mock data for testing
          const mockEmployers = [
            {
              id: 1,
              user_id: 2,
              full_name: "John Doe",
              email: "john@example.com",
              poste: "Software Developer",
              phone: "123-456-7890",
              service: "IT Department",
              service_id: 1,
              is_active: true
            },
            {
              id: 2,
              user_id: 3,
              full_name: "Jane Smith",
              email: "jane@example.com",
              poste: "Designer",
              phone: "987-654-3210",
              service: "Design Department",
              service_id: 2,
              is_active: true
            }
          ];
          setEmployers(mockEmployers);
          console.log('Using mock employer data:', mockEmployers);
        }
      } catch (error) {
        console.error('Error loading employers:', error);
        setErrorMessage('Erreur lors du chargement des utilisateurs');

        // Fallback to mock data on error
        const mockEmployers = [
          {
            id: 1,
            user_id: 2,
            full_name: "John Doe (Mock)",
            email: "john@example.com",
            poste: "Software Developer",
            phone: "123-456-7890",
            service: "IT Department",
            service_id: 1,
            is_active: true
          }
        ];
        setEmployers(mockEmployers);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployers();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await createEquipment(formData);
      alert("Equipment added successfully!");
      navigate('/equipments'); // Redirect to equipment list
    } catch (error) {
      setErrorMessage(error.message || "Error adding equipment");
      console.error('Error adding equipment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EquipementForm>
      <Title>Ajouter un nouvel équipement</Title>
      <form onSubmit={handleSubmit}>
        <FormColumnsContainer>
          {/* Colonne Gauche */}
          <div>
            <FormGroup>
              <Label htmlFor="name">Nom :</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="type">Type :</Label>
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">-- Choisir --</option>
                <option value="PC">PC</option>
                <option value="Imprimante">Imprimante</option>
                <option value="Scanner">Scanner</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="status">État :</Label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionner --</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="brand">Marque :</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="label">Libellé :</Label>
              <Input
                id="label"
                name="label"
                value={formData.label}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="serial_number">Numéro de série :</Label>
              <Input
                id="serial_number"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
              />
            </FormGroup>
          </div>

          {/* Colonne Droite */}
          <div>
            <FormGroup>
              <Label htmlFor="nsc">NSC :</Label>
              <Input
                id="nsc"
                name="nsc"
                value={formData.nsc}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ip_address">Adresse IP :</Label>
              <Input
                id="ip_address"
                name="ip_address"
                value={formData.ip_address}
                onChange={handleChange}
                placeholder="ex: 192.168.1.100"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="processor">Processeur :</Label>
              <Input
                id="processor"
                name="processor"
                value={formData.processor}
                onChange={handleChange}
                placeholder="ex: Intel i7"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="office_version">Version Office :</Label>
              <Input
                id="office_version"
                name="office_version"
                value={formData.office_version}
                onChange={handleChange}
                placeholder="ex: Office 365"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="backup_enabled">Sauvegarde activée :</Label>
              <input
                id="backup_enabled"
                type="checkbox"
                name="backup_enabled"
                checked={formData.backup_enabled}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="employer_id">Utilisateur :</Label>
              <Select
                id="employer_id"
                name="employer_id"
                value={formData.employer_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un utilisateur</option>
                {employers && employers.length > 0 ? (
                  employers.map(employer => (
                    <option key={employer.id} value={employer.id}>
                      {employer.full_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Chargement des utilisateurs...</option>
                )}
              </Select>
              {isLoading && <LoadingMessage>Chargement des utilisateurs...</LoadingMessage>}
              {(!employers || employers.length === 0) && !isLoading && (
                <div className="helper-text">Aucun utilisateur disponible</div>
              )}
            </FormGroup>
          </div>
        </FormColumnsContainer>

        <ButtonContainer>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {isLoading && <LoadingMessage>Chargement...</LoadingMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Ajout en cours...' : 'Ajouter'}
          </SubmitButton>
        </ButtonContainer>
      </form>
    </EquipementForm>
  );
}

export default AddEquipement;
