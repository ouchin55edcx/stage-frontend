import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const [services, setServices] = useState([]);
  const [nomServ, setNomServ] = useState('');
  const [editingService, setEditingService] = useState(null);

  // Charger les services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const response = await fetch('/api/services');
    const data = await response.json();
    setServices(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nomServ) {
      alert("Le nom du service est requis");
      return;
    }

    const method = editingService ? 'PUT' : 'POST';
    const url = editingService ? `/api/services/${editingService.id}` : '/api/services';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom_serv: nomServ })
      });

      if (response.ok) {
        fetchServices();
        setNomServ('');
        setEditingService(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setNomServ(service.nom_serv);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      const response = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (response.ok) fetchServices();
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: 'white', minHeight: '100vh' }}> {/* Fond blanc ici */}
      <Menu />

      <div style={{
        padding: '2rem',
        maxWidth: '900px',
        margin: 'auto',
        background: '#E6F7FF', // Fond bleu clair moderne
        borderRadius: '10px',
        flex: 1,
        color: '#1A73E8', // Texte bleu moderne
      }}>
        <h2 style={{ color: '#1A73E8', marginBottom: '1rem' }}>Gestion des Services</h2>

        {/* Formulaire d'ajout/modification */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={nomServ}
              onChange={(e) => setNomServ(e.target.value)}
              placeholder="Nom du service"
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #1A73E8', // Bordure bleue moderne
                background: '#E6F7FF', // Fond bleu clair
                color: '#1A73E8', // Texte bleu moderne
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.7rem 1.5rem',
                background: '#1A73E8', // Bouton bleu moderne
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> {editingService ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>

        {/* Liste des services */}
        <div style={{ background: '#E6F7FF', borderRadius: '8px', padding: '1rem' }}>
          {services.map((service) => (
            <div key={service.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              marginBottom: '0.5rem',
              background: '#F0F8FF', // Fond bleu plus clair
              borderRadius: '8px'
            }}>
              <span>{service.nom_serv}</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => handleEdit(service)}
                  style={{
                    background: '#1A73E8',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} color="white" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  style={{
                    background: '#444',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} color="white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
