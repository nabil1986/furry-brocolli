import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import CheckListInterventionVidange from './CheckListInterventionVidange';
import './DeviceList.css';  // Import the CSS file
import './PlanningVidange.css';  // Import the CSS file
import { jwtDecode } from 'jwt-decode';
import Footer from './Footer';
import * as XLSX from 'xlsx'; // Import de la bibliothèque xlsx

const PlanningList = () => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]); // New state for filtered devices
  const [editingDevice, setEditingDevice] = useState(null);
  const [detailsDevice, setDetailsDevice] = useState(null);
  const formRef = useRef(null); // Reference for the form
  const detailsRef = useRef(null); // Reference for the details
  const [typeUser, setTypeUser] = useState('');
  const [progress, setProgress] = useState(0); // State for progress percentage
  const [searchDesignation, setSearchDesignation] = useState(''); // New state for search by designation
  const [searchInventoryNumber, setSearchInventoryNumber] = useState(''); // New state for search by inventory number

  useEffect(() => {
    fetchDevices();
    checkUserType();
    fetchOperations();
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

  useEffect(() => {
      // Filter devices whenever search inputs change
      filterDevices();
  }, [searchDesignation, searchInventoryNumber, devices]);

  const fetchDevices = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/devices`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(response.data)) {
          const filteredDevices = response.data.filter(device => {
          if (!device.date_prochain_vidange) {
                            // Exclure les appareils avec une date_prochain_vidange null ou vide
                            return false;
          }
            const currentDate = new Date();
            const prochainVidangeDate = new Date(device.date_prochain_vidange);
            // Vérifier si la date est valide
            if (isNaN(prochainVidangeDate)) {
                              return false; // Exclure les appareils avec une date invalide
            }
            return currentDate >= prochainVidangeDate;
          });
          // Sort devices by ordre_passage
          const sortedDevices = filteredDevices.sort((a, b) => a.ordre_passage - b.ordre_passage);
          setDevices(sortedDevices);
          setFilteredDevices(sortedDevices); // Initialize filteredDevices with all devices

          // Compter le nombre d'éléments dans sortedDevices
                const deviceCount = sortedDevices.length;
                console.log('Nombre d\'appareils:', deviceCount);
                // Fetch operations and calculate progress
                fetchOperations(deviceCount);

        } else {
          console.error('Response data is not an array: ', response.data);
          setDevices([]);
        }
      } catch (error) {
        console.error('Error fetching devices: ', error);
        setDevices([]);
      }
    };

        const fetchOperations = async (deviceCount) => {
          const token = localStorage.getItem('token');
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/operationvidange`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data)) {
              const today = new Date().toISOString().split('T')[0];
              const todayOperations = response.data.filter(operation => {
              {/*if (!operation.date_operationVidange) {
                                // Exclure les opérations avec une date null ou vide
                                return false;
              }*/}
                const operationDate = new Date(operation.date_operationVidange).toISOString().split('T')[0];
                // Vérifier si la date est valide
                {/*if (isNaN(operationDate)) {
                                      return false; // Exclure les opérations avec une date invalide
                }*/}
                return operationDate === today;
              });

              // Compter le nombre d'éléments dans sortedDevices
              const opCount = todayOperations.length;
              console.log('Nombre d\'operations:', opCount);
              // Calculate progress percentage
              const progressPercentage = deviceCount > 0 ? (opCount / ( deviceCount + opCount ) ) * 100 : 0;
              setProgress(progressPercentage);
            } else {
              console.error('Response data is not an array: ', response.data);
            }
          } catch (error) {
            console.error('Error fetching operations: ', error);
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

  const handleDetails = (device) => {
    setDetailsDevice(device);
  };

  const handleCancel = () => {
      setEditingDevice(null);
  };

  const handleFormSubmit = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Défilement en haut de la page
    setEditingDevice(null);
    fetchDevices();
    fetchOperations();
  };

  // Fonction d'exportation en CSV
    const exportToCSV = () => {
      if (devices.length === 0) {
        alert('Aucun appareil à exporter.');
        return;
      }

      const headers = [
        'Date',
        'N° inventaire',
        'Désignation',
        'Localisation',
        'Étage',
        'Ordre de passage',
        // Ajoutez d'autres champs si nécessaire
      ];

      const rows = devices.map(device => [
        device.date_prochain_vidange
          ? new Date(device.date_prochain_vidange).toLocaleDateString('fr-FR')
          : 'NA',
        device.numero_inventaire,
        device.device_name,
        device.equipement_localisation,
        device.etage,
        device.ordre_passage,
        // Ajoutez d'autres champs si nécessaire
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      const today = new Date().toISOString().split('T')[0];
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `planning_du_jour_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Fonction d'exportation en Excel
    const exportToExcel = () => {
      if (devices.length === 0) {
        alert('Aucun appareil à exporter.');
        return;
      }

      const data = devices.map(device => ({
        'Date': device.date_prochain_vidange
          ? new Date(device.date_prochain_vidange).toLocaleDateString('fr-FR')
          : 'NA',
        'N° inventaire': device.numero_inventaire,
        'Désignation': device.device_name,
        'Localisation': device.equipement_localisation,
        'Étage': device.etage,
        'Ordre de passage': device.ordre_passage,
        // Ajoutez d'autres champs si nécessaire
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning du jour');

      XLSX.writeFile(workbook, `planning_du_jour_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const filterDevices = () => {
        const filtered = devices.filter(device => {
          return (
            device.device_name.toLowerCase().includes(searchDesignation.toLowerCase()) &&
            device.numero_inventaire.toLowerCase().includes(searchInventoryNumber.toLowerCase())
          );
        });
        setFilteredDevices(filtered);
    };

  return (
    <div>
      <Navbar />



      {/* Affiche la table uniquement si editingDevice est null */}
      {!editingDevice && !detailsDevice && (
      <div>
      <h2>Planning VIDANGE du jour</h2>

      <div className="search-container">
                  <div className="recherche"><input
                    type="text"
                    placeholder="Rechercher par désignation"
                    value={searchDesignation}
                    onChange={(e) => setSearchDesignation(e.target.value)}
                    className="search-input"
                  /></div>
                  <div className="recherche"><input
                    type="text"
                    placeholder="Rechercher par n° inventaire"
                    value={searchInventoryNumber}
                    onChange={(e) => setSearchInventoryNumber(e.target.value)}
                    className="search-input"
                  /></div>
      </div>

      <div className="progress-container">
        <div className="progress-bar-background">
          <div className="progress-bar-fill" style={{ width: `${progress.toFixed(2)}%` }}>
            <span className="progress-label">{progress.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="export-buttons">
                          <div className="colExcel"><button onClick={exportToCSV}>Exporter en CSV</button></div>
                          <div className="colExcel"><button onClick={exportToExcel}>Exporter en Excel</button></div>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th></th>
            <th>Date</th>
            <th>N° inventaire</th>
            <th>Désignation</th>
            <th>Localisation</th>
            <th>Etage</th>
            <th>Ordre de passage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((device) => (
            <tr key={device.id}>
              <td className="abc"><img src={device.photo} className="device-photo" /></td>
              <td className="abc">{new Date(device.date_prochain_vidange).toLocaleDateString('fr-FR')}</td>
              <td className="abc">{device.numero_inventaire}</td>
              <td className="abc">{device.device_name}</td>
              <td className="abc">{device.equipement_localisation}</td>
              <td className="abc">{device.etage}</td>
              <td className="abc">{device.ordre_passage}</td>
              <td className="actions-cell">
                <button onClick={() => handleEdit(device)}>Intervention vidange</button>
                {/*<button onClick={() => handleDetails(device)}>Fiche équipement</button>*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      </div>
      )}
      {editingDevice && (
        <div ref={formRef}>
          <CheckListInterventionVidange
            device={editingDevice}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            showNavbar={false} // Passez false pour masquer la Navbar
          />
        </div>
      )}
      {detailsDevice && (
        <div ref={detailsRef} className="details-card">
          <h3>Fiche équipement</h3>
          <div className="ContainrColumns">
                     <div className="col">
                          {detailsDevice.photo && (
                               <div className="photo-container">
                               <img src={detailsDevice.photo} alt="Photo de l'équipement" className="device-photo-planning" />
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
                                                color: detailsDevice.date_prochain_vidange && new Date(detailsDevice.date_prochain_vidange) <= new Date() ? 'red' : 'black'
                                              }}>
                                              {detailsDevice.date_prochain_vidange ? new Date(detailsDevice.date_prochain_vidange).toLocaleDateString() : 'NA'}
                                            </span>
                                          </p>
                                          <p><strong>Fréquence de visite :</strong> {detailsDevice.grease_period || 'NA'}</p>
                                          <p><strong>Type de controle :</strong> {detailsDevice.niveau || 'NA'}</p>
                                          <p><strong>Réf Graisse :</strong> {detailsDevice.designation_grade_graisse || 'NA'} <strong> - Réf Huile :</strong> {detailsDevice.designation_grade_huile || 'NA'}</p>
                     </div>

                     <div className="col">
                                          <p><strong>Quantité huile (L) :</strong> {detailsDevice.grease_quantity || 'NA'} <strong> - Type organe :</strong> {detailsDevice.type_organe || 'NA'}</p>
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
      )}
     <Footer />
    </div>
  );
};

export default PlanningList;
