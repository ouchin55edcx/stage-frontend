import React, { useState, useEffect } from 'react';
import Menu from './Menu'; // Assurez-vous que le chemin est correct
import { getUserInfo } from '../services/api';

const Settings = () => {
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getUserInfo();
        if (response && response.user) {
          setUserData({
            full_name: response.user.full_name,
            email: response.user.email,
            role: response.user.role
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Impossible de récupérer les informations utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Chargement des informations utilisateur...</p>
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center',
            padding: '1rem',
            background: '#FFF0F0',
            color: '#D32F2F',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Section Informations Utilisateur */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#1A73E8', marginBottom: '1rem' }}>Informations Utilisateur</h3>
              <div style={{
                background: '#E6F7FF',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #1A73E8',
                marginBottom: '1.5rem'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>Nom Complet:</p>
                  <p>{userData.full_name}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>Email:</p>
                  <p>{userData.email}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>Rôle:</p>
                  <p>{userData.role}</p>
                </div>
              </div>
            </div>

            {/* Section Profil */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#1A73E8', marginBottom: '1rem' }}>Modifier Profil</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#1A73E8' }}>Nom</label>
                <input
                  type="text"
                  value={userData.full_name}
                  onChange={(e) => setUserData({...userData, full_name: e.target.value})}
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
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
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
                style={{
                  padding: '0.7rem 1.5rem',
                  background: '#1A73E8',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '1rem',
                  display: 'block',
                  width: '100%',
                }}
              >
                Sauvegarder les modifications
              </button>
            </div>
          </>
        )}

        {/* Section Mot de Passe - Only show when user data is loaded */}
        {!loading && !error && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#1A73E8', marginBottom: '1rem' }}>Modifier le mot de passe</h3>
            <div style={{
              background: '#E6F7FF',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #1A73E8'
            }}>
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
                    background: '#FFFFFF', // Fond blanc pour contraste
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
                    background: '#FFFFFF', // Fond blanc pour contraste
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
        )}
      </div>
    </div>
  );
};

export default Settings;
