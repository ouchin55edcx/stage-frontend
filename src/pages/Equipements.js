import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Menu from './Menu'; // Utiliser './Menu' car les deux fichiers sont dans le même dossier

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

  &:hover {
    transform: translateY(-2px);
  }
`;

function Equipements() {
  const [equipements, setEquipements] = useState([]);
  const [users, setUsers] = useState([]);  // Nouvelle state pour stocker les utilisateurs
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    etat: 'actif',  // Valeur initiale pour "actif"
    numero_serie: '',
    marque: '',
    libelle: '',
    ecran: '',
    nce: '',
    adresse_ip: '',
    processeur: '',
    office: '',
    sauvegarde: '',
    user_id: '',  // Champ pour l'utilisateur
  });

  useEffect(() => {
    axios.get('/equipements')
      .then((response) => setEquipements(response.data))
      .catch((error) => console.error('Erreur lors de la récupération des équipements:', error));

    // Récupérer les utilisateurs pour le champ de sélection
    axios.get('/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Erreur lors de la récupération des utilisateurs:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/equipements', formData)
      .then(() => {
        alert("Équipement ajouté !");
        setEquipements([...equipements, formData]);
        setFormData({
          nom: '',
          type: '',
          etat: 'actif', // Réinitialiser l'état à "actif"
          numero_serie: '',
          marque: '',
          libelle: '',
          ecran: '',
          nce: '',
          adresse_ip: '',
          processeur: '',
          office: '',
          sauvegarde: '',
          user_id: '', // Réinitialiser l'ID utilisateur
        });
      })
      .catch((error) => console.error('Erreur lors de l\'ajout de l\'équipement:', error));
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
                  <Input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Type</Label>
                  <Input type="text" name="type" value={formData.type} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>État</Label>
                  <select 
                    name="etat" 
                    value={formData.etat} 
                    onChange={handleChange} 
                    required 
                    style={{ 
                      width: '100%', 
                      padding: '0.8rem', 
                      background: '#f7f7f7', 
                      color: '#333333', 
                      border: '1px solid #cccccc', 
                      borderRadius: '8px' 
                    }}>
                    <option value="actif">Actif</option>
                    <option value="en_cours">En cours de traitement</option>
                    <option value="en_panne">En panne</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Label>Numéro de Série</Label>
                  <Input type="text" name="numero_serie" value={formData.numero_serie} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Marque</Label>
                  <Input type="text" name="marque" value={formData.marque} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Libellé</Label>
                  <Input type="text" name="libelle" value={formData.libelle} onChange={handleChange} required />
                </FormGroup>
              </div>

              {/* Colonne de droite */}
              <div>
                <FormGroup>
                  <Label>Écran</Label>
                  <Input type="text" name="ecran" value={formData.ecran} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>NCE</Label>
                  <Input type="text" name="nce" value={formData.nce} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Adresse IP</Label>
                  <Input type="text" name="adresse_ip" value={formData.adresse_ip} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Processeur</Label>
                  <Input type="text" name="processeur" value={formData.processeur} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Office</Label>
                  <Input type="text" name="office" value={formData.office} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Sauvegarde</Label>
                  <Input type="text" name="sauvegarde" value={formData.sauvegarde} onChange={handleChange} required />
                </FormGroup>

                {/* Sélection de l'utilisateur */}
                <FormGroup>
                  <Label>Utilisateur</Label>
                  <select 
                    name="user_id" 
                    value={formData.user_id} 
                    onChange={handleChange} 
                    required 
                    style={{ 
                      width: '100%', 
                      padding: '0.8rem', 
                      background: '#f7f7f7', 
                      color: '#333333', 
                      border: '1px solid #cccccc', 
                      borderRadius: '8px' 
                    }}>
                    <option value="">Sélectionner un utilisateur</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nom} ({user.role})
                      </option>
                    ))}
                  </select>
                </FormGroup>
              </div>
            </FormGrid>

            {/* Bouton d'ajout */}
            <Button type="submit">Ajouter l'équipement</Button>
          </form>
        </EquipementForm>
      </MainContent>
    </Container>
  );
}

export default Equipements;
