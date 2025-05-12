import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from './Menu';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFFFFF;  /* Fond blanc */
  color: #333333;  /* Texte sombre pour contraste */
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #1E90FF;  /* Teinte bleue moderne */
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  background: #F4F7FF;  /* Fond bleu clair */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(30, 144, 255, 0.3);  /* Ombre bleue claire */
  max-width: 600px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin: 0.8rem 0;
  border: 1px solid #1E90FF;  /* Bordure bleu moderne */
  border-radius: 8px;
  background: #F4F7FF;
  color: #333333;  /* Texte sombre */
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #1E90FF;  /* Bleu ciel moderne */
  color: #FFFFFF;  /* Texte blanc */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  
  &:hover {
    background-color: #4682B4;  /* Couleur bleue plus foncée au survol */
  }
`;

const EditLicence = () => {
  const { id } = useParams(); // Récupération de l'ID de la licence depuis l'URL
  const [licence, setLicence] = useState(null);
  const navigate = useNavigate(); // Remplacer useHistory par useNavigate

  useEffect(() => {
    // Récupérer la licence en fonction de l'ID (simulé ici)
    const fetchedLicence = {
      _id: id,
      nom: 'Licence Windows 10',
      type: 'Système d\'exploitation',
      cle: 'XYZ123ABC',
      date_expiration: '2025-12-31',
    };
    setLicence(fetchedLicence);
  }, [id]);

  const handleSave = (e) => {
    e.preventDefault();
    // Logique pour sauvegarder les modifications de la licence
    alert('Licence modifiée avec succès!');
    navigate('/licences'); // Retour à la liste des licences après modification
  };

  if (!licence) {
    return <p>Chargement...</p>;
  }

  return (
    <Container>
      <Menu />
      <Title>Modifier la Licence</Title>
      <Form onSubmit={handleSave}>
        <label>Nom :</label>
        <Input 
          type="text" 
          name="nom" 
          value={licence.nom} 
          onChange={(e) => setLicence({...licence, nom: e.target.value})} 
        />
        
        <label>Type :</label>
        <Input 
          type="text" 
          name="type" 
          value={licence.type} 
          onChange={(e) => setLicence({...licence, type: e.target.value})} 
        />

        <label>Clé :</label>
        <Input 
          type="text" 
          name="cle" 
          value={licence.cle} 
          onChange={(e) => setLicence({...licence, cle: e.target.value})} 
        />

        <label>Date d'expiration :</label>
        <Input 
          type="date" 
          name="date_expiration" 
          value={licence.date_expiration} 
          onChange={(e) => setLicence({...licence, date_expiration: e.target.value})} 
        />

        <SubmitButton type="submit">Sauvegarder</SubmitButton>
      </Form>
    </Container>
  );
};

export default EditLicence;
