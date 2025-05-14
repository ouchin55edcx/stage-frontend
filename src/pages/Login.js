import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { loginUser } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(email, password);
      
      // Store user info in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('email', response.user.email);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('fullName', response.user.full_name);
      
      // Redirect based on role
      navigate(response.role.toLowerCase() === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: '#e9edf3',
    },
    formContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f2f6fa',
    },
    infoPanel: {
      flex: 1,
      background: 'linear-gradient(160deg, #007BFF 0%, #004080 100%)',
      padding: '4rem',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '2rem',
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '3rem',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '480px',
    },
    roleSelector: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
    },
    roleButton: {
      flex: 1,
      padding: '0.8rem',
      border: '2px solid #cccccc',
      background: '#f9f9f9',
      color: '#333',
      fontSize: '1rem',
      fontWeight: '500',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: '0.3s',
    },
    activeRole: {
      borderColor: '#007BFF',
      background: '#007BFF',
      color: '#ffffff',
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#333',
      fontSize: '2rem',
      fontWeight: '600',
    },
    inputGroup: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '0.7rem 1rem',
      background: '#f0f2f5',
    },
    icon: {
      color: '#555',
      marginRight: '1rem',
      fontSize: '1.1rem',
      minWidth: '24px',
    },
    input: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: '0.3s',
    },
    error: {
      color: '#dc3545',
      background: '#f8d7da',
      padding: '1rem',
      borderRadius: '8px',
      margin: '1.5rem 0',
      textAlign: 'center',
      border: '1px solid #dc3545',
    },
    infoItem: {
      padding: '1.5rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
    },
    infoTitle: {
      fontSize: '2.5rem',
      marginBottom: '2rem',
      fontWeight: '700',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.card}>
          <div style={styles.roleSelector}>
            <button
              style={{ ...styles.roleButton, ...(selectedRole === 'admin' && styles.activeRole) }}
              onClick={() => setSelectedRole('admin')}
              type="button"
            >
              Admin
            </button>
            <button
              style={{ ...styles.roleButton, ...(selectedRole === 'employe' && styles.activeRole) }}
              onClick={() => setSelectedRole('employe')}
              type="button"
            >
              Employé
            </button>
          </div>

          <h2 style={styles.title}>
            {selectedRole === 'admin' ? 'CONNEXION ADMIN' : 'CONNEXION EMPLOYÉ'}
          </h2>

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
              <input
                type="email"
                placeholder="Email professionnel"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <FontAwesomeIcon icon={faLock} style={styles.icon} />
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                style={styles.icon}
                onClick={() => setPasswordVisible(!passwordVisible)}
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Connexion...' : 'SE CONNECTER'}
            </button>
          </form>
        </div>
      </div>

      <div style={styles.infoPanel}>
        <h2 style={styles.infoTitle}>PARC INFORMATIQUE SCE CHEMICALS</h2>

        <div style={styles.infoItem}>
          <h3>🔐 Infrastructure Sécurisée</h3>
          <p>Certification ISO 27001 - Audit de sécurité annuel</p>
        </div>

        <div style={styles.infoItem}>
          <h3>💻 1500+ Équipements</h3>
          <p>Serveurs haute disponibilité - Postes de travail dédiés</p>
        </div>

        <div style={styles.infoItem}>
          <h3>🌐 Réseau 10 Gbps</h3>
          <p>Fibre optique redondante - SLA 99.99%</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
