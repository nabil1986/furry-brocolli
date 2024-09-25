import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './CGU.css';  // Import the CSS file

const CGU = () => {
  return (
    <div>
      <Navbar />
      <div className="cgu-container">
        <h2>Conditions Générales d'Utilisation</h2>
        <h3>1. Préambule</h3>
        <p>
          L'application mobile et le site web TECMAINT SYSTEMS (ci-après "l'Application" ou "le Site") sont la propriété de la société TECMAINT SYSTEMS, société par actions simplifiée au capital de 1000 €, immatriculée au service de l’INPI sous le numéro 79772311100028. Le siège social est situé au 14 rue de la Bourgogne, 54118 Moyen, France.
        </p>
        <h3>2. Responsable de la publication</h3>
        <p>
          Monsieur Mohamed ATOUCHA, responsable du service Recherche et Développement (R&D).
        </p>
        <h3>3. Hébergement</h3>
        <p>
          L'hébergement de l'Application et du Site est assuré par 10 rue de Penthièvre, 75008 Paris. Pour plus d'informations, vous pouvez consulter le site de l'entreprise à l'adresse <a href="https://www.lws.fr">https://www.lws.fr</a>.
        </p>
        <h3>4. Protection des données personnelles</h3>
        <p>
          Conformément aux dispositions de la loi n° 78-17 du 6 janvier 1978 modifiée, relative à l'informatique, aux fichiers et aux libertés, vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données vous concernant. Pour exercer ce droit, vous pouvez nous contacter en justifiant de votre identité à l'adresse email suivante : info@tecmaint-systems.fr, ou par téléphone au 06.01.05.14.90.
        </p>
        <h3>5. Description de la plateforme</h3>
        <p>
          TECMAINT SYSTEMS est une plateforme dédiée à la digitalisation et à l'optimisation des tournées de maintenance. L'Application permet de planifier, optimiser et suivre les tournées et la progression à distance, en fonction des fréquences préalablement définies selon l'expérience des utilisateurs avec leurs machines.
        </p>
        <h3>6. Accessibilité</h3>
        <p>
          Le service TECMAINT SYSTEMS est accessible 24 heures sur 24, 7 jours sur 7, sauf en cas d'interruption programmée pour maintenance ou en cas de force majeure. TECMAINT SYSTEMS s'efforce de rétablir l'accès au service dans les plus brefs délais en cas d'interruption. Toutefois, TECMAINT SYSTEMS ne saurait être tenu responsable des dommages résultant de l'inaccessibilité du service, quelle qu'en soit la nature. Un service de support est disponible du lundi au vendredi, de 09:00 à 17:00.
        </p>
        <h3>7. Propriété intellectuelle</h3>
        <p>
          Tous les documents, supports, logiciels et autres éléments fournis par TECMAINT SYSTEMS demeurent la propriété exclusive de TECMAINT SYSTEMS, sauf accord préalable explicite. L'Utilisateur s'engage à ne pas reproduire, résumer, modifier, altérer ou rediffuser, en tout ou en partie, les contenus du Site et de l'Application, pour un usage autre que celui prévu dans le cadre des contrats ou conventions conclus avec TECMAINT SYSTEMS.
        </p>
        <p>
          Toute reproduction totale ou partielle du Site, sans l'autorisation expresse de TECMAINT SYSTEMS, constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
        </p>
        <h3>8. Droits et obligations de l'utilisateur</h3>
        <p>
          L'Utilisateur est seul responsable des informations qu'il fournit sur l'Application, notamment en ce qui concerne leur fiabilité, exactitude et pertinence. Il garantit l'exactitude des données fournies lors de son inscription, notamment concernant son identité, et s'engage à ne pas utiliser l'Application à des fins malveillantes, y compris la transmission de virus ou de codes malveillants.
        </p>
        <h3>9. Version de l'application</h3>
        <p>
          La version actuelle de l'application TECMAINT SYSTEMS est la 1.0.2. Des mises à jour régulières seront déployées afin d'améliorer les fonctionnalités et la sécurité de l'Application. Les utilisateurs seront informés des nouvelles versions disponibles et des modifications apportées.
        </p>
        <h3>10. Responsabilité</h3>
        <p>
          TECMAINT SYSTEMS décline toute responsabilité en cas de dommages directs ou indirects résultant de l'utilisation de l'application TECMAINT SYSTEMS. L'Utilisateur est seul responsable de l'utilisation qu'il fait de l'Application et des conséquences qui en découlent.
        </p>
        <h3>11. Modifications des CGU</h3>
        <p>
          TECMAINT SYSTEMS se réserve le droit de modifier les présentes Conditions Générales d'Utilisation à tout moment. Les modifications seront publiées sur le site tecmaint-systems.fr et entreront en vigueur dès leur mise en ligne. Il est recommandé aux utilisateurs de consulter régulièrement les CGU pour rester informés des éventuelles modifications.
        </p>
        <h3>12. Loi applicable et juridiction compétente</h3>
        <p>
          Les présentes conditions générales d’utilisation sont soumises à la loi française. En cas de litige, les parties s’engagent à tenter de résoudre le différend à l’amiable avant de recourir aux tribunaux compétents.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default CGU;
