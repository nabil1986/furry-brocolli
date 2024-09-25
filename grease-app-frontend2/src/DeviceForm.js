import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Webcam from 'react-webcam';
import './DeviceForm.css';  // Import the CSS file
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Footer from './Footer';
import Compressor from 'compressorjs';

const DeviceForm = ({ device, onSubmit, onCancel, showNavbar = true }) => {
  const [deviceName, setDeviceName] = useState(device ? device.device_name : '');
  const [gamme, setDeviceGamme] = useState(device ? device.gamme : '');

  const [greaseQuantity, setGreaseQuantity] = useState(device ? device.grease_quantity : '');
  const [huileQuantity, setHuileQuantity] = useState(device ? device.huile_quantity : '');

  const [greasePeriod0, setGreasePeriod0] = useState([]);
  const [greasePeriod, setGreasePeriod] = useState(device ? device.grease_period : ''); // New state for combobox

  const [huilePeriod, setHuilePeriod] = useState(device ? device.huile_periode : ''); // New state for combobox
  const [typeOrgane, setTypeOrgane] = useState(device ? device.type_organe : '');

  const [observation, setObservation] = useState(device ? device.observation : '');
  //const [levelControl, setLevelControl] = useState(device ? (device.niveau === 1 ? 'oui' : 'non') : 'non');
  const [numero_inventaire, setNumeroInventaire] = useState(device ? device.numero_inventaire : '');
  const [designations, setDesignations] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(device ? device.designation_grade_graisse : ''); // New state for combobox

  const [designationsH, setDesignationsH] = useState([]);
  const [selectedDesignationH, setSelectedDesignationH] = useState(device ? device.designation_grade_huile : ''); // New state for combobox

  const [etage, setEtage] = useState(0);

  const [ordrePassage, setordrePassage] = useState(device ? device.ordre_passage : '');
  const [typeControl0, setTypeControl0] = useState([]);
  const [typeControl, setTypeControl] = useState(device ? device.niveau : ''); // New state for combobox
  const [localisation0, setLocalisation0] = useState([]);
  const [localisation, setLocalisation] = useState(device ? device.equipement_localisation : ''); // New state for combobox
  const [tempsDeGraissage, setTempsDeGraissage] = useState(device ? device.tempsGraissage : '');
  const [formVisible, setFormVisible] = useState(true); // Add state to control form visibility
  const [successMessage, setSuccessMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // State for camera facing mode
  const [fileBase64, setFileBase64] = useState(null);

  //------------------------------------------------------------------------- Activer / Désactiver les champs
  const [greasePeriodEnabled, setGreasePeriodEnabled] = useState(false);
  const [gradeGraisseEnabled, setGradeGraisseEnabled] = useState(false);
  const [quantiteGraisseEnabled, setQuantiteGraisseEnabled] = useState(false);
  const [tempsGraisseEnabled, setTempsGraisseEnabled] = useState(false);

  const [huilePeriodEnabled, setHuilePeriodEnabled] = useState(false);
  const [gradeHuileEnabled, setGradeHuileEnabled] = useState(false);
  const [quantiteHuileEnabled, setQuantiteHuileEnabled] = useState(false);
  const [typeOrganeEnabled, setTypeOrganeEnabled] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false); // État pour désactiver le bouton


  const navigate = useNavigate(); // Initialize useNavigate
  const webcamRef = useRef(null);
  // Référence pour le champ file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDesignations();
    fetchDesignationsH();
    fetchGraissePeriode();
    fetchTypeControle();
    fetchEquipementLocalisation();
  }, []);

  useEffect(() => {
    if (device) {
      setDeviceName(device.device_name);
      setGreaseQuantity(device.grease_quantity);
      setTypeOrgane(device.type_organe);
      setHuileQuantity(device.huile_quantity);
      setGreasePeriod(device.grease_period);
      setHuilePeriod(device.huile_periode);
      setObservation(device.observation);
      setNumeroInventaire(device.numero_inventaire);
      //setLevelControl(device.niveau === 1 ? 'oui' : 'non');
      setSelectedDesignation(device.designation_grade_graisse);
      setSelectedDesignationH(device.designation_grade_huile);
      setTypeControl(device.niveau);
      setordrePassage(device.ordre_passage);
      setLocalisation(device.equipement_localisation);
      setTempsDeGraissage(device.tempsGraissage);
      setDeviceGamme(device.gamme);
      setEtage(device.etage); // Ajouter ceci pour gérer l'étage
    }
  }, [device]);

  const checkNumeroInventaireExists = async (numero_inventaire) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/devices/check-numero-inventaire`, {
        params: { numero_inventaire },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking numero inventaire: ', error);
      return false;
    }
  };

  const fetchDesignations = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/graisse`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDesignations(response.data);
    } catch (error) {
      console.error('Error fetching designations: ', error.response ? error.response.data : error.message);
    }
  };

  const fetchDesignationsH = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/huile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDesignationsH(response.data);
      } catch (error) {
        console.error('Error fetching designations: ', error.response ? error.response.data : error.message);
      }
    };

  const fetchGraissePeriode = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/graisse_periode`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGreasePeriod0(response.data);
    } catch (error) {
      console.error('Error fetching graisse periode: ', error.response ? error.response.data : error.message);
    }
  };

  const fetchTypeControle = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/typeControle`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data); // Vérifiez le contenu des données
        setTypeControl0(response.data);
      } catch (error) {
        console.error('Error fetching type controle: ', error.response ? error.response.data : error.message);
      }
  };

  const fetchEquipementLocalisation = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/localisationequipement`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(response.data); // Vérifiez le contenu des données
          setLocalisation0(response.data);
        } catch (error) {
          console.error('Error fetching type controle: ', error.response ? error.response.data : error.message);
        }
    };

  const compressImage = (image, callback) => {
    new Compressor(image, {
      quality: 0.6,  // Adjust the quality to 60%
      maxWidth: 1920, // Max width for resizing the image
      success(result) {
        // Additional check to ensure the size is under 500 KB
        if (result.size > 500 * 1024) { // Size > 500 KB
          new Compressor(result, {
            quality: 0.5, // Adjust quality further if needed
            success(newResult) {
              callback(newResult);
            },
            error(err) {
              console.error('Compression error:', err);
            }
          });
        } else {
          callback(result);
        }
      },
      error(err) {
        console.error('Compression error:', err);
      }
    });
  };

    const handleTakePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPhotoData(imageSrc);
        setShowCamera(false); // Hide the camera after taking the photo
    };

    const toggleCameraFacingMode = () => {
        setCameraFacingMode((prevMode) =>
          prevMode === 'user' ? 'environment' : 'user'
        );
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileBase64(reader.result);
        };
        reader.readAsDataURL(file); // Convertit le fichier en Data URL (Base64)
        console.log("okokok");
      }
    };

    // Fonction pour réinitialiser le fichier sélectionné
    const handleCancelFile = () => {
    setFileBase64(null); // Réinitialise le fichier sélectionné
    fileInputRef.current.value = ""; // Réinitialise la valeur du champ file input
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true); // Désactive le bouton au début de la soumission
    const token = localStorage.getItem('token');

    // Déterminez la valeur à utiliser pour `photo`
    const photoToSend = photoData ? photoData : (fileBase64 ? fileBase64 : null);
    const updatedDevice = {
      device_name: deviceName,
      grease_quantity: greaseQuantity === '' ? null : greaseQuantity,
      type_organe: typeOrgane === '' ? null : typeOrgane,
      huile_quantity: huileQuantity === '' ? null : huileQuantity,
      grease_period: greasePeriod === '' ? null : greasePeriod,
      huile_periode: huilePeriod === '' ? null : huilePeriod,
      observation: observation,
      numero_inventaire: numero_inventaire,
      designation_grade_graisse: selectedDesignation === '' ? null : selectedDesignation,
      designation_grade_huile: selectedDesignationH === '' ? null : selectedDesignationH,
      ordre_passage: ordrePassage,
      niveau: typeControl === '' ? null : typeControl,
      equipement_localisation: localisation === '' ? null : localisation,
      tempsGraissage: tempsDeGraissage === '' ? null : tempsDeGraissage,
      photo: photoToSend,
      gamme: gamme,
      etage: etage - 1
    };

    try {
      // Validation avant soumission
      if (!device) {
        const numeroExists = await checkNumeroInventaireExists(numero_inventaire);
        if (numeroExists) {
          alert('Ce numéro d inventaire existe déjà');
          return;
        }
      }

      if (etage === 0) {
        alert("Veuillez sélectionner un étage valide.");
        return;
      }

      // Envoyer la requête au backend
      if (device) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/devices/${device.id}`,
          updatedDevice,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/devices`,
          updatedDevice,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Réinitialisation du formulaire après la réponse du backend
      setDeviceName('');
      setGreaseQuantity('');
      setTypeOrgane('');
      setHuileQuantity('');
      setGreasePeriod('');
      setHuilePeriod('');
      setObservation('');
      setNumeroInventaire('');
      setSelectedDesignation('');
      setSelectedDesignationH('');
      setTypeControl('');
      setordrePassage('');
      setLocalisation('');
      setTempsDeGraissage('');
      setPhotoData(null);
      setFileBase64(null);
      setDeviceGamme('');
      setEtage('');
      setSuccessMessage('Enregistrement réussi');
      setFormVisible(false);

      // Délai avant redirection
      setTimeout(() => {
        setSuccessMessage('');
        if (onSubmit) {
          onSubmit(); // Si la fonction onSubmit est définie
        }
        navigate('/Home'); // Redirection après 2 secondes
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setIsSubmitting(false); // Réactive le bouton une fois la soumission terminée
  };


  return (
    <div>
      {showNavbar && <Navbar />}
      {formVisible && (
      <form onSubmit={handleSubmit}>
        <div className="titre_formulaire">{showNavbar ? 'Ajouter Equipement' : 'Modifier Equipement'}</div>
        <div className="form-container">
        <div className="column">
        <div className="form-group">
                  <input
                    type="text"
                    placeholder="N° inventaire"
                    id="numero_inventaire"
                    value={numero_inventaire}
                    onChange={(e) => setNumeroInventaire(e.target.value)}
                    required
                    disabled={!showNavbar}  // Disable if showNavbar is false
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Désignation"
                    id="deviceName"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    required
                  />
                </div>

               <div className="form-group">
                    <select
                    id="localisation"
                    value={localisation}
                    onChange={(e) => setLocalisation(e.target.value)}
                    >
                    <option value="">Sélectionnez une localisation</option>
                    {localisation0.map((local0, index) => (
                    <option key={index} value={local0.localisation}>
                    {local0.localisation}
                    </option>
                    ))}
                    </select>
                </div>

     <div className="form-group">
        <select id="etage" value={etage} onChange={(e) => setEtage(e.target.value)}>
          <option value={0}>Sélectionnez un étage</option>
          <option value={1}>RDC</option>
          <option value={2}>1er étage</option>
          <option value={3}>2ème étage</option>
          <option value={4}>3ème étage</option>
          <option value={5}>4ème étage</option>
        </select>
      </div>




                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Ordre de passage"
                    id="ordrePassage"
                    value={ordrePassage}
                    onChange={(e) => setordrePassage(e.target.value)}
                    required
                  />
                </div>


                 <div className="form-group">
                                          <select
                                                            id="typeControl"
                                                            value={typeControl}
                                                            onChange={(e) => {
                                                              setTypeControl(e.target.index);
                                                              if(e.target.selectedIndex === 1)
                                                              {
                                                               setHuilePeriodEnabled(true);
                                                               setGradeHuileEnabled(true);
                                                               setQuantiteHuileEnabled(true);
                                                               setTypeOrganeEnabled(true);

                                                               setGreasePeriodEnabled(false);
                                                               setGradeGraisseEnabled(false);
                                                               setQuantiteGraisseEnabled(false);
                                                               setTempsGraisseEnabled(false);

                                                               setGreaseQuantity('');
                                                               setTempsDeGraissage('');
                                                               setGreasePeriod('');
                                                               setSelectedDesignation('');
                                                              }
                                                              else if(e.target.selectedIndex === 2)
                                                              {
                                                               setHuilePeriodEnabled(false);
                                                               setGradeHuileEnabled(false);
                                                               setQuantiteHuileEnabled(false);
                                                               setTypeOrganeEnabled(false);

                                                               setGreasePeriodEnabled(true);
                                                               setGradeGraisseEnabled(true);
                                                               setQuantiteGraisseEnabled(true);
                                                               setTempsGraisseEnabled(true);

                                                               setTypeOrgane('');
                                                               setHuileQuantity('');
                                                               setHuilePeriod('');
                                                               setSelectedDesignationH('');
                                                              }
                                                              else if(e.target.selectedIndex === 3)
                                                              {
                                                               setHuilePeriodEnabled(true);
                                                               setGradeHuileEnabled(true);
                                                               setQuantiteHuileEnabled(true);
                                                               setTypeOrganeEnabled(true);

                                                               setGreasePeriodEnabled(false);
                                                               setGradeGraisseEnabled(false);
                                                               setQuantiteGraisseEnabled(false);
                                                               setTempsGraisseEnabled(false);

                                                               setGreaseQuantity('');
                                                               setTempsDeGraissage('');
                                                               setGreasePeriod('');
                                                               setSelectedDesignation('');
                                                              }
                                                              else if(e.target.selectedIndex === 4)
                                                              {
                                                               setHuilePeriodEnabled(true);
                                                               setGradeHuileEnabled(true);
                                                               setQuantiteHuileEnabled(true);
                                                               setTypeOrganeEnabled(true);

                                                               setGreasePeriodEnabled(true);
                                                               setGradeGraisseEnabled(true);
                                                               setQuantiteGraisseEnabled(true);
                                                               setTempsGraisseEnabled(true);
                                                              }
                                                              else if(e.target.selectedIndex === 5)
                                                              {
                                                               setHuilePeriodEnabled(true);
                                                               setGradeHuileEnabled(true);
                                                               setQuantiteHuileEnabled(true);
                                                               setTypeOrganeEnabled(true);

                                                               setGreasePeriodEnabled(true);
                                                               setGradeGraisseEnabled(true);
                                                               setQuantiteGraisseEnabled(true);
                                                               setTempsGraisseEnabled(true);
                                                              }
                                                              else
                                                              {
                                                               setHuilePeriodEnabled(false);
                                                               setGradeHuileEnabled(false);
                                                               setQuantiteHuileEnabled(false);
                                                               setTypeOrganeEnabled(false);

                                                               setGreasePeriodEnabled(false);
                                                               setGradeGraisseEnabled(false);
                                                               setQuantiteGraisseEnabled(false);
                                                               setTempsGraisseEnabled(false);
                                                              }
                                                            }}
                                          >
                                            <option value="">Sélectionnez un type d'opération</option>
                                            {typeControl0.map((type0, index) => (
                                              <option key={index} value={type0.type}>
                                                {type0.type}
                                              </option>
                                            ))}
                                          </select>
                </div>


                           <div className="form-group">
                                <select
                                  id="greasePeriod"
                                  value={greasePeriod}
                                  onChange={(e) => setGreasePeriod(e.target.value)}
                                  disabled={!greasePeriodEnabled} // Disable by default
                                  required={greasePeriodEnabled} // Required if enabled
                                >
                                  <option value="">Sélectionnez une fréquence de graissage</option>
                                  {greasePeriod0.map((greaseP0, index) => (
                                    <option key={index} value={greaseP0.periode}>
                                      {greaseP0.periode}
                                    </option>
                                  ))}
                                </select>
                           </div>

                <div className="form-group">
                  <select
                    id="selectedDesignation"
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                    disabled={!gradeGraisseEnabled} // Disable by default
                    required={gradeGraisseEnabled} // Required if enabled
                  >
                    <option value="">Sélectionnez une référence de graisse</option>
                    {designations.map((designation, index) => (
                      <option key={index} value={designation.designation_article}>
                        {designation.designation_article}
                      </option>
                    ))}
                  </select>
                </div>
                        <div className="form-group">
                          <input
                            type="number"
                            placeholder="Quantité de graisse (CP)"
                            id="greaseQuantity"
                            value={greaseQuantity}
                            onChange={(e) => setGreaseQuantity(parseFloat(e.target.value))}
                            disabled={!quantiteGraisseEnabled} // Disable by default
                            required={quantiteGraisseEnabled} // Required if enabled
                          />
                        </div>

                        <div className="form-group">
                          <input
                            type="number"
                            placeholder="Temps de graissage (min)"
                            id="tempsGraissage"
                            value={tempsDeGraissage}
                            onChange={(e) => setTempsDeGraissage(e.target.value)}
                            disabled={!tempsGraisseEnabled} // Disable by default
                            required={tempsGraisseEnabled} // Required if enabled
                          />
                        </div>

        </div>
        <div className="column">



                {/*<div className="form-group">
                  <label>Contrôle de Niveau</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="level_control"
                        value="oui"
                        checked={levelControl === 'oui'}
                        onChange={(e) => setLevelControl(e.target.value)}
                      />
                      Oui
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="level_control"
                        value="non"
                        checked={levelControl === 'non'}
                        onChange={(e) => setLevelControl(e.target.value)}
                      />
                      Non
                    </label>
                  </div>
                </div>*/}


                           <div className="form-group">
                                <select
                                  id="huilePeriod"
                                  value={huilePeriod}
                                  onChange={(e) => setHuilePeriod(e.target.value)}
                                  disabled={!huilePeriodEnabled} // Disable by default
                                  required={huilePeriodEnabled} // Required if enabled
                                >
                                  <option value="">Sélectionnez une fréquence de vidange</option>
                                  {greasePeriod0.map((greaseP0, index) => (
                                    <option key={index} value={greaseP0.periode}>
                                      {greaseP0.periode}
                                    </option>
                                  ))}
                                </select>
                           </div>

                 <div className="form-group">
                  <select
                    id="selectedDesignationH"
                    value={selectedDesignationH}
                    onChange={(e) => setSelectedDesignationH(e.target.value)}
                    disabled={!gradeHuileEnabled} // Disable by default
                    required={gradeHuileEnabled} // Required if enabled
                  >
                    <option value="">Sélectionnez une référence d'huile</option>
                    {designationsH.map((designationH, index) => (
                      <option key={index} value={designationH.designation_article}>
                        {designationH.designation_article}
                      </option>
                    ))}
                  </select>
                </div>

                        <div className="form-group">
                          <input
                            type="number"
                            placeholder="Quantité d'huile vidange (L)"
                            id="huileQuantity"
                            value={huileQuantity}
                            onChange={(e) => setHuileQuantity(parseFloat(e.target.value))}
                            disabled={!quantiteHuileEnabled} // Disable by default
                            required={quantiteHuileEnabled} // Required if enabled
                          />
                        </div>

                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Type d'organe"
                            id="typeOrgane"
                            value={typeOrgane}
                            onChange={(e) => setTypeOrgane(e.target.value)}
                            disabled={!typeOrganeEnabled} // Disable by default
                            required={typeOrganeEnabled} // Required if enabled
                          />
                        </div>


                <div className="form-group">
                                   <textarea
                                   id="gamme"
                                   placeholder="Gamme"
                                   value={gamme}
                                   onChange={(e) => setDeviceGamme(e.target.value)}
                                   />
                </div>

                <div className="form-group">
                          <textarea
                            id="observation"
                            placeholder="Commentaire"
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                          />
                </div>

                <div className="column" id="AAA">

                                            <div className="form-group">
                                              <input
                                                           type="file"
                                                           accept=".png,.jpg,.jpeg"
                                                           onChange={handleFileChange}
                                                           ref={fileInputRef} // Référence pour le champ input
                                              />
                                              {fileBase64 && (
                                              <div className="file-preview">
                                              <img src={fileBase64} className="DDD" alt="Selected file" />
                                              <button type="button" onClick={handleCancelFile}>
                                                      Annuler le fichier
                                              </button>
                                              </div>
                                              )}
                                              </div>

                                           {/* Camera and photo section */}
                                                                     <div className="form-group">
                                                                       <button type="button" onClick={() => setShowCamera(true)}>
                                                                         Prendre une photo
                                                                       </button>
                                                                       {showCamera && (
                                                                         <div>
                                                                           <Webcam
                                                                             audio={false}
                                                                             ref={webcamRef}
                                                                             screenshotFormat="image/jpeg"
                                                                             videoConstraints={{ facingMode: cameraFacingMode }}
                                                                             style={{ width: '100%', marginBottom: '10px' }}
                                                                           />
                                                                           <button type="button" onClick={handleTakePhoto}>
                                                                             Prendre la photo
                                                                           </button>
                                                                           <button type="button" onClick={toggleCameraFacingMode}>
                                                                             Changer de caméra
                                                                           </button>
                                                                           <button
                                                                                     type="button"
                                                                                     className="btn btn-secondary"
                                                                                     onClick={() => {
                                                                                       setShowCamera(false);
                                                                                       setPhotoData(null); // Reset photo data
                                                                                     }}
                                                                                   >
                                                                                     Annuler
                                                                           </button>
                                                                         </div>
                                                                       )}
                                                                       {photoData && (
                                                                         <div>
                                                                           <img src={photoData} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />
                                                                           <button type="button" onClick={() => setPhotoData(null)}>
                                                                             Supprimer la photo
                                                                           </button>
                                                                         </div>
                                                                       )}

                                                                 </div>


                                      </div>
                                      <div id="colB">
                                        <div className="form-group" id="colC">
                                          <button type="submit" className={isSubmitting ? 'button-disabled' : 'button'}  disabled={isSubmitting}>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</button>
                                        </div>

                                        {/* Masquer le bouton "Annuler" si showNavbar est true */}
                                        {!showNavbar && (
                                          <div className="form-group" id="colC">
                                            <button type="button" onClick={onCancel}>Annuler</button>
                                          </div>
                                        )}
                                      </div>
        </div>
      </div>

      </form>
      )}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {showNavbar && <Footer />}
    </div>
  );
};

export default DeviceForm;
