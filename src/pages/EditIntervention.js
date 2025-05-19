import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Menu from './Menu';
import { getInterventionById, updateIntervention } from '../services/intervention';
import { getAllEquipments } from '../services/equipment';

const EditIntervention = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [technician_name, setTechnicianName] = useState('');
  const [note, setNote] = useState('');
  const [equipment_id, setEquipmentId] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);

        // Fetch intervention data
        const interventionData = await getInterventionById(id);
        console.log('Intervention data:', interventionData); // Debug log

        // Format date for input (YYYY-MM-DD)
        const formattedDate = interventionData.date ?
          new Date(interventionData.date).toISOString().split('T')[0] : '';

        setDate(formattedDate);
        setTechnicianName(interventionData.technician_name || '');
        setNote(interventionData.note || '');
        setEquipmentId(interventionData.equipment_id?.toString() || '');

        // Fetch equipment options
        const equipmentData = await getAllEquipments();
        console.log('Equipment data:', equipmentData); // Debug log

        // Ensure equipments is an array
        if (Array.isArray(equipmentData)) {
          setEquipments(equipmentData);
        } else if (equipmentData && typeof equipmentData === 'object') {
          const possibleArrays = Object.values(equipmentData).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            setEquipments(possibleArrays[0]);
          } else if (equipmentData.id) {
            setEquipments([equipmentData]);
          } else {
            setEquipments([]);
          }
        } else {
          setEquipments([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
      } finally {
        setFetchingData(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleInterventionSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !technician_name || !note || !equipment_id) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const interventionData = {
        date,
        technician_name,
        note,
        equipment_id: parseInt(equipment_id, 10)
      };

      // Update intervention
      await updateIntervention(id, interventionData);

      // Redirect to interventions list
      alert("Intervention mise à jour avec succès !");
      navigate('/admin/interventions/list');
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div style={{ display: 'flex', backgroundColor: '#F0F0F0', minHeight: '100vh' }}>
        <Menu />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', color: '#00AEEF' }}>
            <p>Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#F0F0F0', minHeight: '100vh' }}>
      <Menu />

      <div
        style={{
          padding: '2rem',
          maxWidth: '900px',
          margin: 'auto',
          background: '#FFFFFF',
          borderRadius: '10px',
          flex: 1,
          color: '#333',
        }}
      >
        <h2 style={{ color: '#00AEEF', marginBottom: '1rem' }}>Modifier l'Intervention</h2>

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
            <label style={{ color: '#555' }}>Date de l'Intervention</label>
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
                background: '#F9F9F9',
                color: '#333',
              }}
              disabled={loading}
            />
          </div>

          {/* Nom du Technicien */}
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

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              style={{
                padding: '0.7rem 1.5rem',
                background: loading ? '#B3E5FC' : '#00AEEF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                flex: 1,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/interventions/list')}
              style={{
                padding: '0.7rem 1.5rem',
                background: '#E0E0E0',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                flex: 1,
              }}
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIntervention;
