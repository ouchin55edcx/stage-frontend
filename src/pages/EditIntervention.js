import React, { useState, useEffect } from 'react';
import Menu from './Menu'; // Assurez-vous que le chemin est correct
import { useParams } from 'react-router-dom'; // Utilisation de useParams pour récupérer l'ID

const EditIntervention = () => {
  const { id } = useParams();  // Utilisation de useParams pour obtenir l'ID de l'intervention depuis l'URL
  const [dateIntervention, setDateIntervention] = useState('');
  const [nomInter, setNomInter] = useState('');
  const [note, setNote] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [equipements, setEquipements] = useState([]);

  useEffect(() => {
    const fetchEquipements = async () => {
      const response = await fetch('URL_DE_VOTRE_API/equipements');
      const data = await response.json();
      setEquipements(data);
    };

    // Charger les équipements et l'intervention à éditer
    const fetchIntervention = async () => {
      const response = await fetch(`URL_DE_VOTRE_API/interventions/${id}`);
      const data = await response.json();
      setDateIntervention(data.dateIntervention);
      setNomInter(data.nomInter);
      setNote(data.note);
      setEquipmentId(data.equipmentId);
    };

    fetchEquipements();
    fetchIntervention();
  }, [id]); // Recharger les données quand l'ID change

  const handleInterventionSubmit = (e) => {
    e.preventDefault();

    if (!dateIntervention || !nomInter || !note || !equipmentId) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    // Envoyer la requête à l'API pour mettre à jour l'intervention
    alert("Intervention mise à jour avec succès !");
    // Vous pouvez ici envoyer les données de l'intervention à votre API backend
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#FFFFFF', minHeight: '100vh' }}> {/* Fond blanc ici */}
      <Menu /> {/* Ajout du Menu à gauche */}

      <div
        style={{
          padding: '2rem',
          maxWidth: '900px',
          margin: 'auto',
          background: '#F0F8FF', // Fond bleu clair moderne
          borderRadius: '10px',
          flex: 1,
          color: '#333', // Texte en gris foncé
        }}
      >
        <h2 style={{ color: '#007BA7', marginBottom: '1rem' }}>Éditer l'Intervention</h2> {/* Teinte bleue moderne pour le titre */}

        <form onSubmit={handleInterventionSubmit}>
          {/* Date de l'Intervention */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#007BA7' }}>Date de l'Intervention</label> {/* Teinte bleue pour les labels */}
            <input
              type="date"
              value={dateIntervention}
              onChange={(e) => setDateIntervention(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #007BA7', // Bordure bleue
                background: '#E6F7FF', // Fond bleu clair
                color: '#333', // Texte noir
              }}
            />
          </div>

          {/* Nom de l'Intervenant */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#007BA7' }}>Nom de l'Intervenant</label>
            <input
              type="text"
              value={nomInter}
              onChange={(e) => setNomInter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #007BA7', // Bordure bleue
                background: '#E6F7FF', // Fond bleu clair
                color: '#333', // Texte noir
              }}
            />
          </div>

          {/* Note de l'Intervention */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#007BA7' }}>Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #007BA7', // Bordure bleue
                background: '#E6F7FF', // Fond bleu clair
                color: '#333', // Texte noir
                minHeight: '100px',
              }}
            />
          </div>

          {/* Sélection de l'Équipement */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#007BA7' }}>Équipement</label>
            <select
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid #007BA7', // Bordure bleue
                background: '#E6F7FF', // Fond bleu clair
                color: '#333', // Texte noir
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
              background: '#007BA7', // Bouton bleu moderne
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem',
              display: 'block',
              width: '100%',
            }}
          >
            Mettre à jour l'Intervention
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditIntervention;
