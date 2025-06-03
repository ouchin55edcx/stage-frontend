import React, { useState, useEffect } from 'react';
import MenuEmploye from '../pages/MenuEmploye';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCheckCircle, faTimesCircle, faUser, faIdCard, faPhone, faVial, faBuilding, faUserTag, faCog } from '@fortawesome/free-solid-svg-icons';
import { getUserInfo, updateProfile, testApiConnection, testProfileEndpoint } from '../services/api';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  max-width: 1200px;
`;

const ProfileHeader = styled.h1`
  font-size: 2rem;
  color: #2196f3;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #2196f3;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FormSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2196f3;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;

  &:focus {
    border-color: #2196f3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    outline: none;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #1976d2;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AlertMessage = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;

  &.error {
    background: #fee;
    color: #d32f2f;
    border: 1px solid #ffcdd2;
  }

  &.success {
    background: #effae6;
    color: #388e3c;
    border: 1px solid #c8e6c9;
  }
`;

const InfoDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #555;
  min-width: 120px;
`;

const InfoValue = styled.span`
  color: #333;
  flex: 1;
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;

  &.active {
    background: #e8f5e8;
    color: #2e7d32;
  }

  &.inactive {
    background: #ffebee;
    color: #c62828;
  }
`;

const RoleBadge = styled.span`
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: #e3f2fd;
  color: #1565c0;
`;

export default function Profile() {
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    full_name: '',
    role: '',
    profile: {
      poste: '',
      phone: '',
      service_id: '',
      service_name: '',
      is_active: true
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // First test API connection
        console.log('Testing API connection from Profile page...');
        const connectionTest = await testApiConnection();
        console.log('API connection test result:', connectionTest);

        if (!connectionTest.success) {
          setError(`Impossible de se connecter à l'API: ${connectionTest.message}`);
          setLoading(false);
          return;
        }

        const response = await getUserInfo();
        if (response && response.user) {
          setUserData({
            id: response.user.id || '',
            email: response.user.email || '',
            full_name: response.user.full_name || '',
            role: response.user.role || '',
            profile: {
              poste: response.user.profile?.poste || '',
              phone: response.user.profile?.phone || '',
              service_id: response.user.profile?.service_id || '',
              service_name: response.user.profile?.service_name || '',
              is_active: response.user.profile?.is_active !== undefined ? response.user.profile.is_active : true
            }
          });
        }
      } catch (error) {
        console.error('Erreur de récupération des données', error);
        setError('Impossible de récupérer les informations utilisateur');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      console.log('Profile form submitted, starting update...');

      // Prepare profile data
      const profileData = {
        full_name: userData.full_name,
        email: userData.email
      };

      // Add employer-specific fields if user is an employer
      if (userData.role.toLowerCase() === 'employer') {
        profileData.poste = userData.profile.poste;
        profileData.phone = userData.profile.phone;
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
    <Container>
      <MenuEmploye />

      <MainContent>
        <ProfileHeader>
          <FontAwesomeIcon icon={faUser} />
          Mon Profil
        </ProfileHeader>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Chargement des informations utilisateur...</p>
          </div>
        ) : (
          <FormGrid>
            {/* Formulaire de Profil */}
            <FormSection>
              <SectionTitle>
                <FontAwesomeIcon icon={faUser} />
                Informations de Profil
              </SectionTitle>

              <form onSubmit={(e) => {
                console.log('Profile form submitted');
                handleProfileUpdate(e);
              }}>
                <InputGroup>
                  <label>Nom Complet</label>
                  <StyledInput
                    type="text"
                    placeholder="Votre nom complet"
                    value={userData.full_name}
                    onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                  />
                </InputGroup>

                <InputGroup>
                  <label>Email</label>
                  <StyledInput
                    type="email"
                    placeholder="Votre email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                  />
                </InputGroup>

                {/* Only show these fields for employers */}
                {userData.role && userData.role.toLowerCase() === 'employer' && (
                  <>
                    <InputGroup>
                      <label>
                        <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '0.5rem' }} />
                        Poste
                      </label>
                      <StyledInput
                        type="text"
                        placeholder="Votre poste"
                        value={userData.profile.poste || ''}
                        onChange={(e) => setUserData({
                          ...userData,
                          profile: {...userData.profile, poste: e.target.value}
                        })}
                      />
                    </InputGroup>

                    <InputGroup>
                      <label>
                        <FontAwesomeIcon icon={faPhone} style={{ marginRight: '0.5rem' }} />
                        Téléphone
                      </label>
                      <StyledInput
                        type="text"
                        placeholder="Votre numéro de téléphone"
                        value={userData.profile.phone || ''}
                        onChange={(e) => setUserData({
                          ...userData,
                          profile: {...userData.profile, phone: e.target.value}
                        })}
                      />
                    </InputGroup>
                  </>
                )}

                <ActionButton type="submit" disabled={updating}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  {updating ? 'Mise à jour en cours...' : 'Mettre à jour le profil'}
                </ActionButton>
              </form>
            </FormSection>
          </FormGrid>
        )}

        {/* Messages de feedback */}
        {error && (
          <AlertMessage className="error">
            <FontAwesomeIcon icon={faTimesCircle} />
            {error}
          </AlertMessage>
        )}

        {success && (
          <AlertMessage className="success">
            <FontAwesomeIcon icon={faCheckCircle} />
            {success}
          </AlertMessage>
        )}
      </MainContent>
    </Container>
  );
}
