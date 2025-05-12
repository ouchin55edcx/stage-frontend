import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Menu from './Menu';

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
  background: #F0F0F0; /* Fond gris clair pour le formulaire */
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 122, 255, 0.2); /* Teinte bleue moderne */
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

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: none;
  background: #FFFFFF; /* Fond blanc pour les champs */
  color: black; /* Texte noir pour les champs */
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Léger ombrage pour les champs */
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
  background-color: #00A9FF; /* Teinte bleue moderne */
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #004D7F; /* Teinte bleue plus foncée */
  }
`;

function EditEquipement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipement, setEquipement] = useState({
    nom: '',
    type: '',
    etat: '',
    numero_serie: '',
    marque: '',
    libelle: '',
    ecran: '',
    nce: '',
    adresse_ip: '',
    processeur: '',
    office: '',
    sauvegarde: '',
    user_id: ''
  });

  useEffect(() => {
    // Exemple local (à remplacer par un appel API si backend)
    const fakeData = {
      1: {
        nom: 'PC Bureau',
        type: 'PC',
        etat: 'actif',
        numero_serie: 'SN123456789',
        marque: 'Dell',
        libelle: 'Ordinateur principal',
        ecran: '24 pouces',
        nce: 'NCE-001',
        adresse_ip: '192.168.1.10',
        processeur: 'Intel Core i7',
        office: 'Office 2019',
        sauvegarde: 'Oui',
        user_id: 1
      }
    };
    if (fakeData[id]) {
      setEquipement(fakeData[id]);
    }
  }, [id]);

  const handleChange = (e) => {
    setEquipement({ ...equipement, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Équipement modifié avec succès !');
    navigate('/equipements');
  };

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <FormContainer>
          <Title>Modifier l'équipement</Title>
          <form onSubmit={handleSubmit}>
            {Object.entries(equipement).map(([key, value]) => (
              key !== 'user_id' && (
                <div key={key}>
                  <Label htmlFor={key}>{key.replace('_', ' ').toUpperCase()}</Label>
                  <Input
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={key.replace('_', ' ')}
                  />
                </div>
              )
            ))}
            <SubmitButton type="submit">Enregistrer</SubmitButton>
          </form>
        </FormContainer>
      </MainContent>
    </Container>
  );
}

export default EditEquipement;
