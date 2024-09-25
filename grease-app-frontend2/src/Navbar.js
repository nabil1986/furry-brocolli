import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faCalendarDay, faArchive, faChevronRight, faMap, faUserPlus, faShieldAlt, faQuestionCircle, faTimes, faBars, faHome, faUserCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [typeUser, setTypeUser] = useState('');
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.username);
      setTypeUser(payload.typeUser); // Récupérer le type d'utilisateur (administrateur ou assistant)
    }
    // Obtenir la date du jour
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    setCurrentDate(formattedDate);
  }, []);

  const handleLogout = () => {
    // Effacer le token d'authentification (ou toute autre donnée de session)
         localStorage.removeItem('token'); // Suppression du token
          window.location.replace('/'); // Redirection vers la page de login
          window.location.reload(); // Recharge la page pour s'assurer qu'aucune donnée de session n'est retenue
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAccountMenu = () => {
      setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false); // Masquer le menu lorsque l'utilisateur clique sur un lien
    setIsAccountMenuOpen(false); // Masquer les deux menus lorsque l'utilisateur clique sur un lien
  };

  return (
    <div className="navbar" class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div>
            <button className="menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? (
                <FontAwesomeIcon icon={faTimes} />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </button>
      </div>
      <div><span>Bienvenue, {username}</span></div>
      <div><span className="date">{currentDate}</span></div>
      <div className="account-menu">
              <button className="account-toggle" onClick={toggleAccountMenu}>
                <FontAwesomeIcon icon={faUserCircle} />
              </button>
              {isAccountMenuOpen && (
                <div className="account-dropdown">
                  {/*<Link to="/profile" onClick={handleMenuClick}>Mon Profil</Link>*/}
                  {/*<Link to="/settings" onClick={handleMenuClick}>Paramètres</Link>*/}
                  <Link to="/PassChange" >Changer mot de passe</Link>
                  <Link to="/" onClick={handleLogout}>Se Déconnecter</Link>
                </div>
              )}
      </div>
      {isMenuOpen && (
        <div className="fullscreen-menu">
<div className="nav">
  <div><button className="close-menu" onClick={toggleMenu}><FontAwesomeIcon icon={faTimes} /></button></div>

  <div className="menu-item">
    <button><Link to="/home" onClick={handleMenuClick}><FontAwesomeIcon icon={faHome} /> Accueil</Link></button>
  </div>

  <div className="menu-item">
      <button><Link to="/usinePlan" onClick={handleMenuClick}><FontAwesomeIcon icon={faMap} /> Plan usine</Link></button>
  </div>

  <div className="menu-item">
    <button> Équipement<FontAwesomeIcon icon={faChevronRight} /></button>
    <div className="submenu">
      {typeUser === 'administrateur' && ( <Link to="/devices" onClick={handleMenuClick}><FontAwesomeIcon icon={faPlus} /> Ajouter un équipement</Link> )}
      <Link to="/listdevices" onClick={handleMenuClick}><FontAwesomeIcon icon={faSearch} /> Rechercher un équipement</Link>
    </div>
  </div>

  <div className="menu-item">
    <button> Planning graissage<FontAwesomeIcon icon={faChevronRight} /></button>
    <div className="submenu">
      <Link to="/Planning" onClick={handleMenuClick}><FontAwesomeIcon icon={faCalendarDay} /> Planning du jour</Link>
      <Link to="/RechercherPlanning" onClick={handleMenuClick}><FontAwesomeIcon icon={faCalendarDay} /> Rechercher un planning</Link>
    </div>
  </div>

  <div className="menu-item">
      <button> Planning vidange<FontAwesomeIcon icon={faChevronRight} /></button>
      <div className="submenu">
        <Link to="/PlanningVidange" onClick={handleMenuClick}><FontAwesomeIcon icon={faCalendarDay} /> Planning du jour</Link>
        <Link to="/RechercherPlanningVidange" onClick={handleMenuClick}><FontAwesomeIcon icon={faCalendarDay} /> Rechercher un planning</Link>
      </div>
  </div>

  <div className="menu-item">
    <button> Articles <FontAwesomeIcon icon={faChevronRight} /></button>
    <div className="submenu">
      {typeUser === 'administrateur' && ( <Link to="/ArticleForm" onClick={handleMenuClick}><FontAwesomeIcon icon={faPlus} /> Ajouter un article</Link> )}
      <Link to="/ArticleList" onClick={handleMenuClick}><FontAwesomeIcon icon={faSearch} /> Rechercher un article</Link>
    </div>
  </div>


  <div className="menu-item">
    <button><Link to="/TourneesArchivees" onClick={handleMenuClick}><FontAwesomeIcon icon={faArchive} />Historique des tournées</Link></button>
  </div>

  {typeUser === 'administrateur' && (<div className="menu-item">
    <button><Link to="/Register" onClick={handleMenuClick}><FontAwesomeIcon icon={faUserPlus} /> Inscription</Link></button>
  </div> )}

  <div className="menu-item">
      <button><Link to="/AnomaliesArchivees" onClick={handleMenuClick}><FontAwesomeIcon icon={faExclamationCircle} /> Historique des anomalies</Link></button>
    </div>

  <div className="menu-item">
    <button><Link to="/CGU" onClick={handleMenuClick}><FontAwesomeIcon icon={faShieldAlt} /> Mentions Légales et CGU</Link></button>
  </div>

  <div className="menu-item">
    <button><Link to="/Assistance" onClick={handleMenuClick}><FontAwesomeIcon icon={faQuestionCircle} /> Assistance</Link></button>
  </div>

  {/*<div className="menu-item">
    <button onClick={handleLogout}>Se Déconnecter</button>
  </div>*/}
</div>




        </div>
      )}
    </div>
  );
};

export default Navbar;
