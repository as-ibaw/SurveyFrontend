import React from 'react';

const ResultQuestion = ({ question }) => {
  return (
    <div className='border rounded-md shadow-sm p-4 mb-4'>
      <h3 className='text-lg font-medium leading-6 text-gray-900'>
        {question.questionText}
      </h3>
      <div className='mt-2'>
        {question.type === 'textInput' || question.type === 'numberInput' ? (
          <ul>
            {question.answers.map((answer, index) => (
              <li key={index} className='text-sm text-gray-700'>
                {answer}
              </li>
            ))}
          </ul>
        ) : question.type === 'checkbox' || question.type === 'toggle' ? (
          <ul>
            {Object.entries(question.answers).map(([key, value]) => (
              <li key={key} className='text-sm text-gray-700'>
                {key}: {value}
              </li>
            ))}
          </ul>
        ) : question.type === 'multipleChoice' || question.type === 'radio' ? (
          <ul>
            {Object.entries(question.answers).map(([option, count]) => (
              <li key={option} className='text-sm text-gray-700'>
                {option}: {count}
              </li>
            ))}
          </ul>
        ) : question.type === 'stars' ? (
          <p className='text-sm text-gray-700'>
            Durchschnittliche Bewertung: {question.averageRating}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ResultQuestion;
