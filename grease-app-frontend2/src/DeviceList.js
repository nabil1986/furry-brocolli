import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import DeviceForm from './DeviceForm';
import Anomalies from './Anomalie';
import './DeviceList.css';  // Import the CSS file
import { jwtDecode } from 'jwt-decode';
import Footer from './Footer';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [editingDevice, setEditingDevice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsDevice, setDetailsDevice] = useState(null);
  const [anomalie, setAnomalie] = useState(null);
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');
  const formRef = useRef(null); // Reference for the form
  const detailsRef = useRef(null); // Reference for the details
  const anomalieRef = useRef(null); // Reference for the anomallie
  const [typeUser, setTypeUser] = useState('');
  const [showModal, setShowModal] = useState(false); // State for showing modal
  const [deviceToDelete, setDeviceToDelete] = useState(null); // State for the device to be deleted

  useEffect(() => {
    fetchDevices();
    checkUserType();
  }, []);

  useEffect(() => {
      if (editingDevice && formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [editingDevice]);

    useEffect(() => {
      if (detailsDevice && detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [detailsDevice]);

  const fetchDevices = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/devices`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices: ', error);
    }
  };

  const checkUserType = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        setTypeUser(decodedToken.typeUser);
      }
    };

  const handleEdit = (device) => {
    setEditingDevice(device);
  };

  const handleCancel = () => {
        setEditingDevice(null);
        setAnomalie(null);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/devices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDevices();
    } catch (error) {
      console.error('Error deleting device: ', error);
    }
  };

  const openModal = (device) => {
      setDeviceToDelete(device);
      setShowModal(true);
  };

  const closeModal = () => {
      setShowModal(false);
      setDeviceToDelete(null);
  };

  const confirmDelete = () => {
      if (deviceToDelete) {
        handleDelete(deviceToDelete.id);
      }
      closeModal();
  };

  const handleDetails = (device) => {
      setDetailsDevice(device);
  };

  const handleAnomalie = (device) => {
        setAnomalie(device);
    };

  const filteredDevices = devices.filter(device =>
    device.device_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDevicesByInventoryNamme = devices.filter(device =>
    device.numero_inventaire.toLowerCase().includes(inventorySearchTerm.toLowerCase())
  );

  const handleFormSubmit = () => {
      setEditingDevice(null);
      fetchDevices();
  };

  const handleAnomalieSubmit = () => {
        setAnomalie(null);
        fetchDevices();
  };

  const handleSearchTermChange = (e) => {
      setSearchTerm(e.target.value);
      setInventorySearchTerm('');  // Effacer le contenu de la barre de recherche par numéro d'inventaire
      setDetailsDevice(null);
      setAnomalie(null);
  };

  const handleSearchTermChangeParNumeroInventaire = (e) => {
        setInventorySearchTerm(e.target.value);
        setSearchTerm('');  // Effacer le contenu de la barre de recherche par désignation
        setDetailsDevice(null);
        setAnomalie(null);
    };

  return (
    <div>
    <Navbar />
    {/* Affiche la table uniquement si editingDevice est null */}
    {!editingDevice && !detailsDevice && !anomalie &&(
    <div>
      <h2>Liste des équipements</h2>
      <div className="recherche">
        <input
                type="text"
                placeholder="Rechercher par désignation"
                value={searchTerm}
                onChange={handleSearchTermChange}
                className="search-bar"
        />
        <input
                      type="text"
                      placeholder="Rechercher par numéro d'inventaire"
                      value={inventorySearchTerm}
                      onChange={handleSearchTermChangeParNumeroInventaire}
                      className="search-bar"
        />
      </div>
      {searchTerm && (
      <table class="table table-hover">
        <thead>
          <tr>
            <th>N° d'inventaire</th>
            <th>Désignation</th>
            <th>Localisation</th>
            <th>Etage</th>
            <th>Echéance graissage</th>
            <th>Echéance vidange</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((device) => (
            <tr key={device.id}>
              <td className="abc">{device.numero_inventaire}</td>
              <td className="abc">{device.device_name}</td>
              <td className="abc">{device.equipement_localisation}</td>
              <td className="abc">{device.etage}</td>
              <td className="abc">{device.date_prochain_graissage ? new Date(device.date_prochain_graissage).toLocaleDateString('fr-FR') : 'N/A'}</td>
              <td className="abc">{device.date_prochain_vidange ? new Date(device.date_prochain_vidange).toLocaleDateString('fr-FR') : 'N/A'}</td>
              <td className="actions-cell" className="abc">
              {typeUser === 'administrateur' && (
                <>
                <button onClick={() => handleEdit(device)}>Modifier</button>
                {/*<button onClick={() => handleDelete(device.id)}>Supprimer</button>*/}
                <button onClick={() => openModal(device)}>Supprimer</button>
                </>
              )}
                <button onClick={() => handleDetails(device)}>Afficher les détails</button>
                <button onClick={() => handleAnomalie(device)}>Signaler anomalie</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      {inventorySearchTerm && (
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>N° d'inventaire</th>
                  <th>Désignation</th>
                  <th>Localisation</th>
                  <th>Etage</th>
                  <th>Echéance graissage</th>
                  <th>Echéance vidange</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevicesByInventoryNamme.map((device) => (
                            <tr key={device.id}>
                              <td className="abc">{device.numero_inventaire || 'N/A'}</td>
                              <td className="abc">{device.device_name || 'N/A'}</td>
                              <td className="abc">{device.equipement_localisation || 'N/A'}</td>
                              <td className="abc">{device.etage || 'N/A'}</td>
                              <td className="abc">{device.date_prochain_graissage ? new Date(device.date_prochain_graissage).toLocaleDateString('fr-FR') : 'N/A'}</td>
                              <td className="abc">{device.date_prochain_vidange ? new Date(device.date_prochain_vidange).toLocaleDateString('fr-FR') : 'N/A'}</td>
                              <td className="abc">
                              {typeUser === 'administrateur' && (
                                <>
                                <button onClick={() => handleEdit(device)}>Modifier</button>
                                {/*<button onClick={() => handleDelete(device.id)}>Supprimer</button>*/}
                                <button onClick={() => openModal(device)}>Supprimer</button>
                                </>
                              )}
                                <button onClick={() => handleDetails(device)}>Afficher les détails</button>
                                <button onClick={() => handleAnomalie(device)}>Signaler anomalie</button>
                              </td>
                            </tr>
                          ))}
              </tbody>
            </table>
            )}
            </div>
            )}
      {editingDevice && (
              <div ref={formRef}>
              <DeviceForm
                device={editingDevice}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                showNavbar={false} // Passez false pour masquer la Navbar
              />
              </div>
      )}
      {anomalie && (
              <div ref={anomalieRef}>
              <Anomalies
                device={anomalie}
                onSubmit={handleAnomalieSubmit}
                onCancel={handleCancel}
                showNavbar={false} // Passez false pour masquer la Navbar
              />
              </div>
      )}
      {detailsDevice &&
      (
              <div ref={detailsRef} className="details-card">
                <h3>Fiche équipement</h3>
                <div className="ContainrColumns">
                           <div className="col">
                                {detailsDevice.photo && (
                                     <div className="photo-container">
                                     <img src={detailsDevice.photo} alt="Photo de l'équipement" className="device-photo" />
                                     </div>
                                )}
                           </div>

                           <div className="col">
                                                <p><strong>Numéro d inventaire :</strong> {detailsDevice.numero_inventaire || 'NA'}</p>
                                                <p><strong>Désignation :</strong> {detailsDevice.device_name || 'NA'}</p>
                                                <p><strong>Localisation :</strong> {detailsDevice.equipement_localisation || 'NA'}</p>
                                                <p><strong>Etage :</strong> {detailsDevice.etage || 'NA'}</p>
                                                <p><strong>Ordre de passage :</strong> {detailsDevice.ordre_passage || 'NA'}</p>
                           </div>

                           <div className="col">
                                                <p>
                                                  <strong>Echéance de visite :</strong>
                                                  <span
                                                    style={{
                                                      color: detailsDevice.date_prochain_graissage && new Date(detailsDevice.date_prochain_graissage) <= new Date() ? 'red' : 'black'
                                                    }}>
                                                    {detailsDevice.date_prochain_graissage ? new Date(detailsDevice.date_prochain_graissage).toLocaleDateString() : 'NA'}
                                                  </span>
                                                </p>
                                                <p><strong>Fréquence de visite :</strong> {detailsDevice.grease_period || 'NA'}</p>
                                                <p><strong>Type de controle :</strong> {detailsDevice.niveau || 'NA'}</p>
                                                <p><strong>Réf Graisse :</strong> {detailsDevice.designation_grade_graisse || 'NA'} <strong> - Réf Huile :</strong> {detailsDevice.designation_grade_huile || 'NA'}</p>
                           </div>

                           <div className="col">
                                                <p><strong>Quantité graisse (CP) :</strong> {detailsDevice.grease_quantity || 'NA'} <strong> - Temps graissage (min) :</strong> {detailsDevice.tempsGraissage || 'NA'}</p>
                                                <p><strong>Gamme :</strong> {detailsDevice.gamme || 'NA'}</p>
                                                <p><strong>Commentaire :</strong> {detailsDevice.observation || 'NA'}</p>
                           </div>
                        </div>


                        <div className="colB">
                        <div className="colC">
                        <button onClick={() => setDetailsDevice(null)}>Fermer</button>
                        </div>
                        </div>

              </div>
            )


      }
            {showModal && (
                    <div className="modal">
                      <div className="modal-content">
                        <h3>Êtes-vous sûr de vouloir supprimer cet équipement ?</h3>
                        <div className="modal-buttons">
                          <div className="col1">
                          <div id="AAA"><button onClick={confirmDelete}>Oui</button></div>
                          <div id="AAA"><button onClick={closeModal}>Non</button></div>
                          </div>
                        </div>
                      </div>
                    </div>
            )}
      <Footer />
    </div>
  );
};

export default DeviceList;
