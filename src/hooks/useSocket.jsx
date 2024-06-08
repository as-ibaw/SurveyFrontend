import { useMsal } from '@azure/msal-react';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { loginRequest } from '../authConfig';

const useSocket = () => {
  const { instance } = useMsal();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const setupSocket = async () => {
      const activeAccount = instance.getActiveAccount();
      if (!activeAccount) {
        console.error('No active account! Please log in.');
        return;
      }

      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: activeAccount,
        });
        const accessToken = response.accessToken;

        if (!socketRef.current) {
          socketRef.current = io(`${import.meta.env.VITE_API_BASE_URL}`, {
            extraHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
          });

          socketRef.current.on(
            'initialNotifications',
            (initialNotifications) => {
              setNotifications(initialNotifications);
            }
          );

          socketRef.current.on('notification', (notification) => {
            setNotifications((prevNotifications) => [
              notification,
              ...prevNotifications.slice(0, 9),
            ]);
          });

          socketRef.current.on('disconnect', () => {
            console.log('Disconnected from socket server');
          });
        }
      } catch (error) {
        console.error('Error setting up socket:', error);
      }
    };

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [instance]);

  return { socket: socketRef.current, notifications };
};

export default useSocket;
