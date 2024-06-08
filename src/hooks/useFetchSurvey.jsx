import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { loginRequest } from '../authConfig';

const useFetchSurvey = (
  surveyId,
  setPageTitle,
  setTitle,
  setDescription,
  setExpirationDate,
  setQuestions
) => {
  const [initialData, setInitialData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { instance } = useMsal();

  useEffect(() => {
    setPageTitle('Umfrage bearbeiten');

    const fetchSurveyData = async () => {
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
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        if (res.status === 404) {
          setNotFound(true);
        } else if (!res.ok) {
          throw new Error('Network response was not ok');
        } else {
          const data = await res.json();
          setInitialData(data);
          setTitle(data.title);
          setDescription(data.description);
          setExpirationDate(data.expirationDate.split('T')[0]);
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Umfrage:', error);
        setNotFound(true);
      }
    };

    fetchSurveyData();
  }, [
    surveyId,
    setPageTitle,
    setTitle,
    setDescription,
    setExpirationDate,
    setQuestions,
    instance,
  ]);

  return { initialData, notFound };
};

export default useFetchSurvey;
