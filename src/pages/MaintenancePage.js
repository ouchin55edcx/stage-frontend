import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';

const MaintenancePage = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [equipements, setEquipements] = useState([]);
  const [intervenants, setIntervenants] = useState([]);
  const [newMaintenance, setNewMaintenance] = useState({
    equipement_id: '',
    type_maintenance: '',
    date_planifiee: '',
    date_realisation: '',
    date_prochaine: '',
    observations: '',
    intervenant_id: '',
  });

  const handleDateClick = (date) => {
    setDate(date);
    const selectedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    fetchMaintenancesByDate(selectedDate);
  };

  const fetchMaintenancesByDate = (selectedDate) => {
    setIsLoading(true);
    axios.get(`/api/maintenance/date/${selectedDate}`)
      .then(response => {
        setMaintenances(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des maintenances:', error);
        setIsLoading(false);
      });
  };

  const fetchEquipementsAndIntervenants = () => {
    axios.get('/api/equipements')
      .then(response => {
        setEquipements(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des équipements:', error);
      });

    axios.get('/api/intervenants')
      .then(response => {
        setIntervenants(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des intervenants:', error);
      });
  };

  useEffect(() => {
    const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    fetchMaintenancesByDate(currentDate);
    fetchEquipementsAndIntervenants();
  }, [date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaintenance({ ...newMaintenance, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/maintenance', newMaintenance)
      .then(response => {
        alert('Maintenance ajoutée avec succès !');
        setNewMaintenance({
          equipement_id: '',
          type_maintenance: '',
          date_planifiee: '',
          date_realisation: '',
          date_prochaine: '',
          observations: '',
          intervenant_id: '',
        });
        fetchMaintenancesByDate(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de la maintenance:', error);
        alert('Erreur lors de l\'ajout de la maintenance.');
      });
  };

  return (
    <div className="maintenance-container">
      <h1>Liste de Maintenance</h1>

      <div className="calendar-section">
        <h2>Sélectionner une date</h2>
        <Calendar
          onChange={setDate}
          value={date}
          onClickDay={handleDateClick}
        />
      </div>

      <div className="maintenance-list">
        <h2>Maintenances pour le {date.toLocaleDateString()}</h2>
        {isLoading ? (
          <p>Chargement des maintenances...</p>
        ) : maintenances.length === 0 ? (
          <p>Aucune maintenance planifiée pour cette date.</p>
        ) : (
          maintenances.map((maintenance) => (
            <div key={maintenance.id} className="maintenance-card">
              <h3>{maintenance.equipement_nom}</h3>
              <p><strong>Type:</strong> {maintenance.type_maintenance}</p>
              <p><strong>Date Planifiée:</strong> {maintenance.date_planifiee}</p>
              <p><strong>Date de Réalisation:</strong> {maintenance.date_realisation}</p>
              <p><strong>Date Prochaine Maintenance:</strong> {maintenance.date_prochaine}</p>
              <p><strong>Observations:</strong> {maintenance.observations}</p>
              <p><strong>Intervenant:</strong> {maintenance.intervenant_nom}</p>
            </div>
          ))
        )}
      </div>

      <div className="maintenance-form">
        <h2>Ajouter une nouvelle maintenance</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Équipement:</label>
            <select
              name="equipement_id"
              value={newMaintenance.equipement_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionner un équipement</option>
              {equipements.map((equipement) => (
                <option key={equipement.id} value={equipement.id}>
                  {equipement.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Type de Maintenance:</label>
            <input
              type="text"
              name="type_maintenance"
              value={newMaintenance.type_maintenance}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date Planifiée:</label>
            <input
              type="date"
              name="date_planifiee"
              value={newMaintenance.date_planifiee}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date de Réalisation:</label>
            <input
              type="date"
              name="date_realisation"
              value={newMaintenance.date_realisation}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Date Prochaine Maintenance:</label>
            <input
              type="date"
              name="date_prochaine"
              value={newMaintenance.date_prochaine}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Observations:</label>
            <textarea
              name="observations"
              value={newMaintenance.observations}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Intervenant:</label>
            <select
              name="intervenant_id"
              value={newMaintenance.intervenant_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionner un intervenant</option>
              {intervenants.map((intervenant) => (
                <option key={intervenant.id} value={intervenant.id}>
                  {intervenant.nom}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Ajouter Maintenance</button>
        </form>
      </div>

      <style jsx>{`
        .maintenance-container {
          background-color: #ffffff;
          color: #1a1a1a;
          padding: 20px;
          border-radius: 10px;
        }

        h1, h2 {
          color: #007bff;
        }

        .calendar-section {
          margin-bottom: 30px;
          text-align: center;
        }

        .react-calendar {
          border: 1px solid #007bff;
          border-radius: 10px;
          background-color: #f0f0f0;
          color: #007bff;
        }

        .react-calendar button {
          background-color: #ffffff;
          color: #007bff;
          border: 1px solid #007bff;
        }

        .react-calendar button:hover {
          background-color: #007bff;
          color: #ffffff;
        }

        .maintenance-list {
          margin-top: 30px;
        }

        .maintenance-card {
          background-color: #f8f9fa;
          color: #1a1a1a;
          margin: 10px;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 123, 255, 0.1);
        }

        .maintenance-card h3 {
          color: #007bff;
        }

        .maintenance-card p {
          margin: 5px 0;
        }

        .maintenance-form {
          margin-top: 40px;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 123, 255, 0.1);
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #007bff;
          border-radius: 5px;
          background-color: #f8f9fa;
          color: #007bff;
        }

        .form-group textarea {
          resize: vertical;
          height: 100px;
        }

        button {
          background-color: #007bff;
          color: #ffffff;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>

      <style jsx global>{`
        body {
          background-color: #f0f0f0;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
