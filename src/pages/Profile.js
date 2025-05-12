import React, { useState, useEffect } from 'react';
import MenuEmploye from '../pages/MenuEmploye';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCheckCircle, faTimesCircle, faUser } from '@fortawesome/free-solid-svg-icons'; // Ajout de faUser

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

export default function Profile() {
  const [userData, setUserData] = useState({ email: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserData({ email: 'employe@examplecom' });
      } catch (error) {
        console.error('Erreur de récupération des données', error);
      }
    };
    fetchUserData();
  }, []);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!newEmail || !currentPassword) {
      setError('Tous les champs doivent être remplis');
      return;
    }
    setSuccess('Email modifié avec succès');
    setUserData({ ...userData, email: newEmail });
    setNewEmail('');
    setCurrentPassword('');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (!currentPassword || !newPassword) {
      setError('Tous les champs doivent être remplis');
      return;
    }
    setSuccess('Mot de passe modifié avec succès');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
  };

  return (
    <Container>
      <MenuEmploye />
      
      <MainContent>
        <ProfileHeader>
          <FontAwesomeIcon icon={faUser} />
          Mon Profil
        </ProfileHeader>

        <FormGrid>
          {/* Formulaire Email */}
          <FormSection>
            <SectionTitle>
              <FontAwesomeIcon icon={faEnvelope} />
              Informations de connexion
            </SectionTitle>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Email actuel : </strong>
              <span style={{ color: '#555' }}>{userData.email}</span>
            </div>

            <form onSubmit={handleEmailUpdate}>
              <InputGroup>
                <StyledInput
                  type="email"
                  placeholder="Nouvel email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <StyledInput
                  type="password"
                  placeholder="Mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </InputGroup>

              <ActionButton type="submit">
                <FontAwesomeIcon icon={faCheckCircle} />
                Mettre à jour l'email
              </ActionButton>
            </form>
          </FormSection>

          {/* Formulaire Mot de passe */}
          <FormSection>
            <SectionTitle>
              <FontAwesomeIcon icon={faLock} />
              Modifier le mot de passe
            </SectionTitle>

            <form onSubmit={handlePasswordUpdate}>
              <InputGroup>
                <StyledInput
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <StyledInput
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <StyledInput
                  type="password"
                  placeholder="Mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </InputGroup>

              <ActionButton type="submit">
                <FontAwesomeIcon icon={faCheckCircle} />
                Changer le mot de passe
              </ActionButton>
            </form>
          </FormSection>
        </FormGrid>

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
