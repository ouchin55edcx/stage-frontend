import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Menu from './Menu';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #FFFFFF; /* Fond principal en blanc */
  color: white;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
`;

const FormContainer = styled.div`
  background: #FFFFFF; /* Fond blanc pour le formulaire */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(139, 0, 0, 0.2);
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00BFFF, #1E90FF); /* Teinte bleue moderne */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  border: 1px solid #007BFF; /* Bordure bleue */
  background: #F4F4F4; /* Fond clair pour l'entrée */
  color: black;
`;

const Button = styled.button`
  padding: 0.7rem 1.5rem;
  background: #1E90FF; /* Couleur bleue pour le bouton */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  display: block;
  width: 100%;

  &:hover {
    opacity: 0.9;
    background: #4682B4; /* Teinte de bleu plus foncée au survol */
  }
`;

function EditService() {
  const [service, setService] = useState({
    nom_serv: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`/api/services/${id}`);
        setService(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/services/${id}`, service);
      alert('Service mis à jour avec succès !');
      navigate('/services'); // Redirige vers la liste des services
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service:', error);
      alert('Erreur lors de la mise à jour du service');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Container>
      <Menu notifications={[]} />
      
      <MainContent>
        <FormContainer>
          <Title>Éditer le Service</Title>

          <form onSubmit={handleSubmit}>
            {/* Nom du Service */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ color: '#333' }}>Nom du Service</label>
              <Input
                type="text"
                name="nom_serv"
                value={service.nom_serv}
                onChange={handleInputChange}
                placeholder="Entrez le nom du service"
              />
            </div>

            <Button type="submit">Mettre à jour le Service</Button>
          </form>
        </FormContainer>
      </MainContent>
    </Container>
  );
}

export default EditService;
