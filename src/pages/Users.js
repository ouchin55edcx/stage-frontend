import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Menu from './Menu'; // Assurez-vous que Menu est bien importé
import { fetchAllServices } from '../services/service';
import { createEmployer } from '../services/employer';

// Définition du CSS dans un composant styled-components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #F4F7FA; /* Fond bleu clair */
  color: #333;
    fontFamily: "'IBM Plex Sans', sans-serif",
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
`;

const UserFormContainer = styled.div`
  background: #ffffff; /* Fond blanc pour le formulaire */
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 139, 0.2); /* Ombre bleue */
  max-width: 800px;
  margin: 0 auto 3rem;
  border: 1px solid #D0E2FF; /* Bordure bleue claire */
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #4A90E2, #1D3A72); /* Dégradé de bleu */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4A90E2; /* Texte bleu clair */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: #F4F7FA; /* Fond bleu très clair */
  color: #333;
  border: 1px solid #4A90E2; /* Bordure bleue */
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #1D3A72; /* Bordure bleu foncé */
    outline: none;
    box-shadow: 0 0 0 2px rgba(26, 13, 71, 0.2); /* Ombre bleue foncée */
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #4A90E2, #1D3A72); /* Dégradé bleu */
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(45deg, #1D3A72, #4A90E2); /* Changement de dégradé au survol */
  }
`;

function Users() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    poste: '',
    tele: '',
    service_id: '',
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchAllServices();
      setServices(data);
    };
    loadServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert('Employeur ajouté avec succès!');
      setFormData({
        nom: '',
        email: '',
        poste: '',
        tele: '',
        service_id: '',
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'employeur:', error);
    }
  };

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <UserFormContainer>
          <Title>Ajouter un Utilisateur</Title>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nom</Label>
              <Input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Poste</Label>
              <Input type="text" name="poste" value={formData.poste} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Téléphone</Label>
              <Input type="tel" name="tele" value={formData.tele} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Service</Label>
              <select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#F4F7FA',
                  color: '#333',
                  border: '1px solid #4A90E2',
                  borderRadius: '8px',
                }}
              >
                <option value="">Sélectionner un service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </FormGroup>
            <Button type="submit">Ajouter l'utilisateur</Button>
          </form>
        </UserFormContainer>
      </MainContent>
    </Container>
  );
}

export default Users;
