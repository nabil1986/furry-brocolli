import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import './ArticleForm.css';  // Import the CSS file
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const ArticleForm = ({ article, onSubmit, onCancel, showNavbar = true }) => {
  const [code_article, setArticleCode] = useState(article ? article.code_article : '');
  const [designation_article, setArticleDesignation] = useState(article ? article.designation_article : '');
  const [type_article0, setTypeArticle0] = useState([]);
  const [type_article, setTypeArticle] = useState(article ? article.type_article : '');
  const [localisation_article0, setLocalisationArticle0] = useState([]);
  const [localisation, setLocalisationArticle] = useState(article ? article.localisation_article : '');
  const [successMessage, setSuccessMessage] = useState('');
  // Objet de mappage pour les types d'articles
  const typeArticleMapping = {
      G: 'Graisse',
      H: 'Huile',
      A: 'Autre',
      // Ajoutez ici d'autres correspondances si nécessaire
  };

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
      fetchTypeArticle();
      fetchLocalisationArticle();
  }, []);

  useEffect(() => {
    if (article) {
      setArticleCode(article.code_article);
      setArticleDesignation(article.designation_article);
      setTypeArticle(article.type_article);
      setLocalisationArticle(article.localisation_article);
    }
  }, [article]);

  const checkArticleCodeExists = async (code_article) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/check-code-article`, {
          params: { code_article },
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.exists;
      } catch (error) {
        console.error('Error checking code article: ', error);
        return false;
      }
    };


    const fetchTypeArticle = async () => {
          const token = localStorage.getItem('token');
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/typeArticles`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data); // Vérifiez le contenu des données
            setTypeArticle0(response.data);
          } catch (error) {
            console.error('Error fetching type article: ', error.response ? error.response.data : error.message);
          }
    };


    const fetchLocalisationArticle = async () => {
          const token = localStorage.getItem('token');
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/localisationarticle`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data); // Vérifiez le contenu des données
            setLocalisationArticle0(response.data);
          } catch (error) {
            console.error('Error fetching localisation article: ', error.response ? error.response.data : error.message);
          }
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const updatedArticle = {
      code_article: code_article,
      designation_article: designation_article,
      type_article: type_article,
      localisation_article: localisation === '' ? null : localisation, // Set to null if no designation is selected
    };

    try {
      if (!article) {
              // Only check if the article does not exist (i.e., it's a new article)
      const codeExists = await checkArticleCodeExists(code_article);
            if (codeExists) {
              alert('Ce code article existe déjà');
              return; // Prevent form submission
            }
            }
            console.log('Submitting article:', updatedArticle);

      if (article) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/articles/${article.id}`,
          updatedArticle,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/articles`,
          updatedArticle,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      // Reset the form fields
      setArticleCode('');
      setArticleDesignation('');
      setTypeArticle('');
      setLocalisationArticle('');
      setSuccessMessage('Enregistrement réussi');
      setTimeout(() => {
        setSuccessMessage('');
        if (onSubmit) {
                    onSubmit(); // Call onSubmit if it's a function
        }
        navigate('/Home'); // Redirect to home page after submission
      }, 2000); // Delay of 2 seconds before calling onSubmit
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
  };

  return (
    <div>
    {showNavbar && <Navbar />}
      <form onSubmit={handleSubmit}>
      <div className="titre_formulaire" class="text-body-secondary">{showNavbar ? 'Ajouter Article' : 'Modifier Article'}</div>
      <div className="form-container2">
        <div className="form-group">
           <input
              class="col-form-label mt-4"
              type="text"
              id="code_article"
              placeholder="Code article"
              value={code_article}
              onChange={(e) => setArticleCode(e.target.value)}
              required
           />
        </div>
        <div className="form-group">
          <input
            class="col-form-label mt-4"
            type="text"
            id="designation_article"
            placeholder="Désignation article"
            value={designation_article}
            onChange={(e) => setArticleDesignation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
         <select
         id="typeArticle"
         value={type_article}
         onChange={(e) => setTypeArticle(e.target.value)}
         >
         <option value="">Sélectionnez un type d article</option>
                     {type_article0.map((type0, index) => (
                     <option key={index} value={type0.type_article}>
                     {typeArticleMapping[type0.type_article] || type0.type_article}
         </option>
         ))}
         </select>
        </div>
        <div className="form-group">
         <select
         id="localisationArticle"
         value={localisation}
         onChange={(e) => setLocalisationArticle(e.target.value)}
         >
         <option value="">Sélectionnez une localisation</option>
                     {localisation_article0.map((loc0, index) => (
                     <option key={index} value={loc0.localisation}>
                     {loc0.localisation}
         </option>
         ))}
         </select>
        </div>



        <div id="colB">
                                                <div className="form-group" id="colC">
                                                  <button class="btn btn-lg btn-primary" type="submit">Enregistrer</button>
                                                </div>

                                                {/* Masquer le bouton "Annuler" si showNavbar est true */}
                                                {!showNavbar && (
                                                  <div className="form-group" id="colC">
                                                    <button class="btn btn-lg btn-primary" type="button" onClick={onCancel}>Annuler</button>
                                                  </div>
                                                )}
                                              </div>
        </div>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {showNavbar && <Footer />}
    </div>
  );
};

export default ArticleForm;
