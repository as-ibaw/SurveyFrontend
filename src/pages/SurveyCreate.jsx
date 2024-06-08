import { PlusIcon } from '@heroicons/react/20/solid';
import React, { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import Input from '../components/Input';
import NewQuestion from '../components/NewQuestion';
import useSurveyForm from '../hooks/useSurveyForm';

const SurveyCreate = () => {
  const { setPageTitle } = useOutletContext();
  const {
    title,
    setTitle,
    description,
    setDescription,
    expirationDate,
    setExpirationDate,
    questions,
    addQuestion,
    handleInputChange,
    handleOptionChange,
    addOption,
    removeOption,
    handleSubmit,
    dropdownOpen,
    toggleDropdown,
    errors,
    toggleRequired,
    duplicateQuestion,
    deleteQuestion,
    moveQuestionUp,
    moveQuestionDown,
  } = useSurveyForm();

  useEffect(() => {
    setPageTitle('Umfrage erstellen');
  }, [setPageTitle]);

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-6'>
            <div className='grid grid-cols-1 gap-x-6 pb-5 gap-y-8 sm:grid-cols-6'>
              <div className='col-span-full'>
                <Input
                  label='Titel'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.find((error) => error.path === 'title')}
                />
                <Input
                  label='Beschreibung'
                  className=' mt-2'
                  type='textarea'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  label='Ablaufdatum'
                  className=' mt-2'
                  type='date'
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  error={errors.find(
                    (error) => error.path === 'expirationDate'
                  )}
                />
              </div>

              <div className='col-span-full border-b border-gray-900/10'></div>
            </div>

            {questions.map((question, index) => (
              <NewQuestion
                key={index}
                type={question.type}
                question={question}
                onQuestionChange={(field, value) =>
                  handleInputChange(index, field, value)
                }
                onOptionChange={(optionIndex, value) =>
                  handleOptionChange(index, optionIndex, value)
                }
                addOption={() => addOption(index)}
                removeOption={(optionIndex) => removeOption(index, optionIndex)}
                toggleRequired={() => toggleRequired(index)}
                duplicateQuestion={() => duplicateQuestion(index)}
                deleteQuestion={() => deleteQuestion(index)}
                moveQuestionUp={() => moveQuestionUp(index)}
                moveQuestionDown={() => moveQuestionDown(index)}
                error={errors.find(
                  (error) => error.path === `questions[${index}].questionText`
                )}
              />
            ))}

            <div className='relative mt-4 flex items-center'>
              <button
                type='button'
                className='rounded-full bg-survey-primary p-0.5 text-white shadow-sm hover:bg-survey-primary-light'
                onClick={toggleDropdown}
              >
                <PlusIcon className='h-4 w-4' />
              </button>
              <span
                className='pl-4 hover:text-survey-primary-light text-md cursor-pointer'
                onClick={toggleDropdown}
              >
                Neue Frage einfügen
              </span>

              {dropdownOpen && (
                <div className='absolute top-full left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
                  <div className='py-1'>
                    <span
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                      onClick={() => addQuestion('textInput')}
                    >
                      Text
                    </span>
                    <span
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                      onClick={() => addQuestion('numberInput')}
                    >
                      Zahl
                    </span>
                    <span
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                      onClick={() => addQuestion('checkbox')}
                    >
                      Checkbox
                    </span>
                    <span
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                      onClick={() => addQuestion('toggle')}
                    >
                      Toggle
                    </span>
                    <span
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                      onClick={() => addQuestion('multipleChoice')}
                    >
                      Multiple Choice
                    </span>
                    <span
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                      onClick={() => addQuestion('radio')}
                    >
                      Radio
                    </span>
                    <span
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                      onClick={() => addQuestion('stars')}
                    >
                      Sterne
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-4'>
          <Link
            to='/surveys'
            className='rounded-md bg-white p-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            Abbrechen
          </Link>
          <button
            type='submit'
            className='rounded-md bg-survey-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-survey-primary-light'
          >
            Speichern
          </button>
        </div>
      </form>
    </>
  );
};

export default SurveyCreate;
