import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import Home from './pages/Home';

import Build from './pages/Build';
import Edit from './pages/Edit';
import Workflows from './pages/Workflows';
import Instances from './pages/Instances';
import Oauth2 from './pages/Oauth2';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="createworkflow" element={<Build />} />
        <Route path="edit/:workflowId" element={<Edit />} />
        <Route path="edit" element={<Edit />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="instances/:atUsername/:workflowName/:workflowid" element={<Instances />} />
        <Route path="oauth2/redirect" element={<Oauth2 />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
