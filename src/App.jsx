import { useMsal } from '@azure/msal-react';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginRequest } from './authConfig';

import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import SurveyCreate from './pages/SurveyCreate';
import SurveyEdit from './pages/SurveyEdit';
import SurveyForm from './pages/SurveyForm';
import SurveyResult from './pages/SurveyResult';
import Surveys from './pages/Surveys';

const RequireAuth = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = accounts.length > 0;
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log('Initializing MSAL');
    const initializeMsal = async () => {
      try {
        await instance.initialize();
        console.log('MSAL initialized');
        setIsInitialized(true);
      } catch (error) {
        console.error('MSAL initialization error:', error);
      }
    };

    initializeMsal();
  }, [instance]);

  useEffect(() => {
    console.log('Checking authentication status');
    console.log('isInitialized:', isInitialized);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('inProgress:', inProgress);
    console.log('Current path:', location.pathname);

    if (isInitialized && !isAuthenticated && inProgress === 'none') {
      console.log('User not authenticated, redirecting to login');
      instance.loginRedirect(loginRequest).catch((e) => {
        console.error(e);
      });
    } else if (isAuthenticated) {
      console.log('User authenticated');
      instance.setActiveAccount(accounts[0]);
    }
  }, [isInitialized, isAuthenticated, inProgress, instance, accounts]);

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  if (!isInitialized || (!isAuthenticated && inProgress !== 'none')) {
    return null;
  }

  return isAuthenticated ? children : null;
};

function App() {
  return (
    <div className='app'>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='survey/:id' element={<PublicLayout />}>
          <Route index element={<SurveyForm />} />
        </Route>
        <Route
          path='/'
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='surveys' element={<Surveys />} />
          <Route path='survey/create' element={<SurveyCreate />} />
          <Route path='survey/:surveyId/edit' element={<SurveyEdit />} />
          <Route path='survey/:id/result' element={<SurveyResult />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
