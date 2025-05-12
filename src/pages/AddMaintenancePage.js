import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMaintenancePage = () => {
  const navigate = useNavigate();
  const [equipementNom, setEquipementNom] = useState('');
  const [typeMaintenance, setTypeMaintenance] = useState('');
  const [datePlanifiee, setDatePlanifiee] = useState('');
  const [dateRealisation, setDateRealisation] = useState('');
  const [dateProchaine, setDateProchaine] = useState('');
  const [observations, setObservations] = useState('');
  const [intervenantNom, setIntervenantNom] = useState('');

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    const newMaintenance = {
      equipement_nom: equipementNom,
      type_maintenance: typeMaintenance,
      date_planifiee: datePlanifiee,
      date_realisation: dateRealisation,
      date_prochaine: dateProchaine,
      observations: observations,
      intervenant_nom: intervenantNom,
    };

    // Envoyer la nouvelle maintenance au backend
    axios.post('/api/maintenance', newMaintenance)
      .then(response => {
        alert('Maintenance ajoutée avec succès');
        navigate('/maintenance'); // Rediriger vers la page de gestion des maintenances
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de la maintenance:', error);
      });
  };

  return (
    <div className="add-maintenance-container">
      <h1>Ajouter une Maintenance</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom de l'équipement :</label>
          <input
            type="text"
            value={equipementNom}
            onChange={(e) => setEquipementNom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Type de Maintenance :</label>
          <input
            type="text"
            value={typeMaintenance}
            onChange={(e) => setTypeMaintenance(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date Planifiée :</label>
          <input
            type="date"
            value={datePlanifiee}
            onChange={(e) => setDatePlanifiee(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date de Réalisation :</label>
          <input
            type="date"
            value={dateRealisation}
            onChange={(e) => setDateRealisation(e.target.value)}
          />
        </div>
        <div>
          <label>Date Prochaine Maintenance :</label>
          <input
            type="date"
            value={dateProchaine}
            onChange={(e) => setDateProchaine(e.target.value)}
          />
        </div>
        <div>
          <label>Observations :</label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </div>
        <div>
          <label>Nom de l'intervenant :</label>
          <input
            type="text"
            value={intervenantNom}
            onChange={(e) => setIntervenantNom(e.target.value)}
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>

      <style jsx>{`
        .add-maintenance-container {
          padding: 20px;
          background-color: #222;
          color: white;
        }

        h1 {
          color: red;
        }

        label {
          display: block;
          margin-bottom: 5px;
        }

        input, textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          background-color: #444;
          color: white;
          border: 1px solid red;
        }

        button {
          background-color: red;
          color: black;
          padding: 10px;
          border: none;
          cursor: pointer;
        }

        button:hover {
          background-color: #ff4500;
        }
      `}</style>
    </div>
  );
};

export default AddMaintenancePage;
