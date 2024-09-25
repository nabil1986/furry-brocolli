import axios from 'axios';
import Navbar from './Navbar';
import './Home.css';  // Import the CSS file
import Footer from './Footer';
import { useState, useEffect } from 'react';

const Home = () => {

      const [deviceCountToday, setDeviceCountToday] = useState(0);
      const [opCountToday, setOpCountToday] = useState(0);
      const [deviceCountRetard, setDeviceCountRetard] = useState(0);

      const [deviceCountTodayVidange, setDeviceCountTodayVidange] = useState(0);
      const [opCountTodayVidange, setOpCountTodayVidange] = useState(0);
      const [deviceCountRetardVidange, setDeviceCountRetardVidange] = useState(0);

      useEffect(() => {
        fetchDevicesToday();
        fetchDevicesRetard();
        fetchOperationsToday();

        fetchDevicesTodayVidange();
        fetchDevicesRetardVidange();
        fetchOperationsTodayVidange();
    }, []);

//---------------------------------- Graissage

    const fetchDevicesToday = async () => {
          const token = localStorage.getItem('token');
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/devices`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data)) {
              const filteredDevices = response.data.filter(device => {
              if (!device.date_prochain_graissage) {
                                // Exclure les appareils avec une date_prochain_graissage null ou vide
                                return false;
              }
                const currentDate = new Date();
                const prochainGraissageDate = new Date(device.date_prochain_graissage);
                // Vérifier si la date est valide
                if (isNaN(prochainGraissageDate)) {
                                  return false; // Exclure les appareils avec une date invalide
                }
                return (
                                 currentDate.getDate() === prochainGraissageDate.getDate() &&
                                 currentDate.getMonth() === prochainGraissageDate.getMonth() &&
                                 currentDate.getFullYear() === prochainGraissageDate.getFullYear()
                );
              });
              setDeviceCountToday(filteredDevices.length);
              console.log('test', deviceCountToday);
            } else {
              console.error('Response data is not an array: ', response.data);
              setDeviceCountToday([]);
            }
          } catch (error) {
            console.error('Error fetching devices: ', error);
            setDeviceCountToday([]);
          }
    };

    const fetchDevicesRetard = async () => {
              const token = localStorage.getItem('token');
              try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/devices`, {
                  headers: { Authorization: `Bearer ${token}` }
                });

                if (Array.isArray(response.data)) {
                  const filteredDevices = response.data.filter(device => {
                  if (!device.date_prochain_graissage) {
                                                  // Exclure les appareils avec une date_prochain_graissage null ou vide
                                                  return false;
                  }
                    const currentDate = new Date();
                    const prochainGraissageDate = new Date(device.date_prochain_graissage);
                    // Vérifier si la date est valide
                                                if (isNaN(prochainGraissageDate)) {
                                                      return false; // Exclure les appareils avec une date invalide
                    }
                    return currentDate > prochainGraissageDate;
                  });
                  setDeviceCountRetard(filteredDevices.length);
                  console.log('test', deviceCountRetard);
                } else {
                  console.error('Response data is not an array: ', response.data);
                  setDeviceCountRetard([]);
                }
              } catch (error) {
                console.error('Error fetching devices: ', error);
                setDeviceCountRetard([]);
              }
    };


    const fetchOperationsToday = async (deviceCount) => {
              const token = localStorage.getItem('token');
              try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/operationgraissage`, {
                  headers: { Authorization: `Bearer ${token}` }
                });

                if (Array.isArray(response.data)) {
                  const today = new Date().toISOString().split('T')[0];
                  const todayOperations = response.data.filter(operation => {
                  {/*if (!operation.date_operationGraissage) {
                                    // Exclure les opérations avec une date null ou vide
                                    return false;
                  }*/}
                    const operationDate = new Date(operation.date_operationGraissage).toISOString().split('T')[0];
                    // Vérifier si la date est valide
                    {/*if (isNaN(operationDate)) {
                                          return false; // Exclure les opérations avec une date invalide
                    }*/}
                    return today === operationDate;
                  });
                   setOpCountToday(todayOperations.length);
                } else {
                  console.error('Response data is not an array: ', response.data);
                  setOpCountToday([]);
                }
              } catch (error) {
                console.error('Error fetching operations: ', error);
                setOpCountToday([]);
              }
    };



    //---------------------------------- Vidange

        const fetchDevicesTodayVidange = async () => {
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
                    return (
                                     currentDate.getDate() === prochainVidangeDate.getDate() &&
                                     currentDate.getMonth() === prochainVidangeDate.getMonth() &&
                                     currentDate.getFullYear() === prochainVidangeDate.getFullYear()
                    );
                  });
                  setDeviceCountTodayVidange(filteredDevices.length);
                  console.log('test', deviceCountTodayVidange);
                } else {
                  console.error('Response data is not an array: ', response.data);
                  setDeviceCountTodayVidange([]);
                }
              } catch (error) {
                console.error('Error fetching devices: ', error);
                setDeviceCountTodayVidange([]);
              }
        };

        const fetchDevicesRetardVidange = async () => {
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
                        return currentDate > prochainVidangeDate;
                      });
                      setDeviceCountRetardVidange(filteredDevices.length);
                      console.log('test', deviceCountRetardVidange);
                    } else {
                      console.error('Response data is not an array: ', response.data);
                      setDeviceCountRetardVidange([]);
                    }
                  } catch (error) {
                    console.error('Error fetching devices: ', error);
                    setDeviceCountRetardVidange([]);
                  }
        };


        const fetchOperationsTodayVidange = async (deviceCount) => {
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
                        return today === operationDate;
                      });
                       setOpCountTodayVidange(todayOperations.length);
                    } else {
                      console.error('Response data is not an array: ', response.data);
                      setOpCountTodayVidange([]);
                    }
                  } catch (error) {
                    console.error('Error fetching operations: ', error);
                    setOpCountTodayVidange([]);
                  }
        };

  return (
    <div className="container">
    <Navbar />
     <div className="container2">

      <div className="dashboard">
              <h2>Tableau de Bord</h2>
              <div className="indicators">
                <div className="indicator">
                  <h3>Graissages du jour</h3>
                  <div className="lcd-number">{deviceCountToday}</div>
                </div>
                <div className="indicator">
                   <h3>Graissages en retard</h3>
                   <div className="lcd-number">{deviceCountRetard}</div>
                </div>
                <div className="indicator">
                  <h3>Opérations</h3>
                  <div className="lcd-number">{opCountToday}</div>
                </div>
              </div>
              <div className="indicators">
              <div className="indicator">
                                <h3>Vidanges du jour</h3>
                                <div className="lcd-number">{deviceCountTodayVidange}</div>
                              </div>
                              <div className="indicator">
                                 <h3>Vidanges en retard</h3>
                                 <div className="lcd-number">{deviceCountRetardVidange}</div>
                              </div>
                              <div className="indicator">
                                <h3>Opérations</h3>
                                <div className="lcd-number">{opCountTodayVidange}</div>
                              </div>
              </div>
            </div>
        </div>
      <Footer />
    </div>
  );
};

export default Home;
