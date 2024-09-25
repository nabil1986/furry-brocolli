import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import './Anomalie.css';  // Import the CSS file

const Anomalie = ({ device, onSubmit, onCancel, showNavbar = true }) => {
  const [numero_inventaire, setNumeroInventaire] = useState(device ? device.numero_inventaire : '');
  const [anomlie, setAnomalieConstatee] = useState(device ? device.anomlie : '');
  const [operateur, setOperateur] = useState('');  // Nouveau champ pour l'opérateur
  const [formVisible, setFormVisible] = useState(true); // Add state to control form visibility
  const [successMessage, setSuccessMessage] = useState('');



  useEffect(() => {
    if (device) {
      setNumeroInventaire(device.numero_inventaire);
      setAnomalieConstatee(device.anomlie);
    }

    // Récupérer le nom de l'opérateur à partir du token JWT
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));  // Décoder le token JWT pour obtenir les infos
          setOperateur(payload.username);  // Enregistrer le nom de l'opérateur
        }

  }, [device]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const updatedAnomalies = {
      numero_inventaire: numero_inventaire,
      anomlie: anomlie,
      operateur: operateur,  // Ajout de l'opérateur ici
    };

    try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/anomlies`,
          updatedAnomalies,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      // Reset the form fields
      setNumeroInventaire('');
      setAnomalieConstatee('');
      setSuccessMessage('Enregistrement réussi');
      setFormVisible(false);
      setTimeout(() => {
        setSuccessMessage('');
        onSubmit();  // Call the onSubmit function passed as prop
        onCancel();
      }, 5000); // Delay of 2 seconds before calling onSubmit
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
  };

  return (
    <div>
    {showNavbar && <Navbar />}
    {formVisible && (
      <form onSubmit={handleSubmit}>
      <div className="titre_formulaire">Signaler une anomalie</div>
      <div className="form-container2">
        <div className="form-group">
           <input
              type="text"
              id="numero_inventaire"
              placeholder="Numero inventaire"
              value={numero_inventaire}
              onChange={(e) => setNumeroInventaire(e.target.value)}
              required
              disabled
           />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="anomlie"
            placeholder="Anomalie constatée"
            value={anomlie}
            onChange={(e) => setAnomalieConstatee(e.target.value)}
            required
          />
        </div>
        <div id="colB">
        <div id="colC"><button class="btn btn-lg btn-primary" type="submit">Enregistrer</button></div>
        <div id="colC"><button class="btn btn-lg btn-primary" type="button" onClick={onCancel}>Annuler</button></div>
        </div>
        </div>

      </form>
      )}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {showNavbar && <Footer />}
    </div>
  );
};

export default Anomalie;
