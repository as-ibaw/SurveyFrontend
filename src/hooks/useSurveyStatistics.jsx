import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { loginRequest } from '../authConfig';

const useSurveyStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { instance } = useMsal();

  useEffect(() => {
    const fetchStatistics = async () => {
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
          `${import.meta.env.VITE_API_BASE_URL}/surveys/statistics`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          }
        );

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();

        setStatistics(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [instance]);

  return { statistics, loading, error };
};

export default useSurveyStatistics;
