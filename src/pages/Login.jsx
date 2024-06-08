import { useMsal } from '@azure/msal-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from '../assets/logo.png';

import { loginRequest } from '../authConfig';

const Login = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      navigate('/dashboard');
    }
  }, [accounts, navigate]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return (
    <>
      <div className='bg-survey-background flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen'>
        <div className='rounded-lg bg-white px-5 py-6 shadow sm:px-6 flex flex-col items-center justify-center'>
          <img src={Logo} className='h-36 w-36 md:h-52 md:w-52' />
          <button
            onClick={handleLogin}
            className='bg-survey-primary hover:bg-survey-secondary text-survey-background font-bold py-2 md:px-32 px-16 mt-6 rounded inline-block text-center'
          >
            Login mit Microsoft
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
