import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Home.css';  // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarDay, faArchive, faChevronRight, faMap, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Footer from './Footer';

const Home = () => {

  return (
      <div className="container">
      <Navbar />

        <nav className="nav">
          <ul style={{ paddingLeft: '0', listStyleType: 'none' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/usinePlan" style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          <span style={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '2px',
                            marginRight: '8px',
                          }}>
                            <FontAwesomeIcon icon={faMap} style={{ color: '#FFF' }} />
                          </span>
                          <span>Plan usine</span>
                        </Link>
                        <FontAwesomeIcon icon={faChevronRight} style={{ color: '#FFF' }} />
            </li>

            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/listdevices" style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          <span style={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '2px',
                            marginRight: '8px',
                          }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: '#FFF' }} />
                          </span>
                          <span>Rechercher un équipement</span>
                        </Link>
                        <FontAwesomeIcon icon={faChevronRight} style={{ color: '#FFF' }} />
                      </li>

                      <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/ArticleList" style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          <span style={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '2px',
                            marginRight: '8px',
                          }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: '#FFF' }} />
                          </span>
                          <span>Rechercher un article</span>
                        </Link>
                        <FontAwesomeIcon icon={faChevronRight} style={{ color: '#FFF' }} />
                      </li>

                      <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/Planning" style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          <span style={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '2px',
                            marginRight: '8px',
                          }}>
                            <FontAwesomeIcon icon={faCalendarDay} style={{ color: '#FFF' }} />
                          </span>
                          <span>Planning</span>
                        </Link>
                        <FontAwesomeIcon icon={faChevronRight} style={{ color: '#FFF' }} />
                      </li>

                       <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/Planning" style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          <span style={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '2px',
                            marginRight: '8px',
                          }}>
                            <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#FFF' }} />
                          </span>
                          <span>Signaler une anomalie</span>
                        </Link>
                        <FontAwesomeIcon icon={faChevronRight} style={{ color: '#FFF' }} />
                      </li>
          </ul>
        </nav>
        <Footer />
      </div>
    );
  };

export default Home;
