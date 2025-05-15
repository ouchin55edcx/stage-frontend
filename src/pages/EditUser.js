import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Menu from './Menu'; // Assurez-vous que Menu est bien importé
import { updateEmployer, fetchEmployer } from '../services/employer';
import { fetchAllServices } from '../services/service';

// Définition du CSS dans un composant styled-components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #FFFFFF; /* Fond blanc */
  color: #333333; /* Texte gris foncé pour contraster avec le fond blanc */
  font-family: 'Segoe UI', sans-serif;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
`;

const UserFormContainer = styled.div`
  background: #F5F5F5; /* Fond gris clair pour le formulaire */
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(39, 44, 94, 0.2); /* Teinte de bleu foncé */
  max-width: 800px;
  margin: 0 auto 3rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00AEEF, #0066CC); /* Teinte de bleu clair et foncé */
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
  color: #666666; /* Gris plus clair pour les labels */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: #FFFFFF; /* Fond blanc pour les champs de saisie */
  color: #333333; /* Texte gris foncé */
  border: 1px solid #CCCCCC; /* Bordure gris clair */
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #00AEEF; /* Teinte de bleu clair */
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 174, 239, 0.2); /* Teinte de bleu clair */
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #00AEEF, #0066CC); /* Teinte de bleu clair et foncé */
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
  }
`;

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  // État pour stocker les données de l'utilisateur
  const [user, setUser] = useState({
    nom: '',
    email: '',
    poste: '',
    tele: '',
    role: '',
    service_id: ''
  });

  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Validate ID
        if (!id || id === 'undefined') {
          navigate('/admin/users/list');
          return;
        }

        // Load user data
        const userData = await fetchEmployer(id);
        if (!userData) {
          alert('Utilisateur non trouvé');
          navigate('/admin/users/list');
          return;
        }

        // Transform API data to match form structure
        setUser({
          nom: userData.full_name,
          email: userData.email,
          poste: userData.poste,
          tele: userData.phone,
          role: userData.role || 'employe',
          service_id: userData.service_id
        });

        // Load services
        const servicesData = await fetchAllServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        alert('Erreur lors du chargement des données de l\'utilisateur');
        navigate('/admin/users/list');
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || id === 'undefined') {
      alert('ID utilisateur invalide.');
      return;
    }
    // Map user state to employerData for API
    const employerData = {
      full_name: user.nom,
      email: user.email,
      poste: user.poste,
      phone: user.tele,
      service_id: Number(user.service_id),
    };
    try {
      await updateEmployer(id, employerData);
      alert('Utilisateur modifié avec succès!');
      navigate('/admin/users/list');
    } catch (error) {
      console.error('Erreur lors de la modification de l\'utilisateur:', error);
    }
  };

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <UserFormContainer>
          <Title>Modifier l'Utilisateur</Title>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nom</Label>
              <Input type="text" name="nom" value={user.nom} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" name="email" value={user.email} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Poste</Label>
              <Input type="text" name="poste" value={user.poste} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Téléphone</Label>
              <Input type="tel" name="tele" value={user.tele} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Rôle</Label>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#FFFFFF', /* Fond blanc pour le champ de sélection */
                  color: '#333333', /* Texte gris foncé */
                  border: '1px solid #CCCCCC', /* Bordure gris clair */
                  borderRadius: '8px',
                }}
              >
                <option value="admin">Admin</option>
                <option value="employe">Employé</option>
              </select>
            </FormGroup>
            <FormGroup>
              <Label>Service</Label>
              <select
                name="service_id"
                value={user.service_id}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#FFFFFF',
                  color: '#333333',
                  border: '1px solid #CCCCCC',
                  borderRadius: '8px',
                }}
              >
                <option value="">Sélectionner un service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </FormGroup>
            <Button type="submit">Modifier l'utilisateur</Button>
          </form>
        </UserFormContainer>
      </MainContent>
    </Container>
  );
}

export default EditUser;
