import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { jwtDecode } from 'jwt-decode';
import './TourneesArchivees.css';  // Import the CSS file
import Footer from './Footer';
import * as XLSX from 'xlsx'; // Import de la bibliothèque xlsx

const TourneesArchivees = () => {
    const [operationgraissage, setOperationgraissage] = useState([]);
    // Obtenez la date d'aujourd'hui formatée en 'YYYY-MM-DD'
    const today = new Date().toISOString().split('T')[0];

    // Initialisez startDate et endDate avec la date d'aujourd'hui
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    useEffect(() => {
        fetchOperationgraissage();
      }, []);

      const fetchOperationgraissage = async () => {
            const token = localStorage.getItem('token');
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/operationgraissageavecdesignation`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (Array.isArray(response.data)) {
                const filteredOp = response.data.filter(operationgraissage => {
                const currentDate = new Date().toISOString().split('T')[0];;
                const dateTournee = new Date(operationgraissage.date_operationGraissage).toISOString().split('T')[0];
                return dateTournee >= startDate && dateTournee <= endDate;
                });

                setOperationgraissage(filteredOp);

              } else {
                console.error('Response data is not an array: ', response.data);
                setOperationgraissage([]);
              }
            } catch (error) {
              console.error('Error fetching operation de graissage: ', error);
              setOperationgraissage([]);
            }
      };

      useEffect(() => {
              if (startDate && endDate) {
                  fetchOperationgraissage();
              }
      }, [startDate, endDate]);


      // Fonction d'exportation en CSV
          const exportToCSV = () => {
            if (operationgraissage.length === 0) {
              alert('Aucun appareil à exporter.');
              return;
            }

            const headers = [
              'N° inventaire',
              'Désignation',
              'Localisation',
              'Etage',
              'Compte rendu',
              'Opérateur',
              // Ajoutez d'autres champs si nécessaire
            ];

            const rows = operationgraissage.map(opGraiss => [
              opGraiss.numero_inventaire,
              opGraiss.device_name,
              opGraiss.equipement_localisation,
              opGraiss.etage,
              opGraiss.anomalie_constatee,
              opGraiss.operateur,
              // Ajoutez d'autres champs si nécessaire
            ]);

            const csvContent =
              'data:text/csv;charset=utf-8,' +
              [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            const today = new Date().toISOString().split('T')[0];
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `Tournées_archivées_${today}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

          // Fonction d'exportation en Excel
          const exportToExcel = () => {
            if (operationgraissage.length === 0) {
              alert('Aucun appareil à exporter.');
              return;
            }

            const data = operationgraissage.map(opGraiss => ({
              'N° inventaire': opGraiss.numero_inventaire,
              'Désignation' : opGraiss.device_name,
              'Localisation' : opGraiss.equipement_localisation,
              'Etage' : opGraiss.etage,
              'Compte rendu': opGraiss.anomalie_constatee,
              'Opérateur': opGraiss.operateur,
              // Ajoutez d'autres champs si nécessaire
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Tournées archivées');

            XLSX.writeFile(workbook, `Tournées_archivées_${new Date().toISOString().split('T')[0]}.xlsx`);
          };


      return(
         <div>

               <Navbar />
               <h2>Historique des tournées</h2>
               <div className="date-filter">

                               <div className="date-input-container">
                                   <label>Du:</label>
                                   <input
                                       type="date"
                                       class="date-field"
                                       value={startDate}
                                       onChange={(e) => setStartDate(e.target.value)}
                                   />
                               </div>
                               <div className="date-input-container">
                                   <label>Au:</label>
                                   <input
                                       type="date"
                                       class="date-field"
                                       value={endDate}
                                       onChange={(e) => setEndDate(e.target.value)}
                                   />
                               </div>
               </div>
               <div className="export-buttons">
                        <div className="colExcel"><button onClick={exportToCSV}>Exporter en CSV</button></div>
                        <div className="colExcel"><button onClick={exportToExcel}>Exporter en Excel</button></div>
               </div>
               <table>
                       <thead>
                         <tr>
                           <th>N° inventaire</th>
                           <th>Désignation</th>
                           <th>Localisation</th>
                           <th>Etage</th>
                           <th>Compte rendu</th>
                           <th>Opérateur</th>
                         </tr>
                       </thead>
                       <tbody>
                         {operationgraissage.map((opGraiss) => (
                           <tr key={opGraiss.id}>
                                 <td className="abc">{opGraiss.numero_inventaire}</td>
                                 <td className="abc">{opGraiss.device_name}</td>
                                 <td className="abc">{opGraiss.equipement_localisation}</td>
                                 <td className="abc">{opGraiss.etage}</td>
                                 <td className="abc">{opGraiss.anomalie_constatee}</td>
                                 <td className="abc">{opGraiss.operateur}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
         <Footer />
         </div>

      );
};
export default TourneesArchivees;