import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faServer, faBell, faHome,
  faChartPie, faCog, faSignOutAlt, faBoxes, faCalendarAlt, faList, faKey, faWrench
} from '@fortawesome/free-solid-svg-icons';

const Menu = ({ notifications = [] }) => {
  const [openSections, setOpenSections] = useState({
    utilisateurs: false,
    equipements: false,
    interventions: false,
    services: false,
    licences: false,
    maintenance: false
  });

  const toggleSection = (section) => {
    setOpenSections({ ...openSections, [section]: !openSections[section] });
  };

  const styles = {
    sidebar: {
      width: '250px',
      background: '#1e293b', // bleu foncé/gris
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
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#3b82f6',
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <FontAwesomeIcon icon={faUsers} size="2x" />
        </div>
        <h3 style={{ color: '#ffffff' }}>Admin SCE Chemicals</h3>
      </div>

      <nav>
        <Link to="/" style={styles.menuItem}><FontAwesomeIcon icon={faHome} />Accueil</Link>
        <Link to="/admin/dashboard" style={styles.menuItem}><FontAwesomeIcon icon={faChartPie} />Tableau de bord</Link>

        <div onClick={() => toggleSection('utilisateurs')} style={styles.menuItem}>
          <FontAwesomeIcon icon={faUsers} /> Utilisateurs
        </div>
        {openSections.utilisateurs && (
          <>
            <Link to="/admin/users" style={styles.subItem}><FontAwesomeIcon icon={faUsers} />Ajouter utilisateur</Link>
            <Link to="/admin/users/list" style={styles.subItem}><FontAwesomeIcon icon={faList} />Liste des utilisateurs</Link>
          </>
        )}

        <div onClick={() => toggleSection('equipements')} style={styles.menuItem}>
          <FontAwesomeIcon icon={faBoxes} /> Équipements
        </div>
        {openSections.equipements && (
          <>
            <Link to="/admin/equipements" style={styles.subItem}><FontAwesomeIcon icon={faBoxes} />Ajouter équipement</Link>
            <Link to="/admin/equipements/list" style={styles.subItem}><FontAwesomeIcon icon={faList} />Liste des équipements</Link>
          </>
        )}

        <div onClick={() => toggleSection('interventions')} style={styles.menuItem}>
          <FontAwesomeIcon icon={faCalendarAlt} /> Interventions
        </div>
        {openSections.interventions && (
          <>
            <Link to="/admin/interventions" style={styles.subItem}><FontAwesomeIcon icon={faCalendarAlt} />Ajouter intervention</Link>
            <Link to="/admin/interventions/list" style={styles.subItem}><FontAwesomeIcon icon={faList} />Liste des interventions</Link>
          </>
        )}

        <div onClick={() => toggleSection('services')} style={styles.menuItem}>
          <FontAwesomeIcon icon={faServer} /> Services
        </div>
        {openSections.services && (
          <>
            <Link to="/admin/services" style={styles.subItem}><FontAwesomeIcon icon={faServer} />Ajouter service</Link>
            <Link to="/admin/services/list" style={styles.subItem}><FontAwesomeIcon icon={faList} />Liste des services</Link>
          </>
        )}

        <div onClick={() => toggleSection('licences')} style={styles.menuItem}>
          <FontAwesomeIcon icon={faKey} /> Licences
        </div>
        {openSections.licences && (
          <>
            <Link to="/admin/licences" style={styles.subItem}><FontAwesomeIcon icon={faKey} />Ajouter licence</Link>
            <Link to="/admin/licences/list" style={styles.subItem}><FontAwesomeIcon icon={faList} />Liste des licences</Link>
          </>
        )}

        <div onClick={() => toggleSection('maintenance')} style={styles.menuItem}>
          <FontAwesomeIcon icon={faWrench} /> Maintenance
        </div>
        {openSections.maintenance && (
          <>
            <Link to="/admin/maintenance" style={styles.subItem}><FontAwesomeIcon icon={faWrench} />Ajouter maintenance</Link>
            <Link to="/admin/maintenance/list" style={styles.subItem}><FontAwesomeIcon icon={faList} />Liste des maintenances</Link>
          </>
        )}

        <Link to="/notifications" style={styles.menuItem}><FontAwesomeIcon icon={faBell} />Notifications</Link>
        <Link to="/admin/settings" style={styles.menuItem}><FontAwesomeIcon icon={faCog} />Paramètres</Link>
        <Link to="/logout" style={styles.menuItem}><FontAwesomeIcon icon={faSignOutAlt} />Déconnexion</Link>
      </nav>

      <div style={{ marginTop: '2rem', borderTop: '1px solid #334155', paddingTop: '2rem' }}>
        {notifications.map((notif, index) => (
          <div key={index} style={styles.notificationItem}>
            <strong>{notif.title}</strong>
            <span>{notif.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
