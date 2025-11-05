import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

const data = window.__INITIAL_DATA__ || {};
hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter>
    <App initialData={data} />
  </BrowserRouter>
);