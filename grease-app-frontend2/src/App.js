import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import HomeOperateur from './HomeOperateur';
import DeviceForm from './DeviceForm';
import DeviceList from './DeviceList';
import ArticleForm from './ArticleForm';
import ArticleList from './ArticleList';
import Planning from './Planning';
import RechercherPlanning from './RechercherPlanning';
import RechercherPlanningVidange from './RechercherPlanningVidange';
import PlanUsine from './PlanUsine';
import Register from './Register';
import Footer from './Footer';
import TourneesArchivees from './TourneesArchivees';
import ProtectedRoute from './ProtectedRoute';
import PassChange from './PassChange';
import Anomalies from './Anomalie';
import AnomaliesArchiv from './AnomaliesArchivees';
import PlanningVidange from './PlanningVidange';
import CGU from './CGU';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/homeOperateur" element={<HomeOperateur />} />
          <Route path="/devices" element={<DeviceForm showNavbar={true} />} />
          <Route path="/usinePlan" element={<PlanUsine />} />
          <Route path="/listdevices" element={<DeviceList />} />
          <Route path="/ArticleForm" element={<ArticleForm showNavbar={true} />} />
          <Route path="/ArticleList" element={<ArticleList />} />
          <Route path="/Planning" element={<Planning />} />
          <Route path="/PlanningVidange" element={<PlanningVidange />} />
          <Route path="/RechercherPlanning" element={<RechercherPlanning />} />
          <Route path="/RechercherPlanningVidange" element={<RechercherPlanningVidange />} />
          <Route path="/TourneesArchivees" element={<TourneesArchivees />} />
          <Route path="/Register" element={<Register showNavbar={true} />} />
          <Route path="/PassChange" element={<PassChange />} />
          <Route path="/Anomalie" element={<Anomalies />} />
          <Route path="/AnomaliesArchivees" element={<AnomaliesArchiv />} />
          <Route path="/CGU" element={<CGU />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
