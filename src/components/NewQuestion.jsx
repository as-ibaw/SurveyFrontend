import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import React from 'react';
import Toggle from 'react-toggle';
import Input from './Input';

const NewQuestion = ({
  type,
  question,
  onQuestionChange,
  onOptionChange,
  addOption,
  removeOption,
  toggleRequired,
  duplicateQuestion,
  deleteQuestion,
  moveQuestionUp,
  moveQuestionDown,
  error,
}) => {
  const handleToggleRequired = () => {
    toggleRequired();
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'textInput':
        return 'Text';
      case 'numberInput':
        return 'Zahl';
      case 'checkbox':
        return 'Checkbox';
      case 'toggle':
        return 'Toggle';
      case 'multipleChoice':
        return 'Multiple Choice';
      case 'radio':
        return 'Radio';
      case 'stars':
        return 'Sterne';
      default:
        return type;
    }
  };

  const renderOptions = () => (
    <div>
      <label className='block text-sm font-medium leading-6 text-gray-900 mt-2'>
        Optionen
      </label>
      {question.options.map((option, optionIndex) => (
        <div key={optionIndex} className='flex items-center mt-2'>
          <Input
            type='text'
            value={option}
            onChange={(e) => onOptionChange(optionIndex, e.target.value)}
            className='w-full'
          />
          <TrashIcon
            className='h-5 w-5 text-survey-primary cursor-pointer ml-2'
            onClick={() => removeOption(optionIndex)}
          />
        </div>
      ))}
      <div className='mt-4 flex items-center'>
        <button
          type='button'
          className='text-survey-primary hover:text-survey-primary-light'
          onClick={addOption}
        >
          <PlusIcon className='h-5 w-5' />
        </button>
        <span
          className='pl-2 text-xs hover:text-survey-primary-light cursor-pointer'
          onClick={addOption}
        >
          Option hinzufügen
        </span>
      </div>
    </div>
  );

  return (
    <div className='col-span-full mt-4'>
      <div className='border rounded-md shadow-sm'>
        <div className='p-4'>
          <Input
            label='Frage'
            value={question.questionText}
            onChange={(e) => onQuestionChange('questionText', e.target.value)}
            error={error}
          />
          {(type === 'multipleChoice' || type === 'radio') && renderOptions()}
        </div>

        <div className=' inset-x-0 bottom-0 bg-slate-100 px-4 py-2 flex justify-between items-center text-sm'>
          <label className='flex items-center'>
            <Toggle
              defaultChecked={question.required}
              icons={false}
              onChange={handleToggleRequired}
            />
            <span className='pl-2'>Frage erforderlich</span>
          </label>
          <div className='flex items-center space-x-2 text-gray-600'>
            <span className='text-sm font-medium text-gray-700'>
              {getQuestionTypeLabel(type)} |
            </span>
            <DocumentDuplicateIcon
              className='h-5 w-5'
              onClick={duplicateQuestion}
            />
            <TrashIcon className='h-5 w-5' onClick={deleteQuestion} />
            <ChevronUpIcon className='h-6 w-6' onClick={moveQuestionUp} />
            <ChevronDownIcon className='h-6 w-6' onClick={moveQuestionDown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewQuestion;
