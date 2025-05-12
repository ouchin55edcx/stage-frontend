import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaTimes } from 'react-icons/fa';
import Menu from './Menu';

const EditMaintenance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState({
    equipement_nom: '',
    type_maintenance: 'Préventive',
    date_planifiee: '',
    date_realisation: '',
    date_prochaine: '',
    observations: '',
    intervenant_nom: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id !== '0') {
      axios.get(`/api/maintenances/${id}`)
        .then(res => {
          setMaintenance(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Erreur de chargement:', err);
          navigate('/admin/maintenances');
        });
    } else {
      setMaintenance({
        equipement_nom: 'Ordinateur Portable',
        type_maintenance: 'Réparation',
        date_planifiee: '2025-05-10',
        date_realisation: '2025-05-12',
        date_prochaine: '2025-06-10',
        observations: 'Aucune observation particulière',
        intervenant_nom: 'Jean Dupont'
      });
      setLoading(false);
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setMaintenance({
      ...maintenance,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id === '0') {
      alert("La maintenance d'exemple ne peut pas être modifiée");
      return;
    }
    
    axios.put(`/api/maintenances/${id}`, maintenance)
      .then(() => {
        alert('Maintenance mise à jour !');
        navigate('/admin/maintenances');
      })
      .catch(err => {
        console.error('Erreur de mise à jour:', err);
        alert('Erreur lors de la mise à jour');
      });
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="admin-container">
      <Menu />
      
      <div className="edit-maintenance-container">
        <h2>Modifier la Maintenance</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Équipement:</label>
            <input
              type="text"
              name="equipement_nom"
              value={maintenance.equipement_nom}
              onChange={handleChange}
              disabled={id === '0'}
              required
            />
          </div>

          <div className="form-group">
            <label>Type de maintenance:</label>
            <select
              name="type_maintenance"
              value={maintenance.type_maintenance}
              onChange={handleChange}
              disabled={id === '0'}
            >
              <option value="Préventive">Préventive</option>
              <option value="Corrective">Corrective</option>
              <option value="Prédictive">Prédictive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date planifiée:</label>
            <input
              type="date"
              name="date_planifiee"
              value={maintenance.date_planifiee}
              onChange={handleChange}
              disabled={id === '0'}
              required
            />
          </div>

          <div className="form-group">
            <label>Date de réalisation:</label>
            <input
              type="date"
              name="date_realisation"
              value={maintenance.date_realisation}
              onChange={handleChange}
              disabled={id === '0'}
            />
          </div>

          <div className="form-group">
            <label>Date prochaine maintenance:</label>
            <input
              type="date"
              name="date_prochaine"
              value={maintenance.date_prochaine}
              onChange={handleChange}
              disabled={id === '0'}
            />
          </div>

          <div className="form-group">
            <label>Observations:</label>
            <textarea
              name="observations"
              value={maintenance.observations}
              onChange={handleChange}
              disabled={id === '0'}
            />
          </div>

          <div className="form-group">
            <label>Intervenant:</label>
            <input
              type="text"
              name="intervenant_nom"
              value={maintenance.intervenant_nom}
              onChange={handleChange}
              disabled={id === '0'}
            />
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/admin/maintenances')}
            >
              <FaTimes /> Annuler
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={id === '0'}
            >
              <FaSave /> Enregistrer
            </button>
          </div>
        </form>

        <style jsx="true">{`
          .admin-container {
            display: flex;
            min-height: 100vh;
            background-color: #f3f4f6;
          }

          .edit-maintenance-container {
            flex: 1;
            padding: 30px;
            max-width: 800px;
            margin-left: 250px;
          }

          h2 {
            color: #1e3a8a;
            margin-bottom: 30px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          label {
            display: block;
            margin-bottom: 8px;
            color: #1e3a8a;
            font-weight: bold;
          }

          input, select, textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 16px;
          }

          input:disabled, select:disabled, textarea:disabled {
            background-color: #f3f4f6;
          }

          textarea {
            height: 100px;
            resize: vertical;
          }

          .button-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
          }

          button {
            padding: 12px 25px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .save-btn {
            background: #1e3a8a;
            color: white;
          }

          .save-btn:disabled {
            background: #64748b;
            cursor: not-allowed;
          }

          .cancel-btn {
            background: #e5e7eb;
            color: #1e3a8a;
          }
        `}</style>
      </div>
    </div>
  );
};

export default EditMaintenance;