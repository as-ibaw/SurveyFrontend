import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Spinner from '../components/Spinner';
import useSocket from '../hooks/useSocket';
import useSurveyStatistics from '../hooks/useSurveyStatistics';

const Dashboard = () => {
  const { setPageTitle } = useOutletContext();
  const {
    statistics,
    loading: statsLoading,
    error: statsError,
  } = useSurveyStatistics();

  const { notifications } = useSocket();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setPageTitle('Dashboard');
  }, [setPageTitle]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (statsLoading) return <Spinner />;
  if (statsError) return <div>Error: {statsError.message}</div>;

  const stats = [
    {
      name: 'Total Umfragen',
      stat: statistics.totalSurveys,
    },
    {
      name: 'Öffnungen Umfragen',
      stat: statistics.totalViews,
    },
    {
      name: 'Antworten Umfragen',
      stat: statistics.totalResponses,
    },
  ];

  return (
    <>
      <div>
        <dl className='grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0'>
          {stats.map((item) => (
            <div key={item.name} className='px-4 py-5 sm:p-6'>
              <dt className='text-base font-normal text-gray-900'>
                {item.name}
              </dt>
              <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
                <div className='flex items-baseline text-2xl font-semibold text-survey-primary'>
                  {item.stat}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div>
        <h1 className='text-2xl font-semibold leading-tight tracking-tight text-gray-900 mt-8'>
          Letzte Aktivitäten
        </h1>
        <ul role='list' className='mt-6 space-y-6'>
          {notifications.map((notification, idx) => (
            <li key={notification._id || idx} className='relative flex gap-x-4'>
              {idx !== notifications.length - 1 && (
                <div className='absolute left-3 top-6 flex w-px h-full bg-gray-200' />
              )}
              <div className='relative flex h-6 w-6 flex-none items-center justify-center bg-white'>
                <div className='h-2.5 w-2.5 rounded-full bg-gray-100 ring-1 ring-gray-300' />
              </div>
              <p className='flex-auto py-0.5 text-sm leading-5 text-gray-500'>
                <a
                  href={`/survey/${notification.surveyId}/result`}
                  className='font-medium text-gray-900 hover:underline'
                >
                  {notification.type}
                </a>{' '}
                - {notification.message}
              </p>
              <span className='flex-none py-0.5 text-sm leading-5 text-gray-500'>
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                  locale: de,
                })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
