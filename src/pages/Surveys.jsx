import { useMsal } from '@azure/msal-react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteModal from '../components/DeleteModal';
import Spinner from '../components/Spinner';
import useDeleteSurvey from '../hooks/useDeleteSurvey';
import useSurveys from '../hooks/useSurveys';

const statusSurvey = {
  Offen: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
  Aktiv: 'text-green-700 bg-green-50 ring-green-600/20',
  Abgeschlossen: 'text-gray-600 bg-gray-50 ring-gray-500/10',
};

const tabs = [
  { name: 'Alle', value: '', current: true },
  { name: 'Offen', value: 'Offen', current: false },
  { name: 'Aktiv', value: 'Aktiv', current: false },
  { name: 'Abgeschlossen', value: 'Abgeschlossen', current: false },
];

const Surveys = () => {
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { surveys, totalSurveys, loading, error, reloadSurveys } = useSurveys(
    page,
    10,
    status
  );
  const {
    deleteSurvey,
    error: deleteError,
    loading: deleteLoading,
  } = useDeleteSurvey();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);

  useEffect(() => {
    setPageTitle('Umfragen');
  }, [setPageTitle]);

  const handleTabClick = (status) => {
    setStatus(status);
    setPage(1);
  };

  const openModal = (survey) => {
    setSurveyToDelete(survey);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSurveyToDelete(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (surveyToDelete) {
      await deleteSurvey(surveyToDelete._id, reloadSurveys);
      setSurveyToDelete(null);
      setIsModalOpen(false);
    }
  };

  const copyLinkToClipboard = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('Link erfolgreich kopiert!'))
      .catch((err) => toast.error('Fehler beim Kopieren des Links.'));
  };

  if (loading) {
    return <Spinner />;
  }

  if (error || deleteError) {
    return <div>Error: {error || deleteError}</div>;
  }

  const totalPages = Math.ceil(totalSurveys / 10);

  return (
    <>
      <DeleteModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        confirmDelete={handleDelete}
        loading={deleteLoading}
      />
      <div className='relative border-b border-gray-200 pb-5 sm:pb-0'>
        <div className='md:flex md:items-center md:justify-between'>
          <div className='mt-3 flex md:absolute md:right-0 md:top-1 md:mt-0'>
            <button
              type='button'
              className='ml-3 inline-flex items-center rounded-md bg-[#0f3347] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2b5a79]'
            >
              <Link to='/survey/create' className='text-white'>
                Umfrage erstellen
              </Link>
            </button>
          </div>
        </div>
        <div className='mt-4'>
          <div className='sm:hidden'>
            <label htmlFor='current-tab' className='sr-only'>
              Select a tab
            </label>
            <select
              id='current-tab'
              name='current-tab'
              className='block w-full rounded-md border-0 py-1.5 pl-3 pr-10 '
              value={status}
              onChange={(e) => handleTabClick(e.target.value)}
            >
              {tabs.map((tab) => (
                <option key={tab.name} value={tab.value}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
          <div className='hidden sm:block'>
            <nav className='-mb-px flex space-x-8'>
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.value)}
                  className={`${
                    tab.value === status
                      ? 'border-survey-secondary text-survey-secondary'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium`}
                  aria-current={tab.value === status ? 'page' : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <ul role='list' className='divide-y divide-gray-100'>
        {surveys.map((survey) => (
          <li
            key={survey._id}
            className='flex items-center justify-between gap-x-6 py-5'
          >
            <div className='min-w-0'>
              <div className='flex items-start gap-x-3'>
                <p
                  className='text-sm font-semibold leading-6 text-gray-900 cursor-pointer'
                  onClick={() => navigate(`/survey/${survey._id}/result`)}
                >
                  {survey.title}
                </p>
                <p
                  className={`${
                    statusSurvey[survey.status]
                  } rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset`}
                >
                  {survey.status}
                </p>
              </div>
              <div className='mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500'>
                <p className='whitespace-nowrap'>
                  Erstellt am{' '}
                  <time dateTime={survey.createdAt}>
                    {new Date(survey.createdAt).toLocaleDateString()}
                  </time>
                </p>
                <svg viewBox='0 0 2 2' className='h-0.5 w-0.5 fill-current'>
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className='truncate'>Erstellt von {survey.createdBy.name}</p>
                <svg viewBox='0 0 2 2' className='h-0.5 w-0.5 fill-current'>
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className='truncate'>
                  Ablaufdatum{' '}
                  {new Date(survey.expirationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className='flex flex-none items-center gap-x-4'>
              <div className='flex w-16 gap-x-2.5'>
                <dt>
                  <span className='sr-only'>Total comments</span>
                  <ChatBubbleLeftIcon
                    className='h-6 w-6 text-gray-400'
                    aria-hidden='true'
                  />
                </dt>
                <dd className='text-sm leading-6 text-gray-900'>
                  {survey.responseCount}
                </dd>
              </div>
              <Menu as='div' className='relative flex-none'>
                <Menu.Button className='-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900'>
                  <span className='sr-only'>Open options</span>
                  <EllipsisVerticalIcon
                    className='h-5 w-5'
                    aria-hidden='true'
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5'>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/survey/${survey._id}/result`}
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } block px-3 py-1 text-sm leading-6 text-gray-900`}
                        >
                          Ansehen
                          <span className='sr-only'>, {survey.title}</span>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/survey/${survey._id}/edit`}
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } block px-3 py-1 text-sm leading-6 text-gray-900`}
                        >
                          Bearbeiten
                          <span className='sr-only'>, {survey.title}</span>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => openModal(survey)}
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900`}
                        >
                          Löschen
                          <span className='sr-only'>, {survey.title}</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            copyLinkToClipboard(
                              `${window.location.origin}/survey/${survey._id}`
                            )
                          }
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900`}
                        >
                          Link kopieren
                          <span className='sr-only'>, {survey.title}</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </li>
        ))}
      </ul>

      <div className='flex items-center justify-between border-t border-gray-200 bg-white py-3'>
        <div className='flex flex-1 justify-between sm:hidden'>
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            Zurück
          </button>
          <button
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            Vor
          </button>
        </div>
        <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm text-gray-700'>
              <span className='font-medium'>{(page - 1) * 10 + 1}</span> -{' '}
              <span className='font-medium'>
                {page * 10 < totalSurveys ? page * 10 : totalSurveys}
              </span>{' '}
              von <span className='font-medium'>{totalSurveys}</span> Umfragen
            </p>
          </div>
          <div>
            <nav
              className='isolate inline-flex -space-x-px rounded-md shadow-sm'
              aria-label='Pagination'
            >
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              >
                <span className='sr-only'>Previous</span>
                <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPage(index + 1)}
                  className={`${
                    page === index + 1
                      ? 'z-10 bg-survey-primary text-white'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  } relative inline-flex items-center px-4 py-2 text-sm font-semibold`}
                  aria-current={page === index + 1 ? 'page' : undefined}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setPage(page < totalPages ? page + 1 : totalPages)
                }
                className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              >
                <span className='sr-only'>Next</span>
                <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Surveys;
