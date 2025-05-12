import React, { useState } from 'react';
import axios from 'axios';

function AddEquipement() {
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    etat: '',
    numero_serie: '',
    marque: '',
    libelle: '',
    ecran: '',
    nce: '',
    adresse_ip: '',
    processeur: '',
    office: '',
    sauvegarde: '',
    user_id: '',  // Ajouté pour lier l'équipement à un utilisateur
    service_id: '' // Ajouté pour lier l'équipement à un service
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios.post('/equipements', formData)
      .then(() => {
        setIsLoading(false);
        alert("Équipement ajouté !");
        setFormData({
          nom: '',
          type: '',
          etat: '',
          numero_serie: '',
          marque: '',
          libelle: '',
          ecran: '',
          nce: '',
          adresse_ip: '',
          processeur: '',
          office: '',
          sauvegarde: '',
          user_id: '',
          service_id: ''
        });
      })
      .catch(error => {
        setIsLoading(false);
        setErrorMessage("Erreur lors de l'ajout de l'équipement.");
        console.error('Erreur ajout :', error);
      });
  };

  return (
    <div>
      <style>{`
        .equipement-form {
          max-width: 1000px;
          margin: 0 auto;
          padding: 30px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .equipement-form .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 30px;
          color: #333;
          text-align: center;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }

        .form-columns-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          font-size: 16px;
          font-weight: 500;
          color: #555;
          display: block;
          margin-bottom: 5px;
        }

        input, select, textarea {
          width: 100%;
          padding: 12px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 6px;
          outline: none;
          box-sizing: border-box;
        }

        input:focus, select:focus, textarea:focus {
          border-color: #0056b3;
        }

        .button-container {
          grid-column: 1 / -1;
          text-align: center;
          margin-top: 40px;
          position: relative;
        }

        button.submit-button {
          padding: 12px 50px;
          font-size: 16px;
          background-color: #0056b3;
          color: #fff;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        button.submit-button:hover {
          transform: translateY(-2px);
        }

        button.submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          color: #ff4d4d;
          font-size: 14px;
          margin-top: 10px;
        }

        .loading-message {
          color: #007bff;
          font-size: 14px;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .form-columns-container {
            grid-template-columns: 1fr;
          }
          
          .equipement-form {
            padding: 20px;
          }
        }
      `}</style>

      <div className="equipement-form">
        <div className="title">Ajouter un nouvel équipement</div>
        <form onSubmit={handleSubmit}>
          <div className="form-columns-container">
            {/* Colonne Gauche */}
            <div>
              <div className="form-group">
                <label>Nom :</label>
                <select name="nom" value={formData.nom} onChange={handleChange} required>
                  <option value="">-- Choisir --</option>
                  <option value="PC">PC</option>
                  <option value="Imprimante">Imprimante</option>
                  <option value="Scanner">Scanner</option>
                </select>
              </div>

              <div className="form-group">
                <label>Type :</label>
                <input name="type" value={formData.type} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>État :</label>
                <select name="etat" value={formData.etat} onChange={handleChange} required>
                  <option value="">-- Sélectionner --</option>
                  <option value="Active">Active</option>
                  <option value="En panne">En panne</option>
                  <option value="En maintenance">En maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Numéro de série :</label>
                <input name="numero_serie" value={formData.numero_serie} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Marque :</label>
                <input name="marque" value={formData.marque} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Libellé :</label>
                <input name="libelle" value={formData.libelle} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Écran :</label>
                <input name="ecran" value={formData.ecran} onChange={handleChange} />
              </div>
            </div>

            {/* Colonne Droite */}
            <div>
              <div className="form-group">
                <label>NCE :</label>
                <input name="nce" value={formData.nce} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Adresse IP :</label>
                <input name="adresse_ip" value={formData.adresse_ip} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Processeur :</label>
                <input name="processeur" value={formData.processeur} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Office :</label>
                <input name="office" value={formData.office} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Sauvegarde :</label>
                <input name="sauvegarde" value={formData.sauvegarde} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Utilisateur :</label>
                <input name="user_id" value={formData.user_id} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Service :</label>
                <input name="service_id" value={formData.service_id} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="button-container">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {isLoading && <div className="loading-message">Chargement...</div>}

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEquipement;
