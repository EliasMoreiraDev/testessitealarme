// src/routes/Rotas.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NewTime from '../components/pages/NewTime';
import Time from '../components/pages/Time';
import Container from '../components/layouts/Container';
import NavBar from '../components/layouts/NavBar';
import SuapLogin from '../login_suap/login';
import Alarm from '../components/pages/Alarm';
import PrivateRoute from './privateRoutes'; // Certifique-se de que o caminho está correto
import useSuapClient from '../login_suap/client';
import Loading from '../components/layouts/Loading';

function Rotas() {

  return (
    <Router>
      <NavBar />
      <Container customClass='min-heigth'>
        <Routes>
          <Route path='/login' element={<SuapLogin />} />
          <Route
            path='/newTime'
            element={
              <PrivateRoute>
                <NewTime />
              </PrivateRoute>
            }
          />
          <Route
            path='/times'
            element={
              <PrivateRoute>
                <Time />
              </PrivateRoute>
            }
          />
          <Route
            path='/time/:id'
            element={
              <PrivateRoute>
                <Alarm />
              </PrivateRoute>
            }
          />
          {/* Redirecionar todas as outras rotas para login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default Rotas;
