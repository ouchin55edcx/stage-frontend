import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faServer, faHome,
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
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', // gradient background
      padding: '2rem',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
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
      marginBottom: '0.8rem',
      borderRadius: '10px',
      color: '#dbeafe',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      background: '#334155',
      fontWeight: '500',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        background: '#3b82f6',
        transform: 'translateX(5px)'
      }
    },
    activeMenuItem: {
      background: '#3b82f6',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    },
    subItem: {
      paddingLeft: '2.5rem',
      marginBottom: '0.7rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      color: '#93c5fd',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      '&:hover': {
        color: 'white',
        transform: 'translateX(5px)'
      }
    },
    icon: {
      width: '20px',
      textAlign: 'center',
      marginRight: '0.5rem'
    },
    notificationItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: '1rem',
      background: '#475569',
      borderRadius: '12px',
      marginBottom: '1rem',
      color: '#e0f2fe',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={{
        textAlign: 'center',
        marginBottom: '2.5rem',
        background: 'rgba(15, 23, 42, 0.5)',
        padding: '1.5rem 1rem',
        borderRadius: '16px',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 8px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          margin: '0 auto 1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)',
          border: '4px solid rgba(255, 255, 255, 0.1)'
        }}>
          <FontAwesomeIcon icon={faUsers} size="2x" />
        </div>
        <h3 style={{
          color: '#ffffff',
          fontWeight: '600',
          marginBottom: '0.5rem'
        }}>Admin SCE Chemicals</h3>
        <p style={{
          color: '#94a3b8',
          fontSize: '0.85rem',
          margin: 0
        }}>Gestion du parc informatique</p>
      </div>

      <nav>
        {/* Order: Accueil, Table de bord, Service, Utilisateur, Equipment, Interventions, Maintenance, Licences, Parametre, Deconnexion */}
        <Link to="/home" style={{...styles.menuItem, marginBottom: '1rem'}}>
          <span style={styles.icon}><FontAwesomeIcon icon={faHome} /></span>Accueil
        </Link>

        <Link to="/admin/dashboard" style={{...styles.menuItem, marginBottom: '1rem'}}>
          <span style={styles.icon}><FontAwesomeIcon icon={faChartPie} /></span>Tableau de bord
        </Link>

        <div onClick={() => toggleSection('services')} style={styles.menuItem}>
          <span style={styles.icon}><FontAwesomeIcon icon={faServer} /></span>Services
        </div>
        {openSections.services && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '8px',
            padding: '0.8rem 0.5rem',
            marginBottom: '0.8rem',
            marginTop: '0.3rem',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            <Link to="/admin/services" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faServer} size="sm" /></span>
              Ajouter service
            </Link>
            <Link to="/admin/services/list" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faList} size="sm" /></span>
              Liste des services
            </Link>
          </div>
        )}

        <div onClick={() => toggleSection('utilisateurs')} style={styles.menuItem}>
          <span style={styles.icon}><FontAwesomeIcon icon={faUsers} /></span>Utilisateurs
        </div>
        {openSections.utilisateurs && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '8px',
            padding: '0.8rem 0.5rem',
            marginBottom: '0.8rem',
            marginTop: '0.3rem',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            <Link to="/admin/users" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faUsers} size="sm" /></span>
              Ajouter utilisateur
            </Link>
            <Link to="/admin/users/list" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faList} size="sm" /></span>
              Liste des utilisateurs
            </Link>
          </div>
        )}

        <div onClick={() => toggleSection('equipements')} style={styles.menuItem}>
          <span style={styles.icon}><FontAwesomeIcon icon={faBoxes} /></span>Équipements
        </div>
        {openSections.equipements && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '8px',
            padding: '0.8rem 0.5rem',
            marginBottom: '0.8rem',
            marginTop: '0.3rem',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            <Link to="/admin/equipements" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faBoxes} size="sm" /></span>
              Ajouter équipement
            </Link>
            <Link to="/admin/equipements/list" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faList} size="sm" /></span>
              Liste des équipements
            </Link>
          </div>
        )}

        <div onClick={() => toggleSection('interventions')} style={styles.menuItem}>
          <span style={styles.icon}><FontAwesomeIcon icon={faCalendarAlt} /></span>Interventions
        </div>
        {openSections.interventions && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '8px',
            padding: '0.8rem 0.5rem',
            marginBottom: '0.8rem',
            marginTop: '0.3rem',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            <Link to="/admin/interventions" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faCalendarAlt} size="sm" /></span>
              Ajouter intervention
            </Link>
            <Link to="/admin/interventions/list" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faList} size="sm" /></span>
              Liste des interventions
            </Link>
          </div>
        )}

        <div onClick={() => toggleSection('maintenance')} style={styles.menuItem}>
          <span style={styles.icon}><FontAwesomeIcon icon={faWrench} /></span>Maintenance
        </div>
        {openSections.maintenance && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '8px',
            padding: '0.8rem 0.5rem',
            marginBottom: '0.8rem',
            marginTop: '0.3rem',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            <Link to="/admin/maintenance" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faWrench} size="sm" /></span>
              Ajouter maintenance
            </Link>
            <Link to="/admin/maintenance/list" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faList} size="sm" /></span>
              Liste des maintenances
            </Link>
          </div>
        )}

        <div onClick={() => toggleSection('licences')} style={styles.menuItem}>
          <span style={styles.icon}><FontAwesomeIcon icon={faKey} /></span>Licences
        </div>
        {openSections.licences && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '8px',
            padding: '0.8rem 0.5rem',
            marginBottom: '0.8rem',
            marginTop: '0.3rem',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            <Link to="/admin/licences" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faKey} size="sm" /></span>
              Ajouter licence
            </Link>
            <Link to="/admin/licences/list" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faList} size="sm" /></span>
              Liste des licences
            </Link>
            <Link to="/admin/licences/management" style={styles.subItem}>
              <span style={{...styles.icon, width: '16px'}}><FontAwesomeIcon icon={faKey} size="sm" /></span>
              Gestion des licences
            </Link>
          </div>
        )}

        <Link to="/admin/settings" style={styles.menuItem}>
          <span style={styles.icon}><FontAwesomeIcon icon={faCog} /></span>Paramètres
        </Link>

        <Link to="/logout" style={{...styles.menuItem, marginTop: '1.5rem', background: '#dc2626', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'}}>
          <span style={styles.icon}><FontAwesomeIcon icon={faSignOutAlt} /></span>Déconnexion
        </Link>
      </nav>

      {notifications.length > 0 && (
        <div style={{
          marginTop: '2rem',
          borderTop: '1px solid #334155',
          paddingTop: '1.5rem'
        }}>
          <h4 style={{
            color: '#94a3b8',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '600'
          }}>Notifications récentes</h4>

          {notifications.map((notif, index) => (
            <div key={index} style={styles.notificationItem}>
              <strong style={{ color: '#f8fafc' }}>{notif.title}</strong>
              <span style={{ fontSize: '0.85rem' }}>{notif.message}</span>
              <div style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                {notif.time || 'À l\'instant'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
