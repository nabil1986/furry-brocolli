import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import ArticleForm from './DeviceForm';
import './DeviceForm.css';  // Import the CSS file
import './PlanUsine.css';  // Import the CSS file
import { jwtDecode } from 'jwt-decode';
import Footer from './Footer';

const PlanUsine = () => {
  const [pinPosition, setPinPosition] = useState({ top: 0, left: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    const updatePinPosition = () => {
      const img = imageRef.current;
      if (img) {
        const rect = img.getBoundingClientRect();
        const x1 = 430, y1 = 370, x2 = 530, y2 = 460; // Vos coordonnées
        const xCenter = (x1 + x2) / 2;
        const yCenter = (y1 + y2) / 2;

        setPinPosition({
          top: rect.top + (yCenter * rect.height) / img.height,
          left: rect.left + (xCenter * rect.width) / img.width,
        });
      }
    };

    window.addEventListener('resize', updatePinPosition);
    updatePinPosition();

    return () => {
      window.removeEventListener('resize', updatePinPosition);
    };
  }, []);

  const handleClick = (zone) => {
    console.log(`Zone cliquée : ${zone}`);
  };
//
  return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <Navbar />
    <div className="plan-container">
      <img
        src="Planusine.jpg"
        alt="Plan de l'usine"
        className="plan-image"
        useMap="#planMap"
        ref={imageRef}
      />
      <map name="planMap">
        <area
          shape="rect"
          coords="430,400,530,490"
          href="#"
          alt="Zone 1"
          onClick={() => handleClick('zone1')}
        />
      </map>
      {/*<div
        className="pin"
        style={{
          top: `${pinPosition.top}px`,
          left: `${pinPosition.left}px`,
        }}
        onClick={() => handleClick('zone1')}
      >
        <div className="pin-icon"></div>
      </div>*/}
    </div>
    <Footer />
    </div>
  );
};

export default PlanUsine;
