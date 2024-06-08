import { useState } from 'react';

const useSubmitSurveyResponses = (id) => {
  const [error, setError] = useState(null);

  const submitResponses = async (answers) => {
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      answer: answers[questionId],
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/surveys/${id}/responses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ responses: formattedAnswers }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  return { submitResponses, error };
};

export default useSubmitSurveyResponses;
