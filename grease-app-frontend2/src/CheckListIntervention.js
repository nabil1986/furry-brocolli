import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './CheckListIntervention.css';  // Import the CSS file
import Footer from './Footer';
import Anomalie from './Anomalie';  // Import Anomalie component

const CheckListIntervention = ({ device, onSubmit, onCancel, showNavbar }) => {
  const [formData, setFormData] = useState({
    numero_inventaire: device.numero_inventaire || '',
    device_name: device.device_name || '',
    anomalie_constatee: '',
    anomalie_constatee2: '',
    operateur: '',
    etage: device.etage || '',
    photo: device.photo || '',
    equipement_localisation: device.equipement_localisation || '',
    ordre_passage: device.ordre_passage || '',
    date_prochain_graissage: device.date_prochain_graissage || '',
    grease_period: device.grease_period || '',
    niveau: device.niveau || '',
    designation_grade_graisse: device.designation_grade_graisse || '',
    designation_grade_huile: device.designation_grade_huile || '',
    grease_quantity: device.grease_quantity || '',
    tempsGraissage: device.tempsGraissage || '',
    gamme: device.gamme || '',
    observation: device.observation || '',
  });

  const [showAnomalieForm, setShowAnomalieForm] = useState(false);  // State to control visibility of Anomalie form

  useEffect(() => {
    if (device) {
      setFormData((prevData) => ({
        ...prevData,
        numero_inventaire: device.numero_inventaire || '',
        device_name: device.device_name || '',
        etage: device.etage || '',
        photo: device.photo || '',
        equipement_localisation: device.equipement_localisation || '',
        ordre_passage: device.ordre_passage || '',
        date_prochain_graissage: device.date_prochain_graissage || '',
        grease_period: device.grease_period || '',
        niveau: device.niveau || '',
        designation_grade_graisse: device.designation_grade_graisse || '',
        designation_grade_huile: device.designation_grade_huile || '',
        grease_quantity: device.grease_quantity || '',
        tempsGraissage: device.tempsGraissage || '',
        gamme: device.gamme || '',
        observation: device.observation || '',
      }));
    }

    const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setFormData((prevData) => ({
            ...prevData,
            operateur: payload.username,  // Récupérer le nom de l'opérateur à partir du token
          }));
        }
  }, [device]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // Soumission de l'opération de graissage
      await axios.post(
        `${process.env.REACT_APP_API_URL}/operationgraissage`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mise à jour de la date de prochain graissage
      await axios.put(
        `${process.env.REACT_APP_API_URL}/devices/${device.id}/date-prochain-graissage`,
        {},  // Aucune donnée à envoyer car grease_period est géré par le backend
        { headers: { Authorization: `Bearer ${token}` } }
      );

      {/*// Soumission de l'anomalie dans la table anomlies
            const anomalyData = {
              numero_inventaire: formData.numero_inventaire,
              anomlie: formData.anomalie_constatee2,
              operateur: formData.operateur
            };

            await axios.post(
              `${process.env.REACT_APP_API_URL}/anomlies`,
              anomalyData,
              { headers: { Authorization: `Bearer ${token}` } }
            );*/}

      onSubmit();
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
  };

   const handleSignalError = () => {
      setShowAnomalieForm(true); // Show the Anomalie form and hide CheckListIntervention
    };

    const handleAnomalieSubmit = () => {
      setShowAnomalieForm(false); // Hide the Anomalie form and show CheckListIntervention again
    };

    const handleAnomalieCancel = () => {
      setShowAnomalieForm(false); // Hide the Anomalie form and show CheckListIntervention again
    };

  return (
  <div>
  {showAnomalieForm ? (
          <Anomalie
            device={device}
            onSubmit={handleAnomalieSubmit}
            onCancel={handleAnomalieCancel}
            showNavbar={false}
          />
  ) : (
  <>
  <h3>Rapport de visite</h3>
  <div className="form-container2">
      {showNavbar && <Navbar />}

      <form onSubmit={handleSubmit}>

        <div className="ContainrColumns">
           <div className="col">
                {formData.photo && (
                     <div className="photo-container">
                     <img src={formData.photo} alt="Photo de l'équipement" className="device-photo" />
                     </div>
                )}
           </div>

           <div className="col">
                                <p><strong>Numéro d inventaire :</strong> {formData.numero_inventaire || 'NA'}</p>
                                <p><strong>Désignation :</strong> {formData.device_name || 'NA'}</p>
                                <p><strong>Localisation :</strong> {formData.equipement_localisation || 'NA'}</p>
                                <p><strong>Etage :</strong> {formData.etage || 'NA'}</p>
                                <p><strong>Ordre de passage :</strong> {formData.ordre_passage || 'NA'}</p>
           </div>

           <div className="col">
                                <p>
                                  <strong>Echéance de visite :</strong>
                                  <span
                                    style={{
                                      color: formData.date_prochain_graissage && new Date(formData.date_prochain_graissage) <= new Date() ? 'red' : 'black'
                                    }}>
                                    {formData.date_prochain_graissage ? new Date(formData.date_prochain_graissage).toLocaleDateString() : 'NA'}
                                  </span>
                                </p>
                                <p><strong>Périodicité :</strong> {formData.grease_period || 'NA'}</p>
                                <p><strong>Type de controle :</strong> {formData.niveau || 'NA'}</p>
                                <p><strong>Réf Graisse :</strong> {formData.designation_grade_graisse || 'NA'} <strong> - Réf Huile :</strong> {formData.designation_grade_huile || 'NA'}</p>
           </div>

           <div className="col">
                                <p><strong>Quantité graisse (CP) :</strong> {formData.grease_quantity || 'NA'} <strong> - Temps graissage (min) :</strong> {formData.tempsGraissage || 'NA'}</p>
                                <p><strong>Gamme :</strong> {formData.gamme || 'NA'}</p>
                                <p><strong>Commentaire :</strong> {formData.observation || 'NA'}</p>
           </div>
        </div>

        <div>
          <textarea id="BBB"
            name="anomalie_constatee"
            placeholder="Compte rendu"
            value={formData.anomalie_constatee}
            onChange={handleChange}
          />
        </div>
        <div className="colC">
        <button type="button" onClick={handleSignalError}>Signaler anomalie</button> {/* Bouton pour signaler une anomalie */}
        </div>
        <div className="colB">
        <div className="colC">
        <button type="submit">Enregistrer</button>
        </div>
        <div className="colC">
        <button type="button" onClick={onCancel} >Annuler</button>
        </div>
        </div>

      </form>

      {showNavbar && <Footer />}
                </div>
              </>
            )}
          </div>
        );
      };

export default CheckListIntervention;
