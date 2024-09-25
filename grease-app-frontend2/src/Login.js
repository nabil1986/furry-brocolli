import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import './Login.css';  // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
        if (!username || !password) {
          setError('Veuillez remplir tous les champs');
          return;
        }
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
      setLoading(false);
        if (data.token) {
                  localStorage.setItem('token', data.token);
                  if (data.typeUser === 'administrateur') {
                    navigate('/home');
                  } else if (data.typeUser === 'assistant') {
                    navigate('/home');
                  }
                } else {
                  alert('Invalid credentials');
                }
      })
      .catch((error) => {
                 setLoading(false);
                 setError('Erreur lors de la connexion');
                 console.error('Error during login:', error);
                         });
    };

  return (

            <div className="auth-container">
                        <form className="auth-form" onSubmit={handleLogin}>
                                <div className="logo">
                                  <img src="logo.png" alt="LOGO" />
                                </div>
                                <div>
                                  <label>
                                  Se connecter
                                  </label>
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
                                    placeholder="Mot de passe"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                  />
                                </div>
                                {error && <div className="error-message">{error}</div>}
                                <div>
                                <button type="submit" disabled={loading}> {loading ? 'Connexion en cours...' : 'Login'} </button>
                                </div>
                              </form>
                  <Footer />
                </div>
  );
};

export default Login;
