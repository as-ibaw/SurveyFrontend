import React from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import ResultQuestion from '../components/ResultQuestion';
import Spinner from '../components/Spinner';
import useFetchSurveyResult from '../hooks/useFetchSurveyResult';

const SurveyResult = () => {
  const { setPageTitle } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { resultData, loading, error, notFound } = useFetchSurveyResult(
    id,
    setPageTitle
  );

  if (notFound) {
    return (
      <div className='mt-4'>
        <p>Umfrage nicht gefunden.</p>
        <button
          type='button'
          className='mt-4 rounded-md bg-survey-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-survey-primary-light'
          onClick={() => navigate('/surveys')}
        >
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const stats = [
    {
      name: 'Öffnungen Umfrage',
      stat: resultData.viewsCount,
    },
    {
      name: 'Antworten Umfrage',
      stat: resultData.responseCount,
    },
    {
      name: 'Durchschnitt',
      stat: `${resultData.responseQuote.toFixed(2)}%`,
    },
  ];

  return (
    <>
      <div className='space-y-12'>
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
          {resultData.questionStats.map((question) => (
            <ResultQuestion key={question.questionText} question={question} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SurveyResult;
