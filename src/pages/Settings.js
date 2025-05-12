import React, { useState } from 'react';
import Menu from './Menu'; // Assurez-vous que le chemin est correct

const Settings = () => {
  const [username, setUsername] = useState('Admin SCE Chemicals');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // Ici, tu peux ajouter la logique pour changer le mot de passe via l'API
    alert('Mot de passe modifié avec succès');
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#FFFFFF', minHeight: '100vh' }}> {/* Contexte avec fond blanc ici */}
      <Menu />

      <div
        style={{
          padding: '2rem',
          maxWidth: '900px',
          margin: 'auto',
          background: '#F0F8FF', // Fond bleu clair moderne
          borderRadius: '10px',
          flex: 1,
          color: '#1A73E8', // Texte bleu moderne
        }}
      >
        <h2 style={{ color: '#1A73E8', marginBottom: '1rem' }}>Paramètres</h2>

        {/* Section Profil */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#1A73E8', marginBottom: '1rem' }}>Profil</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#1A73E8' }}>Nom</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #1A73E8', // Bordure bleue moderne
                background: '#E6F7FF', // Fond bleu clair
                color: '#1A73E8', // Texte bleu moderne
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#1A73E8' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #1A73E8', // Bordure bleue moderne
                background: '#E6F7FF', // Fond bleu clair
                color: '#1A73E8', // Texte bleu moderne
              }}
            />
          </div>
        </div>

        {/* Section Mot de Passe */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#1A73E8', marginBottom: '1rem' }}>Modifier le mot de passe</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#1A73E8' }}>Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #1A73E8', // Bordure bleue moderne
                background: '#E6F7FF', // Fond bleu clair
                color: '#1A73E8', // Texte bleu moderne
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#1A73E8' }}>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #1A73E8', // Bordure bleue moderne
                background: '#E6F7FF', // Fond bleu clair
                color: '#1A73E8', // Texte bleu moderne
              }}
            />
          </div>
          <button
            onClick={handlePasswordChange}
            style={{
              padding: '0.7rem 1.5rem',
              background: '#1A73E8', // Bouton bleu moderne
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem',
              display: 'block',
              width: '100%',
            }}
          >
            Sauvegarder le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
