import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { loginRequest } from '../authConfig';

const useFetchSurveyResult = (id, setPageTitle) => {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { instance } = useMsal();

  useEffect(() => {
    setPageTitle('Umfrage Resultate');

    const fetchResultData = async () => {
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
          `${import.meta.env.VITE_API_BASE_URL}/surveys/${id}/result`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.status === 404) {
          setNotFound(true);
        } else if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setResultData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        setNotFound(true);
      }
    };

    fetchResultData();
  }, [id, setPageTitle, instance]);

  return { resultData, loading, error, notFound };
};

export default useFetchSurveyResult;
