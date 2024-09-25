import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import ArticleForm from './ArticleForm';
import './ArticleList.css';  // Import the CSS file
import { jwtDecode } from 'jwt-decode';
import Footer from './Footer';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [editingArticles, setEditingArticles] = useState(null);
  const [searchTermArticles, setSearchTermArticles] = useState('');
  const [detailsArticles, setDetailsArticles] = useState(null);
  const [inventorySearchTermArticles, setInventorySearchTermArticles] = useState('');
  const formRef = useRef(null); // Reference for the form
  const detailsRef = useRef(null); // Reference for the details
  const [typeUser, setTypeUser] = useState('');
  const [showModal, setShowModal] = useState(false); // State for showing modal
  const [articleToDelete, setArticleToDelete] = useState(null); // State for the article to be deleted
  // Objet de mappage pour les types d'articles
  const typeArticleMapping = {
        G: 'Graisse',
        H: 'Huile',
        A: 'Autre',
        // Ajoutez ici d'autres correspondances si nécessaire
  };

  useEffect(() => {
    fetchArticles();
    checkUserType();
  }, []);

  useEffect(() => {
      if (editingArticles && formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [editingArticles]);

    useEffect(() => {
      if (detailsArticles && detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [detailsArticles]);

  const fetchArticles = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching Articles: ', error);
    }
  };

  const checkUserType = () => {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setTypeUser(decodedToken.typeUser);
        }
  };

  const handleEditArticles = (articles) => {
    setEditingArticles(articles);
  };

  const handleDeleteArticles = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchArticles();
    } catch (error) {
      console.error('Error deleting Article: ', error);
    }
  };


  const openModal = (article) => {
        setArticleToDelete(article);
        setShowModal(true);
  };

    const closeModal = () => {
        setShowModal(false);
        setArticleToDelete(null);
    };

    const confirmDelete = () => {
        if (articleToDelete) {
          handleDeleteArticles(articleToDelete.id);
        }
        closeModal();
  };

  const handleDetailsArticles = (articles) => {
      setDetailsArticles(articles);
  };

  const filteredArticles = articles.filter(article =>
    article.designation_article.toLowerCase().includes(searchTermArticles.toLowerCase())
  );

  const filteredArticlesByInventoryName = articles.filter(article =>
    article.code_article.toLowerCase().includes(inventorySearchTermArticles.toLowerCase())
  );

  const handleArticleFormSubmit = () => {
      setEditingArticles(null);
      fetchArticles();
  };

  const handleCancel = () => {
          setEditingArticles(null);
    };

  const handleSearchTermChangeArticle = (e) => {
      setSearchTermArticles(e.target.value);
      setInventorySearchTermArticles('');  // Effacer le contenu de la barre de recherche par numéro d'inventaire
      setDetailsArticles(null);
  };

  const handleSearchTermChangeParNumeroInventaireArticle = (e) => {
        setInventorySearchTermArticles(e.target.value);
        setSearchTermArticles('');  // Effacer le contenu de la barre de recherche par désignation
        setDetailsArticles(null);
    };

  return (
    <div>
    <Navbar />
    {/* Affiche la table uniquement si editingDevice est null */}
    {!editingArticles && !detailsArticles && (
    <div>
      <h2>Liste des articles</h2>
      <div className="recherche">
        <input
                type="text"
                placeholder="Rechercher par désignation"
                value={searchTermArticles}
                onChange={handleSearchTermChangeArticle}
                className="search-bar"
        />
        <input
                type="text"
                placeholder="Rechercher par code article"
                value={inventorySearchTermArticles}
                onChange={handleSearchTermChangeParNumeroInventaireArticle}
                className="search-bar"
        />
      </div>
      {searchTermArticles && (
      <table>
        <thead>
          <tr>
            <th>Code Article</th>
            <th>Désignation</th>
            <th>Localisation</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.map((article) => (
            <tr key={article.id}>
              <td className="abc">{article.code_article || 'N/A'}</td>
              <td className="abc">{article.designation_article || 'N/A'}</td>
              <td className="abc">{article.localisation_article || 'N/A'}</td>
              <td className="abc">{typeArticleMapping[article.type_article] || 'N/A'}</td>
              <td className="actions-cell" className="abc">
              {typeUser === 'administrateur' && (
                <>
                <button onClick={() => handleEditArticles(article)}>Modifier</button>
                {/*<button onClick={() => handleDeleteArticles(article.id)}>Supprimer</button>*/}
                <button onClick={() => openModal(article)}>Supprimer</button>
                </>
              )}
                {/*<button onClick={() => handleDetailsArticles(article)}>Afficher les détails</button>*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      {inventorySearchTermArticles && (
            <table>
              <thead>
                <tr>
                  <th>Code Article</th>
                  <th>Désignation</th>
                  <th>Localisation</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticlesByInventoryName.map((article) => (
                            <tr key={article.id}>
                              <td className="abc">{article.code_article || 'N/A'}</td>
                              <td className="abc">{article.designation_article || 'N/A'}</td>
                              <td className="abc">{article.localisation_article || 'N/A'}</td>
                              <td className="abc">{typeArticleMapping[article.type_article] || 'N/A'}</td>
                              <td className="abc">
                                <button onClick={() => handleEditArticles(article)}>Modifier</button>
                                {/*<button onClick={() => handleDeleteArticles(article.id)}>Supprimer</button>*/}
                                <button onClick={() => openModal(article)}>Supprimer</button>
                                {/*<button onClick={() => handleDetailsArticles(article)}>Afficher les détails</button>*/}
                              </td>
                            </tr>
                          ))}
              </tbody>
            </table>
            )}
            </div>
            )}
      {editingArticles && (
      <div ref={formRef}>
              <ArticleForm
                article={editingArticles}
                onSubmit={handleArticleFormSubmit}
                onCancel={handleCancel}
                showNavbar={false} // Passez false pour masquer la Navbar
              />
      </div>
            )}
      {detailsArticles && (
              <div ref={detailsRef} className="details-card">
                <h3>Détails de l'article</h3>
                <p><strong>Code Article :</strong> {detailsArticles.code_article || 'N/A'}</p>
                <p><strong>Désignation :</strong> {detailsArticles.designation_article || 'N/A'}</p>
                <button onClick={() => setDetailsArticles(null)}>Fermer</button>
              </div>
      )}
      {showModal && (
                                <div className="modal">
                                  <div className="modal-content">
                                    <h3>Êtes-vous sûr de vouloir supprimer cet article ?</h3>
                                    <div className="modal-buttons">
                                      <div className="col1">
                                      <div id="AAA"><button onClick={confirmDelete}>Oui</button></div>
                                      <div id="AAA"><button onClick={closeModal}>Non</button></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
      )}
    <Footer />
    </div>
  );
};

export default ArticleList;
