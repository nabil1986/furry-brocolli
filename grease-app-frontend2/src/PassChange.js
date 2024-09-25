import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PassChange = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!username || !currentPassword || !newPassword || !confirmNewPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, currentPassword, newPassword }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.status === 200) {
        setMessage(data.message || 'Mot de passe modifié avec succès.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setUsername('');
      } else {
        setError(data.message || 'Erreur lors de la modification du mot de passe.');
      }
    } catch (error) {
      setLoading(false);
      setError('Erreur lors de la modification du mot de passe.');
      console.error('Erreur lors de la modification du mot de passe:', error);
    }
  };


  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handlePasswordChange}>
        <div className="logo">
          <img src="logo.png" alt="LOGO" />
        </div>
        <div>
          <label>Changer le mot de passe</label>
        </div>
        <div>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Mot de passe actuel"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            id="confirm-new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Changement en cours...' : 'Changer le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassChange;
