import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Register.css';  // Assurez-vous d'avoir un fichier CSS pour le style
import Footer from './Footer';

const Register = ({ showNavbar = true }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formVisible, setFormVisible] = useState(true); // Pour contrôler la visibilité du formulaire

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const newUser = {
      username: username,
      password: password,
      typeUser: 'assistant'
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, newUser);

      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setSuccessMessage('Inscription réussie');

      setFormVisible(false); // Masque le formulaire après l'inscription réussie

      setTimeout(() => {
        setSuccessMessage('');
        setFormVisible(true); // Affiche de nouveau le formulaire après un délai
      }, 5000); // Délai de 5 secondes avant de réafficher le formulaire

    } catch (error) {
      console.error('Erreur lors de l inscription: ', error);
    }
  };

  return (
    <div>
      {showNavbar && <Navbar />}
      {formVisible && (
      <form onSubmit={handleSubmit} className="form-container">
        <div className="titre_formulaire">Inscription</div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Mot de passe"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit" >S'inscrire</button>
      </form>
      )}
      {successMessage && <div className="success-message">{successMessage}</div>}
    {showNavbar && <Footer />}
    </div>
  );
};

export default Register;
