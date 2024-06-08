import { useMsal } from '@azure/msal-react';
import { useCallback, useEffect, useState } from 'react';
import { loginRequest } from '../authConfig';

const useSurveys = (page, limit, status) => {
  const [surveys, setSurveys] = useState([]);
  const { instance } = useMsal();
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    setError(null);
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

      console.log(accessToken);

      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/surveys/?page=${page}&limit=${limit}${
          status ? `&status=${status}` : ''
        }`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setSurveys(data.data);
      setTotalSurveys(data.total);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, instance]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  return { surveys, totalSurveys, loading, error, reloadSurveys: fetchSurveys };
};

export default useSurveys;
