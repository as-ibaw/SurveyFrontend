import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { loginRequest } from '../authConfig';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { instance } = useMsal();

  useEffect(() => {
    const fetchNotifications = async () => {
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
          `${import.meta.env.VITE_API_BASE_URL}/notifications/list`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setNotifications(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [instance]);

  return { notifications, loading, error };
};

export default useNotifications;
