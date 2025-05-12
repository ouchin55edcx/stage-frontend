import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const MaintenanceListPage = () => {
  const navigate = useNavigate(); // Hook de navigation
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [maintenances, setMaintenances] = useState([
    {
      id: 0, // ID fictif pour test
      equipement_nom: 'Ordinateur Portable',
      type_maintenance: 'Réparation',
      date_planifiee: '2025-05-10',
      date_realisation: '2025-05-12',
      date_prochaine: '2025-06-10',
      observations: 'Aucune observation particulière',
      intervenant_nom: 'Jean Dupont'
    }
  ]);

  const fetchMaintenances = useCallback(async () => {
    try {
      const response = await axios.get(`/api/maintenances?month=${selectedMonth}&year=${selectedYear}`);
      // Ajouter les données récupérées sans retirer l'exemple
      setMaintenances((prev) => {
        const others = response.data.filter(item => item.id !== 0);
        return [...prev.filter(m => m.id === 0), ...others];
      });
    } catch (error) {
      console.error('Erreur lors du chargement des maintenances :', error);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchMaintenances();
  }, [fetchMaintenances]);

  const handleMonthSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-maintenance/${id}`); // Redirection vers la page d'édition
  };

  const handleDelete = (id) => {
    if (id === 0) {
      alert("Vous ne pouvez pas supprimer l'exemple de maintenance.");
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette maintenance ?')) {
      axios.delete(`/api/maintenances/${id}`)
        .then(() => {
          alert('Maintenance supprimée avec succès');
          fetchMaintenances();
        })
        .catch(err => {
          console.error('Erreur lors de la suppression de la maintenance', err);
          alert('Erreur lors de la suppression de la maintenance');
        });
    }
  };

  const renderCalendar = () => {
    const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
    const monthMap = {
      1: 'Janvier',
      5: 'Mai',
      9: 'Septembre',
    };

    return years.map((year) => (
      <div key={year} className="calendar-year-section">
        <h3 className="year-header">{year}</h3>
        <div className="card-grid">
          {Object.entries(monthMap).map(([monthNumber, monthName]) => (
            <div
              key={`${year}-${monthNumber}`}
              className={`month-card ${
                year === selectedYear && parseInt(monthNumber) === selectedMonth ? 'selected' : ''
              }`}
              onClick={() => handleMonthSelect(parseInt(monthNumber), year)}
            >
              <h4>{monthName}</h4>
              <p>{year}</p>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="maintenance-list-container">
      <div className="calendar-section">
        <h2>Calendrier de Maintenance</h2>
        {renderCalendar()}
      </div>

      <div className="maintenance-list">
        <h2>
          Maintenances pour{' '}
          {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <Link to="/admin/add-maintenance" className="add-button">
          Ajouter une Maintenance
        </Link>

        <table className="maintenance-table">
          <thead>
            <tr>
              <th>Équipement</th>
              <th>Type</th>
              <th>Date Planifiée</th>
              <th>Réalisée le</th>
              <th>Prochaine Maintenance</th>
              <th>Observations</th>
              <th>Intervenant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.length > 0 ? (
              maintenances.map((maintenance) => (
                <tr key={maintenance.id}>
                  <td>{maintenance.equipement_nom}</td>
                  <td>{maintenance.type_maintenance}</td>
                  <td>{maintenance.date_planifiee ? new Date(maintenance.date_planifiee).toLocaleDateString() : '-'}</td>
                  <td>{maintenance.date_realisation ? new Date(maintenance.date_realisation).toLocaleDateString() : '-'}</td>
                  <td>{maintenance.date_prochaine ? new Date(maintenance.date_prochaine).toLocaleDateString() : '-'}</td>
                  <td>{maintenance.observations || '-'}</td>
                  <td>{maintenance.intervenant_nom || '-'}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(maintenance.id)} className="action-btn edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(maintenance.id)} className="action-btn delete">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  Aucune maintenance pour cette période.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx="true">{`
        .maintenance-list-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
          padding: 20px;
          background-color: #ffffff;
          color: black;
        }

        .calendar-section {
          border-right: 2px solid #1e3a8a;
          padding-right: 20px;
        }

        .year-header {
          color: #1e3a8a;
          margin: 20px 0 10px;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .month-card {
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: 0.3s;
          border-radius: 10px;
        }

        .month-card:hover {
          border-color: #1e3a8a;
          background: #e0e7ff;
        }

        .month-card.selected {
          background: #1e3a8a;
          color: white;
          border-color: #1e3a8a;
        }

        .add-button {
          display: inline-block;
          background: #1e3a8a;
          color: white;
          padding: 10px 20px;
          margin: 10px 0;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
        }

        .add-button:hover {
          background: #1d4ed8;
        }

        .maintenance-table {
          width: 100%;
          border-collapse: collapse;
          background: #f9fafb;
          margin-top: 10px;
        }

        th,
        td {
          padding: 12px;
          border: 1px solid #e5e7eb;
        }

        th {
          background-color: #1e3a8a;
          color: white;
        }

        .actions {
          text-align: center;
        }

        .action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #1e3a8a;
          font-size: 1.2rem;
          margin: 0 5px;
        }

        .action-btn:hover {
          color: #ffffff;
        }

        .action-btn.edit {
          color: #ffcc00;
        }

        .action-btn.delete {
          color: #ff0000;
        }
      `}</style>
    </div>
  );
};

export default MaintenanceListPage;
