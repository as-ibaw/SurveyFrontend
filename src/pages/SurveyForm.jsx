import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NewPublicQuestion from '../components/NewPublicQuestion';
import Spinner from '../components/Spinner';
import useFetchSurveyPublic from '../hooks/useFetchSurveyPublic';
import useSubmitSurveyResponses from '../hooks/useSubmitSurveyResponses';

const SurveyForm = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { surveyData, loading, error, expired, notFound } =
    useFetchSurveyPublic(id);
  const { submitResponses, error: submitError } = useSubmitSurveyResponses(id);

  const handleInputChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
    setValidationErrors({
      ...validationErrors,
      [questionId]: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newValidationErrors = {};
    surveyData.questions.forEach((question) => {
      if (question.required && !answers[question._id]) {
        newValidationErrors[question._id] = true;
      }
    });

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    const success = await submitResponses(answers);
    if (success) {
      setIsSubmitted(true);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error || submitError) {
    return <div>Error: {error || submitError}</div>;
  }

  if (notFound) {
    return <div>Diese Umfrage wurde nicht gefunden.</div>;
  }

  if (expired) {
    return (
      <div>
        Diese Umfrage ist abgelaufen und kann nicht mehr gestartet werden.
      </div>
    );
  }

  return (
    <>
      {isSubmitted ? (
        <div>
          <h1 className='text-2xl font-semibold mb-6'>
            Vielen Dank für Ihre Teilnahme!
          </h1>
          <p className='mb-4'>Ihre Antworten wurden erfolgreich übermittelt.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='space-y-12'>
            <div className='border-b border-gray-900/10 pb-6'>
              <div className='col-span-full mb-4'>
                <h1 className='text-xl font-semibold'>{surveyData.title}</h1>
                <p className='mt-2'>{surveyData.description}</p>
              </div>

              <div className='col-span-full border-b border-gray-900/10' />

              {surveyData.questions.map((question) => (
                <NewPublicQuestion
                  key={question._id}
                  question={question}
                  answer={answers[question._id] || ''}
                  onAnswerChange={handleInputChange}
                  showError={validationErrors[question._id]}
                />
              ))}
            </div>
          </div>
          <div className='mt-6 flex items-center justify-end gap-x-6'>
            <button
              type='submit'
              className='rounded-md bg-survey-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-survey-primary-light'
            >
              Senden
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SurveyForm;
