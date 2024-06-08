import { useEffect, useState } from 'react';

const useFetchSurveyPublic = (id) => {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expired, setExpired] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/surveys/${id}/public`
        );
        if (response.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const currentDate = new Date();
        const expirationDate = new Date(data.expirationDate);
        if (expirationDate < currentDate) {
          setExpired(true);
        }

        setSurveyData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [id]);

  return { surveyData, loading, error, expired, notFound };
};

export default useFetchSurveyPublic;
