import { useMsal } from '@azure/msal-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { loginRequest } from '../authConfig';

const useDeleteSurvey = () => {
  const { instance } = useMsal();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const deleteSurvey = async (surveyId, reloadSurveys) => {
    setLoading(true);
    try {
      const activeAccount = instance.getActiveAccount();
      if (!activeAccount) {
        throw new Error('No active account! Please log in.');
      }

      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      });
      const accessToken = response.accessToken;

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/surveys/${surveyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      reloadSurveys();
      toast.success('Umfrage erfolgreich gelöscht!');
    } catch (error) {
      setError(error.message);
      toast.error('Fehler beim Löschen der Umfrage.');
    } finally {
      setLoading(false);
    }
  };

  return { deleteSurvey, error, loading };
};

export default useDeleteSurvey;
