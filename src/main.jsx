import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { TreeHoleProvider } from './context/TreeHoleContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import './index.css';

// 全局错误捕获
window.onerror = function(msg, url, line, col, error) {
  console.error('Global error:', { msg, url, line, col, error });
  const root = document.getElementById('root');
  if (root && !root.innerHTML.trim()) {
    root.innerHTML = '<div style="padding:40px;text-align:center;font-family:system-ui"><h2 style="color:#e74c3c">加载出错</h2><p style="color:#666">' + msg + '</p><button onclick="location.reload()" style="margin-top:16px;padding:8px 20px;background:#4a6cf7;color:#fff;border:none;border-radius:6px;cursor:pointer">刷新</button></div>';
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <AppointmentProvider>
            <TreeHoleProvider>
              <App />
            </TreeHoleProvider>
          </AppointmentProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>
);