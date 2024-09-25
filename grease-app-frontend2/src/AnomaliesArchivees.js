import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { jwtDecode } from 'jwt-decode';
import './AnomaliesArchivees.css';  // Import the CSS file
import Footer from './Footer';
import * as XLSX from 'xlsx'; // Import de la bibliothèque xlsx

const AnomaliesArchivees = () => {
    const [anomlie, setAnomalie] = useState([]);
    // Obtenez la date d'aujourd'hui formatée en 'YYYY-MM-DD'
    const today = new Date().toISOString().split('T')[0];

    // Initialisez startDate et endDate avec la date d'aujourd'hui
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);



    useEffect(() => {
        fetchAnomalie();
      }, []);

      const fetchAnomalie = async () => {
            const token = localStorage.getItem('token');
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/anomliesavecdesignation`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              console.log(response.data);

              if (Array.isArray(response.data)) {
                const filteredOp = response.data.filter(anomlie => {
                const currentDate = new Date().toISOString().split('T')[0];;
                const dateAnomalie = new Date(anomlie.created_at).toISOString().split('T')[0];
                return dateAnomalie >= startDate && dateAnomalie <= endDate;
                });

                setAnomalie(filteredOp);

              } else {
                console.error('Response data is not an array: ', response.data);
                setAnomalie([]);
              }
            } catch (error) {
              console.error('Error fetching anomalie: ', error);
              setAnomalie([]);
            }
      };

      useEffect(() => {
              if (startDate && endDate) {
                  fetchAnomalie();
              }
      }, [startDate, endDate]);


      // Fonction d'exportation en CSV
          const exportToCSV = () => {
            if (anomlie.length === 0) {
              alert('Aucun appareil à exporter.');
              return;
            }

            const headers = [
              'N° inventaire',
              'Désignation',
              'Anomallie',
              'Date',
              'Opérateur',
              'Localisation',
              // Ajoutez d'autres champs si nécessaire
            ];

            const rows = anomlie.map(anom => [
              anom.numero_inventaire,
              anom.device_name,
              anom.anomlie,
              anom.created_at,
              anom.operateur,
              anom.equipement_localisation,
              // Ajoutez d'autres champs si nécessaire
            ]);

            const csvContent =
              'data:text/csv;charset=utf-8,' +
              [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            const today = new Date().toISOString().split('T')[0];
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `Anomalies_${today}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

          // Fonction d'exportation en Excel
          const exportToExcel = () => {
            if (anomlie.length === 0) {
              alert('Aucun appareil à exporter.');
              return;
            }

            const data = anomlie.map(anom => ({
              'N° inventaire': anom.numero_inventaire,
              'Désignation' : anom.device_name,
              'Anomallie' : anom.anomlie,
              'Date' : anom.created_at,
              'Opérateur': anom.operateur,
              'Localisation': anom.equipement_localisation,
              // Ajoutez d'autres champs si nécessaire
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Tournées archivées');

            XLSX.writeFile(workbook, `Anomalies_${new Date().toISOString().split('T')[0]}.xlsx`);
          };


      return(
         <div>
               <Navbar />
               <h2>Historique des anomalies</h2>
               <div className="date-filter">
                               <div className="date-input-container">
                                   <label>Du:</label>
                                   <input
                                       type="date"
                                       value={startDate}
                                       onChange={(e) => setStartDate(e.target.value)}
                                   />
                               </div>
                               <div className="date-input-container">
                                   <label>Au:</label>
                                   <input
                                       type="date"
                                       value={endDate}
                                       onChange={(e) => setEndDate(e.target.value)}
                                   />
                               </div>
               </div>
                      <div className="export-buttons">
                                               <div className="colExcel"><button class="btn btn-lg btn-primary" onClick={exportToCSV}>Exporter en CSV</button></div>
                                               <div className="colExcel"><button class="btn btn-lg btn-primary" onClick={exportToExcel}>Exporter en Excel</button></div>
                      </div>
               <table>
                       <thead>
                         <tr>
                           <th>N° inventaire</th>
                           <th>Désignation</th>
                           <th>Anomalie</th>
                           <th>Date</th>
                           <th>Opérateur</th>
                           <th>Localisation</th>
                         </tr>
                       </thead>
                       <tbody>
                         {anomlie.map((anom) => (
                           <tr key={anom.ID}>
                                 <td className="abc">{anom.numero_inventaire}</td>
                                 <td className="abc">{anom.device_name}</td>
                                 <td className="abc">{anom.anomlie}</td>
                                 <td className="abc">{anom.created_at}</td>
                                 <td className="abc">{anom.operateur}</td>
                                 <td className="abc">{anom.equipement_localisation}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
         <Footer />
         </div>

      );
};
export default AnomaliesArchivees;