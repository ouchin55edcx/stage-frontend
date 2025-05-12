import React, { useState, useEffect } from 'react';
import Menu from './Menu'; // Assurez-vous que le chemin est correct

const InterventionsForm = () => {
  const [dateIntervention, setDateIntervention] = useState('');
  const [nomInter, setNomInter] = useState('');
  const [note, setNote] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [equipements, setEquipements] = useState([]);

  // Charger les équipements depuis l'API
  useEffect(() => {
    const fetchEquipements = async () => {
      const response = await fetch('URL_DE_VOTRE_API/equipements');
      const data = await response.json();
      setEquipements(data);
    };

    fetchEquipements();
  }, []); // Charge les équipements une seule fois lors du montage du composant

  const handleInterventionSubmit = (e) => {
    e.preventDefault();

    if (!dateIntervention || !nomInter || !note || !equipmentId) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    // Envoyer la requête à l'API pour ajouter l'intervention
    alert("Intervention enregistrée avec succès !");
    // Ici vous pouvez envoyer les données de l'intervention à votre API backend
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

        <form onSubmit={handleInterventionSubmit}>
          {/* Date de l'Intervention */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#555' }}>Date de l'Intervention</label> {/* Gris clair pour le label */}
            <input
              type="date"
              value={dateIntervention}
              onChange={(e) => setDateIntervention(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #DDD',
                background: '#F9F9F9', // Fond gris clair pour le champ
                color: '#333', // Texte foncé dans le champ
              }}
            />
          </div>

          {/* Nom de l'Intervenant */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#555' }}>Nom de l'Intervenant</label>
            <input
              type="text"
              value={nomInter}
              onChange={(e) => setNomInter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #DDD',
                background: '#F9F9F9',
                color: '#333',
              }}
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
            />
          </div>

          {/* Sélection de l'Équipement */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#555' }}>Équipement</label>
            <select
              value={equipmentId}
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
            >
              <option value="">Sélectionnez un équipement</option>
              {equipements.map((equip) => (
                <option key={equip.id} value={equip.id}>
                  {equip.nom}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '0.7rem 1.5rem',
              background: '#00AEEF', // Bleu moderne
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem',
              display: 'block',
              width: '100%',
            }}
          >
            Enregistrer l'Intervention
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterventionsForm;
