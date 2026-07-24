import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { TreeHoleProvider } from './context/TreeHoleContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <AppointmentProvider>
          <TreeHoleProvider>
            <App />
          </TreeHoleProvider>
        </AppointmentProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);