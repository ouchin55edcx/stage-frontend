// src/pages/Licences.js
import React, { useState } from 'react';
import Menu from './Menu';

const Licences = () => {
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    cle: '',
    date_expiration: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/api/licences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        alert('Licence ajoutée avec succès !');
        setFormData({
          nom: '',
          type: '',
          cle: '',
          date_expiration: ''
        });
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors de l'ajout !");
      });
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
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>Nom :</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
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
            name="cle"
            value={formData.cle}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Date d'expiration :</label>
          <input
            type="date"
            name="date_expiration"
            value={formData.date_expiration}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>Ajouter</button>
        </form>
      </div>
    </div>
  );
};

export default Licences;
