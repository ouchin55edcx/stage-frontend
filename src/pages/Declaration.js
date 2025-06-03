import React, { useState, useEffect } from 'react';
import MenuEmploye from '../pages/MenuEmploye';
import { createDeclaration, fetchMyDeclarations, updateDeclaration, deleteDeclaration } from '../services/declaration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSpinner, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../contexts/NotificationContext';

export default function Declaration() {
  const { showSuccess, showError, showConfirmation } = useNotifications();
  const [formData, setFormData] = useState({ issue_title: '', description: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [declarations, setDeclarations] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ issue_title: '', description: '' });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchEmployerDeclarations();
  }, []);

  const fetchEmployerDeclarations = async () => {
    setFetchLoading(true);
    try {
      const data = await fetchMyDeclarations();
      setDeclarations(data);
    } catch (err) {
      console.error('Error fetching declarations:', err);
      setMessage(`❌ Erreur lors du chargement des déclarations: ${err.message}`);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = e => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDeclaration(formData);

      setMessage('✅ Déclaration envoyée avec succès !');
      setFormData({ issue_title: '', description: '' });

      // Refresh the list of declarations
      await fetchEmployerDeclarations();
    } catch (err) {
      console.error(err);
      setMessage(`❌ Erreur: ${err.message || 'Erreur lors de l\'envoi'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (declaration) => {
    setEditingId(declaration.id);
    setEditForm({
      issue_title: declaration.issue_title,
      description: declaration.description
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ issue_title: '', description: '' });
  };

  const handleUpdate = async (id) => {
    setActionLoading(id);
    try {
      await updateDeclaration(id, editForm);
      setMessage('✅ Déclaration mise à jour avec succès !');
      setEditingId(null);
      await fetchEmployerDeclarations();
    } catch (err) {
      console.error('Error updating declaration:', err);
      setMessage(`❌ Erreur lors de la mise à jour: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirmation(
      'Supprimer la déclaration',
      'Êtes-vous sûr de vouloir supprimer cette déclaration ? Cette action est irréversible.'
    );

    if (confirmed) {
      setActionLoading(id);
      try {
        await deleteDeclaration(id);
        showSuccess('Déclaration supprimée avec succès !');
        await fetchEmployerDeclarations();
      } catch (err) {
        console.error('Error deleting declaration:', err);
        showError(`Erreur lors de la suppression: ${err.message}`);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const styles = {
    layout: {
      display: 'flex',
      backgroundColor: '#f0f4f8', // Fond blanc clair
      minHeight: '100vh', // Pour s'assurer que l'arrière-plan couvre toute la hauteur de la page
    },
    content: {
      marginLeft: '250px',
      padding: '3rem',
      color: '#333', // Couleur de texte sombre
      width: '100%'
    },
    formCard: {
      background: '#ffffff', // Fond blanc pour la carte
      padding: '2rem',
      borderRadius: '16px',
      maxWidth: '600px',
      boxShadow: '0 8px 24px rgba(100, 149, 237, 0.2)', // Ombre légère en bleu clair
      marginTop: '2rem',
      border: '1px solid #e0e0e0' // Bordure grise claire
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      marginTop: '0.5rem',
      marginBottom: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #ccc', // Bordure grise pour les champs
      backgroundColor: '#f9f9f9', // Fond gris très clair
      color: '#333',
      fontSize: '1rem'
    },
    label: {
      fontWeight: '600',
      display: 'block',
      color: '#555', // Couleur de texte plus claire
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#4c8bf5', // Bleu moderne pour le bouton
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: '0.3s',
      width: '100%', // Bouton prenant toute la largeur
    },
    buttonHover: {
      backgroundColor: '#3a74e2' // Bleu plus foncé au survol
    },
    message: {
      marginTop: '1rem',
      fontWeight: 'bold',
      color: '#4c8bf5', // Texte bleu pour le message de succès ou erreur
    },
    declarationsList: {
      marginTop: '3rem',
    },
    declarationCard: {
      background: '#ffffff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '1.5rem',
      border: '1px solid #e0e0e0',
      transition: 'transform 0.2s',
    },
    declarationHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      borderBottom: '1px solid #eee',
      paddingBottom: '0.75rem',
    },
    declarationTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#333',
      margin: 0,
    },
    declarationDate: {
      color: '#888',
      fontSize: '0.9rem',
    },
    declarationDescription: {
      color: '#555',
      marginBottom: '1.5rem',
      lineHeight: '1.6',
    },
    declarationActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
    },
    actionButton: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    editButton: {
      backgroundColor: '#4c8bf5',
      color: 'white',
    },
    deleteButton: {
      backgroundColor: '#f44336',
      color: 'white',
    },
    saveButton: {
      backgroundColor: '#4caf50',
      color: 'white',
    },
    cancelButton: {
      backgroundColor: '#9e9e9e',
      color: 'white',
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
      display: 'inline-block',
      marginLeft: '1rem',
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      color: '#4c8bf5',
    },
    tabsContainer: {
      display: 'flex',
      marginBottom: '2rem',
      borderBottom: '1px solid #e0e0e0',
    },
    tab: {
      padding: '1rem 2rem',
      cursor: 'pointer',
      fontWeight: '500',
      color: '#555',
      borderBottom: '3px solid transparent',
      transition: 'all 0.2s',
    },
    activeTab: {
      color: '#4c8bf5',
      borderBottom: '3px solid #4c8bf5',
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'resolved': return 'Résolu';
      case 'rejected': return 'Rejeté';
      case 'in_progress': return 'En cours';
      default: return 'En attente';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'resolved':
        return { backgroundColor: '#e8f5e9', color: '#388e3c' };
      case 'rejected':
        return { backgroundColor: '#ffebee', color: '#d32f2f' };
      case 'in_progress':
        return { backgroundColor: '#fff8e1', color: '#f57c00' };
      default:
        return { backgroundColor: '#e3f2fd', color: '#1976d2' };
    }
  };

  const [activeTab, setActiveTab] = useState('new');

  return (
    <div style={styles.layout}>
      <MenuEmploye />
      <div style={styles.content}>
        <h1 style={{ fontSize: '2rem', color: '#4c8bf5' }}>Gestion des pannes</h1>

        <div style={styles.tabsContainer}>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'new' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('new')}
          >
            Nouvelle déclaration
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'list' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('list')}
          >
            Mes déclarations
          </div>
        </div>

        {activeTab === 'new' ? (
          <div style={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Titre de la panne :</label>
              <input
                type="text"
                name="issue_title"
                value={formData.issue_title}
                onChange={handleChange}
                placeholder="Ex: Imprimante en panne"
                required
                style={styles.input}
              />

              <label style={styles.label}>Description :</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le problème en détail..."
                required
                rows="5"
                style={{ ...styles.input, resize: 'vertical' }}
              />

              <button
                type="submit"
                style={styles.button}
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer la déclaration'}
              </button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
          </div>
        ) : (
          <div style={styles.declarationsList}>
            {fetchLoading ? (
              <div style={styles.loadingSpinner}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p style={{ marginLeft: '1rem' }}>Chargement des déclarations...</p>
              </div>
            ) : declarations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>Vous n'avez pas encore de déclarations.</p>
              </div>
            ) : (
              declarations.map(declaration => (
                <div key={declaration.id} style={styles.declarationCard}>
                  {editingId === declaration.id ? (
                    // Edit mode
                    <>
                      <div style={styles.declarationHeader}>
                        <input
                          type="text"
                          name="issue_title"
                          value={editForm.issue_title}
                          onChange={handleEditChange}
                          placeholder="Titre de la panne"
                          required
                          style={{ ...styles.input, marginBottom: 0 }}
                        />
                      </div>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        placeholder="Description du problème"
                        required
                        rows="4"
                        style={{ ...styles.input, resize: 'vertical', marginTop: '1rem' }}
                      />
                      <div style={styles.declarationActions}>
                        <button
                          onClick={() => handleUpdate(declaration.id)}
                          disabled={actionLoading === declaration.id}
                          style={{ ...styles.actionButton, ...styles.saveButton }}
                        >
                          {actionLoading === declaration.id ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            <FontAwesomeIcon icon={faSave} />
                          )}
                          Enregistrer
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{ ...styles.actionButton, ...styles.cancelButton }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                          Annuler
                        </button>
                      </div>
                    </>
                  ) : (
                    // View mode
                    <>
                      <div style={styles.declarationHeader}>
                        <h3 style={styles.declarationTitle}>
                          {declaration.issue_title}
                          <span style={{
                            ...styles.statusBadge,
                            ...getStatusStyle(declaration.status)
                          }}>
                            {getStatusLabel(declaration.status)}
                          </span>
                        </h3>
                        <span style={styles.declarationDate}>
                          {formatDate(declaration.created_at)}
                        </span>
                      </div>
                      <p style={styles.declarationDescription}>{declaration.description}</p>
                      <div style={styles.declarationActions}>
                        {declaration.status !== 'resolved' && declaration.status !== 'rejected' && (
                          <>
                            <button
                              onClick={() => handleEdit(declaration)}
                              style={{ ...styles.actionButton, ...styles.editButton }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(declaration.id)}
                              disabled={actionLoading === declaration.id}
                              style={{ ...styles.actionButton, ...styles.deleteButton }}
                            >
                              {actionLoading === declaration.id ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                <FontAwesomeIcon icon={faTrash} />
                              )}
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
