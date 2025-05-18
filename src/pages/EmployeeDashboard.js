// src/pages/EmployeeDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MenuEmploye from './MenuEmploye';
import { fetchMyStatistics } from '../services/statistics';

export default function EmployeeDashboard() {
  const [equipements, setEquipements] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [newIssue, setNewIssue] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [myStats, setMyStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const location = useLocation();
  const isDeclarationPage = location.pathname === '/employee/declaration';

  // Enhanced styles with modern UI principles
  const styles = {
    layout: {
      display: 'flex',
      backgroundColor: '#f8fafc', // Lighter, more modern background
      minHeight: '100vh',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    },
    content: {
      marginLeft: '250px',
      padding: '2rem',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      width: '100%',
      color: '#334155', // Slate-700 - better for readability
      transition: 'all 0.3s ease',
    },
    header: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#0369a1', // Sky-700 - more professional blue
      marginBottom: '1.5rem',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '0.75rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.5rem',
      marginTop: '1.5rem',
    },
    card: {
      background: '#ffffff',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid #f1f5f9', // Subtle border
      transition: 'transform 0.2s, box-shadow 0.2s',
      color: '#334155',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
    cardHeader: {
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: '0.75rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardHeaderTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#0369a1', // Sky-700 - matching header
      margin: 0,
    },
    cardContent: {
      flex: 1,
    },
    listItem: {
      padding: '0.875rem',
      borderBottom: '1px solid #f1f5f9', // Lighter border
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#f8fafc',
      },
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    listItemTitle: {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#334155',
      margin: '0 0 0.25rem 0',
    },
    listItemSubtitle: {
      fontSize: '0.875rem',
      color: '#64748b', // Slate-500 - subtle text
      margin: 0,
    },
    status: {
      padding: '0.35rem 0.75rem',
      borderRadius: '9999px', // Fully rounded for badges
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      margin: '0.75rem 0',
      borderRadius: '6px',
      border: '1px solid #cbd5e1', // Slate-300
      backgroundColor: '#f8fafc', // Slate-50
      color: '#334155',
      fontSize: '0.9375rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
      '&:focus': {
        borderColor: '#0ea5e9', // Sky-500
        boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.15)',
      },
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      background: 'linear-gradient(to right, #0ea5e9, #0284c7)', // Sky gradient
      border: 'none',
      cursor: 'pointer',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '0.9375rem',
      transition: 'all 0.2s',
      marginTop: '0.5rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    statCard: {
      padding: '1.25rem',
      borderRadius: '8px',
      backgroundColor: '#f1f5f9', // Slate-100
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #e2e8f0',
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0369a1', // Sky-700
      marginBottom: '0.25rem',
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#64748b', // Slate-500
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    progressContainer: {
      width: '100%',
      height: '6px',
      background: '#e2e8f0', // Slate-200
      borderRadius: '3px',
      marginTop: '0.75rem',
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      borderRadius: '3px',
      transition: 'width 0.5s ease',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '2rem',
      color: '#64748b',
    },
    errorContainer: {
      textAlign: 'center',
      padding: '1.25rem',
      backgroundColor: '#fef2f2', // Red-50
      borderRadius: '8px',
      color: '#b91c1c', // Red-700
      marginBottom: '1.5rem',
      border: '1px solid #fee2e2', // Red-100
    },
    statsSection: {
      marginBottom: '2rem',
    },
    statsTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#334155',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #e2e8f0',
    },
    statsCard: {
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      marginBottom: '2rem',
    },
    statsHeader: {
      backgroundColor: '#f1f5f9',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e2e8f0',
    },
    statsBody: {
      padding: '1.5rem',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employer statistics first
        console.log('Attempting to fetch statistics...');
        setStatsLoading(true);
        setStatsError(null);

        try {
          const stats = await fetchMyStatistics();
          console.log('Statistics fetched successfully:', stats);
          setMyStats(stats);
        } catch (statsError) {
          console.error('Failed to fetch statistics:', statsError);
          setStatsError(statsError.message || 'Failed to load statistics');
        } finally {
          setStatsLoading(false);
        }

        // Then fetch equipment and interventions
        try {
          const resEquip = await axios.get('http://localhost:5000/api/mes-equipements');
          const resInter = await axios.get('http://localhost:5000/api/mes-interventions');
          setEquipements(resEquip.data);
          setInterventions(resInter.data);
        } catch (dataError) {
          console.error('Failed to fetch equipment/interventions:', dataError);
        }
      } catch (error) {
        console.error('Erreur de chargement général:', error);
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

  // Helper function to get status style based on status value
  const getStatusStyle = (status) => {
    const baseStyle = { ...styles.status };

    switch(status) {
      case 'actif':
        return {
          ...baseStyle,
          backgroundColor: '#ecfdf5', // Green-50
          color: '#047857', // Green-700
          border: '1px solid #a7f3d0', // Green-200
        };
      case 'résolu':
        return {
          ...baseStyle,
          backgroundColor: '#ecfdf5', // Green-50
          color: '#047857', // Green-700
          border: '1px solid #a7f3d0', // Green-200
        };
      case 'approved':
        return {
          ...baseStyle,
          backgroundColor: '#ecfdf5', // Green-50
          color: '#047857', // Green-700
          border: '1px solid #a7f3d0', // Green-200
        };
      case 'pending':
      case 'en attente':
        return {
          ...baseStyle,
          backgroundColor: '#fffbeb', // Amber-50
          color: '#b45309', // Amber-700
          border: '1px solid #fde68a', // Amber-200
        };
      case 'rejected':
        return {
          ...baseStyle,
          backgroundColor: '#fef2f2', // Red-50
          color: '#b91c1c', // Red-700
          border: '1px solid #fecaca', // Red-200
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#f1f5f9', // Slate-100
          color: '#64748b', // Slate-500
          border: '1px solid #e2e8f0', // Slate-200
        };
    }
  };

  // Helper function to get progress bar color based on health value
  const getProgressColor = (health) => {
    if (health >= 80) return '#10b981'; // Green-500
    if (health >= 50) return '#f59e0b'; // Amber-500
    return '#ef4444'; // Red-500
  };

  return (
    <div style={styles.layout}>
      <MenuEmploye equipements={equipements} setEquipements={setEquipements} setInterventions={setInterventions} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1>Mon Espace Employé</h1>
        </div>

        {/* Display employer statistics */}
        <div style={styles.statsCard}>
          <div style={styles.statsHeader}>
            <h2 style={styles.cardHeaderTitle}>Mes Statistiques</h2>
          </div>

          <div style={styles.statsBody}>
            {statsLoading && (
              <div style={styles.loadingContainer}>
                <p>Chargement des statistiques...</p>
              </div>
            )}

            {statsError && !statsLoading && (
              <div style={styles.errorContainer}>
                <p>Erreur: {statsError}</p>
                <p>Vérifiez que vous êtes bien connecté et que le serveur est accessible.</p>
              </div>
            )}

            {myStats && !statsLoading && (
              <>
                <div style={styles.statGrid}>
                  {/* Equipment Summary Stat Card */}
                  <div style={{
                    ...styles.statCard,
                    borderLeft: '4px solid #0ea5e9',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      right: '-15px',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(14, 165, 233, 0.1)',
                      zIndex: 0
                    }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', zIndex: 1 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(14, 165, 233, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        <span style={{ fontSize: '1.25rem', color: '#0ea5e9' }}>💻</span>
                      </div>
                      <span style={styles.statLabel}>Total Équipements</span>
                    </div>
                    <span style={{...styles.statValue, fontSize: '2rem'}}>{myStats.equipment?.total ?? 'N/A'}</span>
                  </div>

                  {/* Declarations Summary Stat Card */}
                  <div style={{
                    ...styles.statCard,
                    borderLeft: '4px solid #8b5cf6',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      right: '-15px',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      zIndex: 0
                    }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', zIndex: 1 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        <span style={{ fontSize: '1.25rem', color: '#8b5cf6' }}>📝</span>
                      </div>
                      <span style={styles.statLabel}>Total Déclarations</span>
                    </div>
                    <span style={{...styles.statValue, fontSize: '2rem', color: '#8b5cf6'}}>{myStats.declarations?.total ?? 'N/A'}</span>
                  </div>

                  {/* Interventions Summary Stat Card */}
                  <div style={{
                    ...styles.statCard,
                    borderLeft: '4px solid #10b981',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      right: '-15px',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      zIndex: 0
                    }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', zIndex: 1 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        <span style={{ fontSize: '1.25rem', color: '#10b981' }}>🔧</span>
                      </div>
                      <span style={styles.statLabel}>Total Interventions</span>
                    </div>
                    <span style={{...styles.statValue, fontSize: '2rem', color: '#10b981'}}>{myStats.interventions?.total ?? 'N/A'}</span>
                  </div>
                </div>

                <div style={{
                  ...styles.statsSection,
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                  marginTop: '2rem'
                }}>
                  <h3 style={{
                    ...styles.statsTitle,
                    fontSize: '1.25rem',
                    color: '#1f2937',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '0.75rem'
                  }}>Détails des statistiques</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {/* Equipment details */}
                    <div style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(14, 165, 233, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.75rem'
                        }}>
                          <span style={{ fontSize: '1.125rem', color: '#0ea5e9' }}>💻</span>
                        </div>
                        <h4 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          margin: 0,
                          color: '#0ea5e9'
                        }}>Équipements</h4>
                      </div>

                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563', fontWeight: '500' }}>Total</span>
                            <strong style={{ color: '#0ea5e9' }}>{myStats.equipment?.total ?? 'N/A'}</strong>
                          </div>
                          <div style={styles.progressContainer}>
                            <div style={{
                              ...styles.progressBar,
                              width: '100%',
                              backgroundColor: '#0ea5e9'
                            }}></div>
                          </div>
                        </li>
                        <li style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563', fontWeight: '500' }}>Actifs</span>
                            <strong style={{ color: '#10b981' }}>{myStats.equipment?.active ?? 'N/A'}</strong>
                          </div>
                          <div style={styles.progressContainer}>
                            <div style={{
                              ...styles.progressBar,
                              width: `${myStats.equipment?.total ? (myStats.equipment.active / myStats.equipment.total) * 100 : 0}%`,
                              backgroundColor: '#10b981'
                            }}></div>
                          </div>
                        </li>
                        <li>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563', fontWeight: '500' }}>En attente</span>
                            <strong style={{ color: '#f59e0b' }}>{myStats.equipment?.on_hold ?? 'N/A'}</strong>
                          </div>
                          <div style={styles.progressContainer}>
                            <div style={{
                              ...styles.progressBar,
                              width: `${myStats.equipment?.total ? (myStats.equipment.on_hold / myStats.equipment.total) * 100 : 0}%`,
                              backgroundColor: '#f59e0b'
                            }}></div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Declarations details */}
                    <div style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(139, 92, 246, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.75rem'
                        }}>
                          <span style={{ fontSize: '1.125rem', color: '#8b5cf6' }}>📝</span>
                        </div>
                        <h4 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          margin: 0,
                          color: '#8b5cf6'
                        }}>Déclarations</h4>
                      </div>

                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563', fontWeight: '500' }}>Total</span>
                            <strong style={{ color: '#8b5cf6' }}>{myStats.declarations?.total ?? 'N/A'}</strong>
                          </div>
                          <div style={styles.progressContainer}>
                            <div style={{
                              ...styles.progressBar,
                              width: '100%',
                              backgroundColor: '#8b5cf6'
                            }}></div>
                          </div>
                        </li>
                        <li style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563', fontWeight: '500' }}>En attente</span>
                            <strong style={{ color: '#f59e0b' }}>{myStats.declarations?.pending ?? 'N/A'}</strong>
                          </div>
                          <div style={styles.progressContainer}>
                            <div style={{
                              ...styles.progressBar,
                              width: `${myStats.declarations?.total ? (myStats.declarations.pending / myStats.declarations.total) * 100 : 0}%`,
                              backgroundColor: '#f59e0b'
                            }}></div>
                          </div>
                        </li>
                        <li style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563', fontWeight: '500' }}>Approuvées</span>
                            <strong style={{ color: '#10b981' }}>{myStats.declarations?.approved ?? 'N/A'}</strong>
                          </div>
                          <div style={styles.progressContainer}>
                            <div style={{
                              ...styles.progressBar,
                              width: `${myStats.declarations?.total ? (myStats.declarations.approved / myStats.declarations.total) * 100 : 0}%`,
                              backgroundColor: '#10b981'
                            }}></div>
                          </div>
                        </li>
                        <li>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563', fontWeight: '500' }}>Rejetées</span>
                            <strong style={{ color: '#ef4444' }}>{myStats.declarations?.rejected ?? 'N/A'}</strong>
                          </div>
                          <div style={styles.progressContainer}>
                            <div style={{
                              ...styles.progressBar,
                              width: `${myStats.declarations?.total ? (myStats.declarations.rejected / myStats.declarations.total) * 100 : 0}%`,
                              backgroundColor: '#ef4444'
                            }}></div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Interventions details */}
                    <div style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.75rem'
                        }}>
                          <span style={{ fontSize: '1.125rem', color: '#10b981' }}>🔧</span>
                        </div>
                        <h4 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          margin: 0,
                          color: '#10b981'
                        }}>Interventions</h4>
                      </div>

                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        <li>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563', fontWeight: '500' }}>Total</span>
                            <strong style={{ color: '#10b981' }}>{myStats.interventions?.total ?? 'N/A'}</strong>
                          </div>
                          <div style={styles.progressContainer}>
                            <div style={{
                              ...styles.progressBar,
                              width: '100%',
                              backgroundColor: '#10b981'
                            }}></div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recent declarations */}
                {myStats.declarations?.recent && myStats.declarations.recent.length > 0 && (
                  <div style={{
                    ...styles.statsSection,
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                    marginTop: '2rem'
                  }}>
                    <h3 style={{
                      ...styles.statsTitle,
                      fontSize: '1.25rem',
                      color: '#1f2937',
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        <span style={{ fontSize: '1rem', color: '#8b5cf6' }}>📋</span>
                      </div>
                      Déclarations récentes
                    </h3>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      {myStats.declarations.recent.map(declaration => (
                        <div key={declaration.id} style={{
                          ...styles.listItem,
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          cursor: 'pointer',
                          margin: 0,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={getStatusStyle(declaration.status)}>
                                {declaration.status}
                              </span>
                              <p style={{
                                ...styles.listItemSubtitle,
                                margin: '0 0 0 0.75rem'
                              }}>
                                {new Date(declaration.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <h4 style={{
                              ...styles.listItemTitle,
                              fontSize: '1.125rem',
                              marginTop: '0.5rem',
                              marginBottom: '0.25rem'
                            }}>{declaration.issue_title}</h4>
                            <div style={{
                              height: '4px',
                              width: '2rem',
                              backgroundColor: declaration.status === 'approved' ? '#10b981' :
                                              declaration.status === 'rejected' ? '#ef4444' : '#f59e0b',
                              borderRadius: '2px',
                              marginTop: '0.75rem'
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!myStats && !statsLoading && !statsError && (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <p>Aucune statistique disponible. Veuillez vous connecter pour voir vos statistiques.</p>
              </div>
            )}
          </div>
        </div>

        {isDeclarationPage ? (
          <div style={{...styles.card, marginTop: '2rem'}}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardHeaderTitle}>Déclarer une Panne</h2>
            </div>
            <div style={styles.cardContent}>
              <select
                style={{...styles.input, marginTop: '1rem'}}
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
                style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }}
              />
              <button
                style={{
                  ...styles.button,
                  width: '100%',
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={handleReportIssue}
                disabled={!newIssue || !selectedEquipment}
              >
                Envoyer la déclaration
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.grid}>
            {/* Équipements */}
            <div style={{...styles.card, height: 'auto'}}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardHeaderTitle}>Mes Équipements</h2>
              </div>
              <div style={styles.cardContent}>
                {equipements.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                    <p>Aucun équipement n'est assigné actuellement.</p>
                  </div>
                ) : (
                  equipements.map((eq) => (
                    <div key={eq.id} style={styles.listItem}>
                      <div>
                        <h4 style={styles.listItemTitle}>{eq.nom}</h4>
                        <p style={styles.listItemSubtitle}>{eq.type}</p>
                      </div>
                      <span style={getStatusStyle(eq.etat)}>
                        {eq.etat}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Interventions */}
            <div style={{...styles.card, height: 'auto'}}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardHeaderTitle}>Suivi des Interventions</h2>
              </div>
              <div style={styles.cardContent}>
                {interventions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                    <p>Aucune intervention n'est en cours.</p>
                  </div>
                ) : (
                  interventions.map((inter) => (
                    <div key={inter.id} style={styles.listItem}>
                      <div>
                        <h4 style={styles.listItemTitle}>{inter.nom_inter}</h4>
                        <p style={styles.listItemSubtitle}>
                          {new Date(inter.date_intervention).toLocaleDateString()}
                        </p>
                      </div>
                      <span style={getStatusStyle(inter.status)}>
                        {inter.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Historique */}
            <div style={{...styles.card, height: 'auto'}}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardHeaderTitle}>Historique des Équipements</h2>
              </div>
              <div style={styles.cardContent}>
                {equipements.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                    <p>Aucun historique n'est disponible.</p>
                  </div>
                ) : (
                  equipements.map((eq) => (
                    <div
                      key={eq.id}
                      style={{
                        ...styles.listItem,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{ width: '100%', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={styles.listItemTitle}>{eq.nom}</h4>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: getProgressColor(eq.health || 80) }}>
                            {eq.health || 80}%
                          </span>
                        </div>
                        <p style={styles.listItemSubtitle}>
                          Assigné le: {new Date(eq.date_assignation).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={styles.progressContainer}>
                        <div
                          style={{
                            ...styles.progressBar,
                            width: `${eq.health || 80}%`,
                            backgroundColor: getProgressColor(eq.health || 80),
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}