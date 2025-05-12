import React from 'react';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faShieldAlt,
  faDatabase,
  faBell,
  faProjectDiagram
} from '@fortawesome/free-solid-svg-icons';

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  mainContent: {
    marginLeft: '250px',
    padding: '4rem 5%',
    flex: 1,
    boxSizing: 'border-box',
    color: '#1976D2', // Couleur bleue moderne
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4rem',
    flexWrap: 'wrap',
    gap: '2rem'
  },
  heroText: {
    maxWidth: '600px'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    lineHeight: '1.2',
    color: '#1976D2', // Couleur bleue moderne
    marginBottom: '1.5rem'
  },
  paragraph: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
    color: '#1976D2', // Couleur bleue moderne
  },
  highlightGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '4rem'
  },
  highlightCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #D0E2FF',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    color: '#1976D2', // Couleur bleue moderne
  },
  systemStatus: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '3rem'
  },
  statusItem: {
    background: '#F0F7FF',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #D0E2FF',
    color: '#1976D2', // Couleur bleue moderne
  }
};

export default function Accueil() {
  const highlights = [
    {
      icon: faProjectDiagram,
      title: "Gestion Intelligente",
      text: "Surveillance en temps réel de votre infrastructure"
    },
    {
      icon: faShieldAlt,
      title: "Sécurité Maximale",
      text: "Protection avancée contre les cybermenaces"
    },
    {
      icon: faDatabase,
      title: "Data Analytics",
      text: "Analyse prédictive et rapports détaillés"
    }
  ];

  return (
    <div style={styles.container}>
      <Menu />

      <div style={styles.mainContent}>
        <section style={styles.heroSection}>
          <div style={styles.heroText}>
            <h1 style={styles.title}>SCE Chemicals — Gestion Parc Informatique</h1>
            <p style={styles.paragraph}>
              Plateforme centralisée de gestion technologique. Surveillance proactive, maintenance prédictive et performances.
            </p>
          </div>

          <div style={{
            backgroundColor: '#F0F7FF',
            border: '1px solid #D0E2FF',
            borderRadius: '16px',
            padding: '2rem',
            minWidth: '300px',
            color: '#1976D2' // Couleur bleue moderne
          }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Accès Rapide</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button style={quickActionStyle}>
                <FontAwesomeIcon icon={faRocket} />
                &nbsp; Nouvelle Intervention
              </button>
              <button style={quickActionStyle}>
                <FontAwesomeIcon icon={faBell} />
                &nbsp; Support
              </button>
              <button style={quickActionStyle}>
                <FontAwesomeIcon icon={faDatabase} />
                &nbsp; Générer Rapport
              </button>
            </div>
          </div>
        </section>

        <div style={styles.highlightGrid}>
          {highlights.map((item, index) => (
            <div key={index} style={styles.highlightCard}>
              <FontAwesomeIcon icon={item.icon} style={{ fontSize: '2rem', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '1rem' }}>{item.text}</p>
            </div>
          ))}
        </div>

        <section style={styles.systemStatus}>
          <div style={styles.statusItem}>
            <h4 style={{ marginBottom: '1rem' }}>État du Système</h4>
            <div style={statusBarStyle}>
              <div style={{
                width: '85%',
                height: '100%',
                background: 'linear-gradient(90deg, #4A90E2, #1976D2)', // Couleur bleue moderne
                borderRadius: '8px'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span>Capacité</span>
              <span>85%</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const quickActionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.8rem 1rem',
  backgroundColor: '#1976D2', // Couleur bleue moderne
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background 0.3s ease',
};

const statusBarStyle = {
  height: '8px',
  background: '#D0E2FF',
  borderRadius: '8px',
  overflow: 'hidden'
};
