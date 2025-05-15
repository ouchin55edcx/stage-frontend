// src/pages/Licences.js
import React, { useState } from 'react';
import Menu from './Menu';
import { createLicense } from '../services/license';
import { useNavigate } from 'react-router-dom';

const Licences = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    key: '',
    expiration_date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createLicense(formData);
      alert('Licence ajoutée avec succès !');
      setFormData({
        name: '',
        type: '',
        key: '',
        expiration_date: ''
      });
      // Redirect to licenses list
      navigate('/admin/licences/list');
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors de l'ajout de la licence");
      alert("Erreur lors de l'ajout : " + (err.message || "Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    pageContainer: {
      display: 'flex',
      backgroundColor: '#FFFFFF',  // Fond blanc
      minHeight: '100vh'
    },
    content: {
      marginLeft: '270px',
      padding: '2rem',
      width: '100%',
      backgroundColor: '#FFFFFF', // Fond blanc pour le contenu
      color: '#333333', // Texte sombre pour le contraste
      minHeight: '100vh'
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      color: '#1E90FF' // Teinte bleue moderne
    },
    form: {
      backgroundColor: '#F4F7FF',  // Fond bleu clair pour le formulaire
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 0 12px rgba(30, 144, 255, 0.3)', // Ombre bleu clair
      maxWidth: '600px'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
      color: '#333333'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #1E90FF',  // Bordure bleue
      backgroundColor: '#E6F0FF',  // Fond bleu clair pour l'entrée
      color: '#333333', // Texte sombre pour les champs
      outline: 'none'
    },
    button: {
      backgroundColor: '#1E90FF',  // Bouton bleu
      color: '#FFFFFF',
      padding: '0.75rem 2rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      ':hover': {
        backgroundColor: '#4682B4'  // Teinte de bleu plus foncée au survol
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Menu />
      <div style={styles.content}>
        <h2 style={styles.title}>Ajouter une licence</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>Nom :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Type :</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Clé :</label>
          <input
            type="text"
            name="key"
            value={formData.key}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Date d'expiration :</label>
          <input
            type="date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Licences;
