// src/pages/EmployeeDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MenuEmploye from './MenuEmploye';

export default function EmployeeDashboard() {
  const [equipements, setEquipements] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [newIssue, setNewIssue] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const location = useLocation();
  const isDeclarationPage = location.pathname === '/employee/declaration';

  const styles = {
    layout: {
      display: 'flex',
      backgroundColor: '#f4f4f9', // Fond blanc avec une légère teinte gris clair
      height: '100vh',
    },
    content: {
      marginLeft: '250px',
      padding: '2rem',
      backgroundColor: '#ffffff', // Fond blanc pour le contenu
      minHeight: '100vh',
      width: '100%',
      color: '#333333', // Texte gris foncé pour un contraste plus doux
    },
    header: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#1E90FF', // Bleu moderne pour le titre
      marginBottom: '2rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '1.5rem',
    },
    card: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(30, 144, 255, 0.2)', // Légère ombre bleue pour les cartes
      color: '#333333',
    },
    listItem: {
      padding: '1rem',
      borderBottom: '1px solid #e0e0e0', // Ligne de séparation gris clair
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    status: {
      padding: '4px 8px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      margin: '0.5rem 0',
      borderRadius: '4px',
      border: '1px solid #ccc', // Bordure gris clair
      backgroundColor: '#f7f7f7', // Fond gris clair pour les champs de saisie
      color: '#333',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resEquip = await axios.get('http://localhost:5000/api/mes-equipements');
        const resInter = await axios.get('http://localhost:5000/api/mes-interventions');
        setEquipements(resEquip.data);
        setInterventions(resInter.data);
      } catch (error) {
        console.error('Erreur de chargement:', error);
      }
    };
    fetchData();
  }, []);

  const handleReportIssue = async () => {
    if (newIssue && selectedEquipment) {
      try {
        await axios.post('http://localhost:5000/api/interventions', {
          description: newIssue,
          equipment_id: selectedEquipment,
          status: 'pending',
        });

        const [equipRes, interRes] = await Promise.all([
          axios.get('http://localhost:5000/api/mes-equipements'),
          axios.get('http://localhost:5000/api/mes-interventions'),
        ]);

        setEquipements(equipRes.data);
        setInterventions(interRes.data);
        setNewIssue('');
        setSelectedEquipment('');
        alert('Panne signalée avec succès.');
      } catch (error) {
        console.error('Erreur de signalement:', error);
      }
    }
  };

  return (
    <div style={styles.layout}>
      <MenuEmploye equipements={equipements} setEquipements={setEquipements} setInterventions={setInterventions} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1>Mon Espace Employé</h1>
        </div>

        {isDeclarationPage ? (
          <div style={styles.card}>
            <h2>Déclarer une Panne</h2>
            <select
              style={styles.input}
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              required
            >
              <option value="">Sélectionner un équipement</option>
              {equipements.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nom} ({eq.type})
                </option>
              ))}
            </select>
            <textarea
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              placeholder="Décrivez la panne..."
              style={{ ...styles.input, minHeight: '100px' }}
            />
            <button
              style={{
                ...styles.input,
                background: '#1E90FF', // Bleu moderne pour le bouton
                border: 'none',
                cursor: 'pointer',
                color: '#ffffff', // Texte en blanc
              }}
              onClick={handleReportIssue}
            >
              Envoyer
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {/* Équipements */}
            <div style={styles.card}>
              <h2>Mes Équipements</h2>
              {equipements.map((eq) => (
                <div key={eq.id} style={styles.listItem}>
                  <div>
                    <h4>{eq.nom}</h4>
                    <p style={{ color: '#888888' }}>{eq.type}</p>
                  </div>
                  <span
                    style={{
                      ...styles.status,
                      background: eq.etat === 'actif' ? '#66ccff' : '#b3c7e6',
                      color: '#000',
                    }}
                  >
                    {eq.etat}
                  </span>
                </div>
              ))}
            </div>

            {/* Interventions */}
            <div style={styles.card}>
              <h2>Suivi des Interventions</h2>
              {interventions.map((inter) => (
                <div key={inter.id} style={styles.listItem}>
                  <div>
                    <h4>{inter.nom_inter}</h4>
                    <p style={{ color: '#888888' }}>
                      {new Date(inter.date_intervention).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    style={{
                      ...styles.status,
                      background: inter.status === 'résolu' ? '#8ccf68' : '#ffeb3b',
                      color: inter.status === 'résolu' ? '#4e8c26' : '#c3a300',
                    }}
                  >
                    {inter.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Historique */}
            <div style={styles.card}>
              <h2>Historique des Équipements</h2>
              {equipements.map((eq) => (
                <div
                  key={eq.id}
                  style={{
                    ...styles.listItem,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <h4>{eq.nom}</h4>
                    <p style={{ color: '#888888' }}>
                      Assigné le: {new Date(eq.date_assignation).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      background: '#ddd',
                      borderRadius: '2px',
                      marginTop: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: `${eq.health || 80}%`,
                        height: '100%',
                        background: '#1E90FF',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
