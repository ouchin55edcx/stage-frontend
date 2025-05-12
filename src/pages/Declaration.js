import React, { useState } from 'react';
import MenuEmploye from '../pages/MenuEmploye';

export default function Declaration() {
  const [formData, setFormData] = useState({ titre: '', description: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/declaration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage('✅ Déclaration envoyée avec succès !');
        setFormData({ titre: '', description: '' });
      } else {
        setMessage('❌ Erreur lors de l’envoi.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur réseau.');
    }
  };

  const styles = {
    layout: {
      display: 'flex',
      backgroundColor: '#f0f4f8', // Fond blanc clair
      height: '100vh', // Pour s'assurer que l'arrière-plan couvre toute la hauteur de la page
    },
    content: {
      marginLeft: '250px',
      padding: '3rem',
      color: '#333', // Couleur de texte sombre
      width: '100%'
    },
    formCard: {
      background: '#ffffff', // Fond blanc pour la carte
      padding: '2rem',
      borderRadius: '16px',
      maxWidth: '600px',
      boxShadow: '0 8px 24px rgba(100, 149, 237, 0.2)', // Ombre légère en bleu clair
      marginTop: '2rem',
      border: '1px solid #e0e0e0' // Bordure grise claire
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      marginTop: '0.5rem',
      marginBottom: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #ccc', // Bordure grise pour les champs
      backgroundColor: '#f9f9f9', // Fond gris très clair
      color: '#333',
      fontSize: '1rem'
    },
    label: {
      fontWeight: '600',
      display: 'block',
      color: '#555', // Couleur de texte plus claire
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#4c8bf5', // Bleu moderne pour le bouton
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: '0.3s',
      width: '100%', // Bouton prenant toute la largeur
    },
    buttonHover: {
      backgroundColor: '#3a74e2' // Bleu plus foncé au survol
    },
    message: {
      marginTop: '1rem',
      fontWeight: 'bold',
      color: '#4c8bf5', // Texte bleu pour le message de succès ou erreur
    }
  };

  return (
    <div style={styles.layout}>
      <MenuEmploye />
      <div style={styles.content}>
        <h1 style={{ fontSize: '2rem', color: '#4c8bf5' }}>Déclarer une panne</h1>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Titre de la panne :</label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Ex: Imprimante en panne"
              required
              style={styles.input}
            />

            <label style={styles.label}>Description :</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez le problème en détail..."
              required
              rows="5"
              style={{ ...styles.input, resize: 'vertical' }}
            />

            <button type="submit" style={styles.button}>
              Envoyer la déclaration
            </button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
