import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Select = ({ options, label, ...props }) => (
  <div className={'relative mt-4'}>
    <select
      className={
        'appearance-none w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 pr-8'
      }
      {...props}
    >
      {options &&
        options.map(({ text, value, ...optionProps }, i) => (
          <option key={i} value={value} {...optionProps}>
            {text}
          </option>
        ))}
    </select>
    <div
      className={
        'absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2'
      }
    >
      <ChevronDownIcon className={'h-5 w-5 text-gray-400'} />
    </div>
  </div>
);

export default Select;
