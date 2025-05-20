import React, { useState, useEffect } from 'react';
import Menu from './Menu'; // Assurez-vous que le chemin est correct
import { getUserInfo, updateProfile, testApiConnection, testProfileEndpoint } from '../services/api';

const Settings = () => {
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    role: '',
    poste: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // First test API connection
        console.log('Testing API connection...');
        const connectionTest = await testApiConnection();
        console.log('API connection test result:', connectionTest);

        if (!connectionTest.success) {
          setError(`Impossible de se connecter à l'API: ${connectionTest.message}`);
          setLoading(false);
          return;
        }

        // Test profile endpoint specifically
        console.log('Testing profile endpoint...');
        const profileTest = await testProfileEndpoint();
        console.log('Profile endpoint test result:', profileTest);

        if (!profileTest.success) {
          setError(`Le point d'accès du profil n'est pas disponible: ${profileTest.message}`);
          setLoading(false);
          return;
        }

        const response = await getUserInfo();
        if (response && response.user) {
          setUserData({
            full_name: response.user.full_name,
            email: response.user.email,
            role: response.user.role,
            poste: response.user.poste || '',
            phone: response.user.phone || ''
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

  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      console.log('Starting profile update...');

      // Prepare profile data based on user role
      const profileData = {
        full_name: userData.full_name,
        email: userData.email
      };

      // Add employer-specific fields if user is an employer
      if (userData.role.toLowerCase() === 'employer') {
        profileData.poste = userData.poste;
        profileData.phone = userData.phone;
      }

      console.log('Sending profile data:', profileData);

      const response = await updateProfile(profileData);
      console.log('Profile update response:', response);

      setSuccess('Profil mis à jour avec succès');

      // Update local user data with response if needed
      if (response && response.user) {
        setUserData({
          ...userData,
          ...response.user
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        stack: err.stack
      });
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setUpdating(false);
    }
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

              {/* Success message */}
              {success && (
                <div style={{
                  background: '#E6F7E6',
                  color: '#2E7D32',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: '1px solid #A5D6A7'
                }}>
                  {success}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div style={{
                  background: '#FFEBEE',
                  color: '#C62828',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: '1px solid #FFCDD2'
                }}>
                  {error}
                </div>
              )}

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

              {/* Only show these fields for employers */}
              {userData.role && userData.role.toLowerCase() === 'employer' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ color: '#1A73E8' }}>Poste</label>
                    <input
                      type="text"
                      value={userData.poste || ''}
                      onChange={(e) => setUserData({...userData, poste: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        marginTop: '0.5rem',
                        border: '1px solid #1A73E8',
                        background: '#E6F7FF',
                        color: '#1A73E8',
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ color: '#1A73E8' }}>Téléphone</label>
                    <input
                      type="text"
                      value={userData.phone || ''}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        marginTop: '0.5rem',
                        border: '1px solid #1A73E8',
                        background: '#E6F7FF',
                        color: '#1A73E8',
                      }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button" // Explicitly set type to button
                  onClick={() => {
                    console.log('Save button clicked');
                    handleProfileUpdate();
                  }}
                  disabled={updating}
                  style={{
                    padding: '0.7rem 1.5rem',
                    background: updating ? '#90CAF9' : '#1A73E8',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: updating ? 'default' : 'pointer',
                    marginTop: '1rem',
                    flex: '1',
                  }}
                >
                  {updating ? 'Mise à jour en cours...' : 'Sauvegarder les modifications'}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    console.log('Test profile endpoint button clicked');
                    try {
                      setUpdating(true);
                      setError('');
                      setSuccess('');

                      const profileTest = await testProfileEndpoint();
                      console.log('Profile endpoint test result:', profileTest);

                      if (profileTest.success) {
                        setSuccess(`Test réussi: ${profileTest.message}. Méthodes autorisées: ${profileTest.allowedMethods || 'Non spécifié'}`);
                      } else {
                        setError(`Test échoué: ${profileTest.message}`);
                      }
                    } catch (err) {
                      console.error('Error testing profile endpoint:', err);
                      setError(`Erreur lors du test: ${err.message}`);
                    } finally {
                      setUpdating(false);
                    }
                  }}
                  disabled={updating}
                  style={{
                    padding: '0.7rem 1.5rem',
                    background: updating ? '#90CAF9' : '#4CAF50',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: updating ? 'default' : 'pointer',
                    marginTop: '1rem',
                  }}
                >
                  Tester l'API
                </button>
              </div>
            </div>
          </>
        )}


      </div>
    </div>
  );
};

export default Settings;
