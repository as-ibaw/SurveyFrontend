import {
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import Toggle from 'react-toggle';

const Input = ({
  label,
  type,
  text,
  button,
  className,
  error,
  options,
  onAnswerChange,
  value,
  showError,
  ...props
}) => {
  const [showIcon, setShowIcon] = useState(false);
  const [stars, setStars] = useState([false, false, false, false, false]);

  useEffect(() => {
    if (type === 'stars') {
      const newStars = stars.map((_, index) => index < value);
      setStars(newStars);
    }
  }, [value, type]);

  const handleStarClick = (index) => {
    const newStars = stars.map((star, i) => i <= index);
    setStars(newStars);
    if (onAnswerChange) {
      onAnswerChange(index + 1);
    }
  };

  const inputStyle = `block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
    error ? 'ring-red-500' : 'ring-gray-300'
  } ${showError ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <>
      {label && (
        <label
          className={`block text-sm font-medium leading-6 text-gray-900 ${className}`}
        >
          {label}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          className={inputStyle}
          value={value}
          onChange={(e) => onAnswerChange(e.target.value)}
          {...props}
        />
      ) : type === 'option' ? (
        <div
          className='flex items-center'
          onMouseEnter={button !== false ? () => setShowIcon(true) : undefined}
          onMouseLeave={button !== false ? () => setShowIcon(false) : undefined}
        >
          <input
            type='text'
            className={`w-1/2 py-0.5 block rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
              error ? 'ring-red-500' : 'ring-gray-300'
            } ${showError ? 'border-red-500' : 'border-gray-300'}`}
            {...props}
          />
          {showIcon && (
            <div className='flex items-center pl-2'>
              <TrashIcon className=' h-5 w-5 text-survey-primary' />
              <ChevronUpIcon className='h-6 w-6' />
              <ChevronDownIcon className='h-6 w-6' />
            </div>
          )}
        </div>
      ) : type === 'multipleChoice' ? (
        <div className='flex flex-col mt-2'>
          {options.map((option, index) => (
            <label key={index} className='flex items-center'>
              <input
                type='checkbox'
                value={option}
                checked={value.includes(option)}
                onChange={() => {
                  const newValue = value.includes(option)
                    ? value.filter((v) => v !== option)
                    : [...value, option];
                  onAnswerChange(newValue);
                }}
                className={`h-4 w-4 rounded border-gray-300 ${
                  error ? 'ring-red-500' : 'ring-gray-300'
                } ${showError ? 'border-red-500' : 'border-gray-300'}`}
                {...props}
              />
              <span className='pl-2'>{option}</span>
            </label>
          ))}
        </div>
      ) : type === 'checkbox' ? (
        <div className='flex items-center mt-2'>
          <input
            type='checkbox'
            checked={value}
            onChange={(e) => onAnswerChange(e.target.checked)}
            className={`h-4 w-4 rounded border-gray-300 ${
              error ? 'ring-red-500' : 'ring-gray-300'
            } ${showError ? 'border-red-500' : 'border-gray-300'}`}
            {...props}
          />
        </div>
      ) : type === 'radio' ? (
        <div className='flex items-center mt-2'>
          {options.map((option, index) => (
            <label key={index} className='flex items-center'>
              <input
                type='radio'
                value={option}
                checked={value === option}
                onChange={() => onAnswerChange(option)}
                className={`h-4 w-4 rounded border-gray-300 ${
                  error ? 'ring-red-500' : 'ring-gray-300'
                } ${showError ? 'border-red-500' : 'border-gray-300'}`}
                {...props}
              />
              <span className='pl-2'>{option}</span>
            </label>
          ))}
        </div>
      ) : type === 'toggle' ? (
        <div className={`flex items-center`}>
          <Toggle
            icons={false}
            checked={value}
            onChange={(e) => onAnswerChange(e.target.checked)}
            {...props}
          />
          {text && (
            <div className='flex items-center pl-2'>
              <span>{text}</span>
            </div>
          )}
        </div>
      ) : type === 'stars' ? (
        <div className={`flex items-center`}>
          {stars.map((star, index) => (
            <StarIcon
              key={index}
              className={`w-10 h-10 cursor-pointer ${
                star ? 'text-yellow-300' : 'text-gray-300 hover:text-yellow-300'
              }`}
              onClick={() => handleStarClick(index)}
            />
          ))}
        </div>
      ) : (
        <input
          type={type === 'numberInput' ? 'number' : type}
          className={inputStyle}
          value={value}
          onChange={(e) => onAnswerChange(e.target.value)}
          {...props}
        />
      )}
    </>
  );
};

export default Input;
