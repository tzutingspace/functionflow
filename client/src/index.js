/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import Home from './pages/Home';

import Build from './pages/Build';
import Workflows from './pages/Workflows';
import Oauth2 from './pages/Oauth2';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="createworkflow" element={<Build />} />
        <Route path="history" element={<Workflows />} />
        <Route path="oauth2/redirect" element={<Oauth2 />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
