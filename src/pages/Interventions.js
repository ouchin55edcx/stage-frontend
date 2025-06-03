import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
import { createIntervention } from '../services/intervention';
import { getAllEquipments } from '../services/equipment';
import { useNotifications } from '../contexts/NotificationContext';

const InterventionsForm = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [date, setDate] = useState('');
  const [technician_name, setTechnicianName] = useState('');
  const [note, setNote] = useState('');
  const [equipment_id, setEquipmentId] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les équipements depuis l'API
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        const data = await getAllEquipments();
        console.log('Equipment data:', data); // Debug log

        // Ensure we're working with an array
        if (Array.isArray(data)) {
          setEquipments(data);
        } else if (data && typeof data === 'object') {
          // If it's an object with nested data, try to find the array
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            setEquipments(possibleArrays[0]);
          } else {
            // If no arrays found, convert the object to an array if it has equipment-like properties
            if (data.id) {
              setEquipments([data]);
            } else {
              setEquipments([]);
              console.error('No equipment data found in response');
            }
          }
        } else {
          setEquipments([]);
          console.error('Unexpected equipment data format:', data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des équipements:', err);
        setError('Impossible de charger les équipements. Veuillez réessayer plus tard.');
        setEquipments([]); // Ensure equipments is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []); // Charge les équipements une seule fois lors du montage du composant

  const handleInterventionSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !technician_name || !note || !equipment_id) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    try {
      setLoading(true);

      // Préparer les données pour l'API
      const interventionData = {
        date,
        technician_name,
        note,
        equipment_id: parseInt(equipment_id, 10)
      };

      // Envoyer la requête à l'API pour ajouter l'intervention
      await createIntervention(interventionData);

      // Rediriger vers la liste des interventions après succès
      showSuccess("Intervention enregistrée avec succès !");
      navigate('/admin/interventions/list');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'intervention:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement de l\'intervention.');
      showError(err.message || 'Une erreur est survenue lors de l\'enregistrement de l\'intervention.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#F0F0F0', minHeight: '100vh' }}> {/* Fond blanc avec une légère nuance de gris */}
      <Menu /> {/* Ajout du Menu à gauche */}

      <div
        style={{
          padding: '2rem',
          maxWidth: '900px',
          margin: 'auto',
          background: '#FFFFFF', // Fond blanc pour le formulaire
          borderRadius: '10px',
          flex: 1,
          color: '#333', // Texte gris foncé
        }}
      >
        <h2 style={{ color: '#00AEEF', marginBottom: '1rem' }}>Nouvelle Intervention</h2> {/* Teinte bleu moderne */}

        {error && (
          <div style={{
            padding: '0.8rem',
            backgroundColor: '#FFEBEE',
            color: '#D32F2F',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #FFCDD2'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleInterventionSubmit}>
          {/* Date de l'Intervention */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#555' }}>Date de l'Intervention</label> {/* Gris clair pour le label */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #DDD',
                background: '#F9F9F9', // Fond gris clair pour le champ
                color: '#333', // Texte foncé dans le champ
              }}
              disabled={loading}
            />
          </div>

          {/* Nom de l'Intervenant */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#555' }}>Nom du Technicien</label>
            <input
              type="text"
              value={technician_name}
              onChange={(e) => setTechnicianName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #DDD',
                background: '#F9F9F9',
                color: '#333',
              }}
              disabled={loading}
            />
          </div>

          {/* Note de l'Intervention */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#555' }}>Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #DDD',
                background: '#F9F9F9',
                color: '#333',
                minHeight: '100px',
              }}
              disabled={loading}
            />
          </div>

          {/* Sélection de l'Équipement */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#555' }}>Équipement</label>
            <select
              value={equipment_id}
              onChange={(e) => setEquipmentId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #DDD',
                background: '#F9F9F9',
                color: '#333',
              }}
              disabled={loading}
            >
              <option value="">Sélectionnez un équipement</option>
              {Array.isArray(equipments) && equipments.length > 0 ? (
                equipments.map((equipment) => (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.name || 'Sans nom'} - {equipment.type || 'N/A'} {equipment.serial_number ? `(${equipment.serial_number})` : ''}
                  </option>
                ))
              ) : (
                <option disabled>Aucun équipement disponible</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '0.7rem 1.5rem',
              background: loading ? '#B3E5FC' : '#00AEEF', // Bleu moderne
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
              display: 'block',
              width: '100%',
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? 'Enregistrement en cours...' : 'Enregistrer l\'Intervention'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterventionsForm;
