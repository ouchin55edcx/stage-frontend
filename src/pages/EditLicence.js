import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import { getLicenseById, updateLicense } from '../services/license';

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
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLicense = async () => {
      try {
        setLoading(true);
        const data = await getLicenseById(id);
        setLicense(data);
      } catch (err) {
        console.error('Error fetching license:', err);
        setError('Erreur lors du chargement de la licence: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLicense();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateLicense(id, license);
      alert('Licence modifiée avec succès!');
      navigate('/admin/licences/list'); // Retour à la liste des licences après modification
    } catch (err) {
      console.error('Error updating license:', err);
      setError('Erreur lors de la mise à jour: ' + err.message);
      alert('Erreur lors de la mise à jour: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Menu />
        <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement de la licence...</div>
      </Container>
    );
  }

  if (error && !license) {
    return (
      <Container>
        <Menu />
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>
      </Container>
    );
  }

  if (!license) {
    return (
      <Container>
        <Menu />
        <div style={{ textAlign: 'center', padding: '2rem' }}>Licence non trouvée</div>
      </Container>
    );
  }

  return (
    <Container>
      <Menu />
      <Title>Modifier la Licence</Title>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <Form onSubmit={handleSave}>
        <label>Nom :</label>
        <Input
          type="text"
          name="name"
          value={license.name}
          onChange={(e) => setLicense({...license, name: e.target.value})}
        />

        <label>Type :</label>
        <Input
          type="text"
          name="type"
          value={license.type}
          onChange={(e) => setLicense({...license, type: e.target.value})}
        />

        <label>Clé :</label>
        <Input
          type="text"
          name="key"
          value={license.key}
          onChange={(e) => setLicense({...license, key: e.target.value})}
        />

        <label>Date d'expiration :</label>
        <Input
          type="date"
          name="expiration_date"
          value={license.expiration_date}
          onChange={(e) => setLicense({...license, expiration_date: e.target.value})}
        />

        <SubmitButton
          type="submit"
          disabled={saving}
        >
          {saving ? 'Enregistrement...' : 'Sauvegarder'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default EditLicence;
