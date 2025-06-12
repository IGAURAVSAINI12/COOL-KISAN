import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FarmerApp from './pages/FarmerApp';
import ChillerOwnerApp from './pages/ChillerOwnerApp';
import AdminDashboard from './pages/AdminDashboard';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Login from './pages/Login';
import Payment from './pages/Payment';
import MapView from './pages/MapView';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/farmer" element={<FarmerApp />} />
            <Route path="/chiller-owner" element={<ChillerOwnerApp />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;