/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom/client';
import Build from './pages/Build';
import History from './pages/History';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/createworkflow" element={<Build />} />
      <Route path="/history" element={<History />} />
    </Routes>
  </BrowserRouter>
);
