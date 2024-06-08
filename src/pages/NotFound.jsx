import React, { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const NotFound = () => {
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('404 - Seite nicht gefunden');
  }, [setPageTitle]);

  return (
    <div className='mt-4'>
      <p>Ihre aufgerufene Seite konnte nicht gefunden werden.</p>
      <button
        type='button'
        className='mt-4 rounded-md bg-survey-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-survey-primary-light'
        onClick={() => navigate('/')}
      >
        Zurück zur Startseite
      </button>
    </div>
  );
};

export default NotFound;
