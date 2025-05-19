import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientForm from './pages/ClientForm';
import QuoteList from './pages/QuoteList';
import QuoteForm from './pages/QuoteForm';

const theme = {
  token: {
    colorPrimary: '#2e7d32',
    colorSuccess: '#388e3c',
    colorWarning: '#f9a825',
    colorError: '#d32f2f',
    colorInfo: '#1976d2',
    borderRadius: 4,
  },
};

function App() {
  return (
    <ConfigProvider locale={ptBR} theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/edit/:id" element={<ClientForm />} />
              <Route path="/quotes" element={<QuoteList />} />
              <Route path="/quotes/new" element={<QuoteForm />} />
              <Route path="/quotes/edit/:id" element={<QuoteForm />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
