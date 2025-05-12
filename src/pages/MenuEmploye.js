import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt, faExclamationTriangle, faUser, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const MenuEmploye = ({ user = { name: "Employé SCE" }, notifications = [] }) => {
  // eslint-disable-next-line no-empty-pattern
  const [] = useState({
    declarations: false
  });


  const styles = {
    sidebar: {
      width: '250px',
      background: '#1e293b',
      padding: '2rem',
      boxShadow: '0 8px 24px rgba(0, 123, 255, 0.3)',
      position: 'fixed',
      top: '0',
      left: '0',
      bottom: '0',
      height: '100vh',
      overflowY: 'auto',
      borderRadius: '0 20px 20px 0',
      zIndex: '1000',
      boxSizing: 'border-box'
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '10px',
      color: '#dbeafe',
      textDecoration: 'none',
      transition: '0.3s',
      cursor: 'pointer',
      background: '#334155'
    },
    subItem: {
      paddingLeft: '2.5rem',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      color: '#93c5fd',
      textDecoration: 'none',
      fontSize: '0.9rem'
    },
    profile: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: '#3b82f6',
      margin: '0 auto 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    notificationItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: '1rem',
      background: '#475569',
      borderRadius: '12px',
      marginBottom: '1rem',
      color: '#e0f2fe'
    }
  };

  return (
    <div style={styles.sidebar}>
      {/* Profil Employé */}
      <div style={styles.profile}>
        <div style={styles.avatar}>
          <FontAwesomeIcon icon={faUser} size="2x" />
        </div>
        <h3 style={{ color: '#ffffff' }}>{user.name}</h3>
      </div>

      <nav>
        <Link to="/employee/dashboard" style={styles.menuItem}>
          <FontAwesomeIcon icon={faTachometerAlt} />
          Tableau de bord
        </Link>

        <Link to="/employee/declaration" style={styles.menuItem}>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          Déclarations
        </Link>

        <Link to="/employee/profile" style={styles.menuItem}>
          <FontAwesomeIcon icon={faUser} />
          Profil
        </Link>

        <Link to="/logout" style={styles.menuItem}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          Déconnexion
        </Link>
      </nav>

      {/* Section Notifications */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid #334155', paddingTop: '2rem' }}>
        {notifications.slice(0, 3).map((notif, index) => (
          <div key={index} style={styles.notificationItem}>
            <strong>{notif.title}</strong>
            <span>{notif.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuEmploye;
