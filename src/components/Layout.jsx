import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  const [pageTitle, setPageTitle] = useState('Dashboard');

  return (
    <div>
      <div className='min-h-full'>
        <div className='bg-survey-primary pb-32'>
          <Navigation />
          <header className='py-10'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <h1 className='text-3xl font-bold tracking-tight text-white'>
                {pageTitle}
              </h1>
            </div>
          </header>
        </div>

        <main className='-mt-32'>
          <div className='mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8'>
            <div className='rounded-lg bg-white px-5 py-6 shadow sm:px-6'>
              <Outlet context={{ setPageTitle }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
