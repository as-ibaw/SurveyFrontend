import React from 'react';
import Toggle from 'react-toggle';
import Input from '../components/Input';

const NewPublicQuestion = ({ question, answer, onAnswerChange, showError }) => {
  const handleCheckboxChange = (option) => {
    let newAnswer = answer ? [...answer] : [];
    if (newAnswer.includes(option)) {
      newAnswer = newAnswer.filter((item) => item !== option);
    } else {
      newAnswer.push(option);
    }
    onAnswerChange(question._id, newAnswer);
  };

  return (
    <div className='col-span-full mt-4'>
      <div
        className={`border rounded-md shadow-sm ${
          showError ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <div className='p-4'>
          {question.type === 'multipleChoice' ? (
            <div>
              <label className='block text-sm font-medium leading-6 text-gray-900'>
                {question.questionText}
              </label>
              <div className='flex flex-col space-y-2 mt-2'>
                {question.options.map((option, index) => (
                  <label key={index} className='flex items-center'>
                    <input
                      type='checkbox'
                      value={option}
                      checked={answer.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className='h-4 w-4 rounded border-gray-300  '
                    />
                    <span className='pl-2'>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : question.type === 'checkbox' ? (
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={answer}
                onChange={(e) => onAnswerChange(question._id, e.target.checked)}
                className={`h-4 w-4 rounded border-gray-300   ${
                  showError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <label className='ml-2 block text-sm font-medium leading-6 text-gray-900'>
                {question.questionText}
              </label>
            </div>
          ) : question.type === 'toggle' ? (
            <div className='flex items-center'>
              <Toggle
                defaultChecked={answer}
                icons={false}
                onChange={(e) => onAnswerChange(question._id, e.target.checked)}
                className='mr-2'
              />
              <label className='block text-sm font-medium leading-6 text-gray-900'>
                {question.questionText}
              </label>
            </div>
          ) : question.type === 'radio' ? (
            <div>
              <label className='block text-sm font-medium leading-6 text-gray-900'>
                {question.questionText}
              </label>
              <div className='flex flex-col space-y-2 mt-2'>
                {question.options.map((option, index) => (
                  <label key={index} className='flex items-center'>
                    <input
                      type='radio'
                      value={option}
                      checked={answer === option}
                      onChange={() => onAnswerChange(question._id, option)}
                      className='h-4 w-4 rounded border-gray-300'
                    />
                    <span className='pl-2'>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <Input
              label={question.questionText}
              type={question.type}
              value={answer}
              onAnswerChange={(value) => onAnswerChange(question._id, value)}
              options={question.options}
              showError={showError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPublicQuestion;
