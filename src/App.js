import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router , Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/AdminHome';

import ProtectedRoute from './components/ProtectedRoute';
import WOW from "wowjs";
import AdminUsers from './pages/AdminUsers';
import AdminSignIn from './pages/AdminSignin';
import AdminRegister from './pages/AdminRegister';
import AdminLogout from './pages/AdminLogout';
import AdminArtworks from './pages/AdminArt';
import AdminComments from './pages/AdminComments';


function Layout(){
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/' || location.pathname === '/logout' || location.pathname === '/register' || location.pathname === '/logout';

  useEffect(() => {
    new WOW.WOW().init();
}, []);



  return(
    <>
    {!hideNavAndFooter && <Navbar />}
        {/* <Navbar /> */}
        <Routes>
        {/* Public Routes */}
        <Route path='/' element={<AdminSignIn />} />
        <Route path='/register' element={<AdminRegister />} />

        {/* Protected Routes */}
        {/* <Route path="home" element={<ProtectedRoute element={<HomePage />} />} /> */}
        <Route path="home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="users" element={<ProtectedRoute element={<AdminUsers />} />} /> 
        <Route path="logout" element={<ProtectedRoute element={<AdminLogout />} />} />
        <Route path="artwork" element={<ProtectedRoute element={<AdminArtworks />} />} />
        <Route path="comments" element={<ProtectedRoute element={<AdminComments />} />} />
        {/* <Route path="logout" element={<ProtectedRoute element={<Logout />} />} /> */}

      </Routes>
        {/* <Footer /> */}
    {!hideNavAndFooter && <Footer />} 
    </> 
  );
}

function App() {
  return (
    <div>
      <Router>
         <Layout />
      </Router>
    </div>
  );
}
export default App;