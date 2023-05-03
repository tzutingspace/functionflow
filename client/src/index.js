import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import Home from './pages/Home';

import Edit from './pages/Edit';
import Workflows from './pages/Workflows';
import Instances from './pages/Instances';
import Oauth2 from './pages/Oauth2';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (process.env.NODE_ENV === 'production') console.log = function () {};

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="edit/:workflowId" element={<Edit />} />
        <Route path="edit" element={<Edit />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="instances/:atUsername/:workflowName/:workflowid" element={<Instances />} />
        <Route path="oauth2/redirect" element={<Oauth2 />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
