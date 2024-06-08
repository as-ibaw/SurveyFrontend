import { useMsal } from '@azure/msal-react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', link: '/dashboard' },
  { name: 'Umfragen', link: '/surveys' },
];
const userNavigation = [{ name: 'Abmelden', link: '/' }];

const Navigation = () => {
  const { instance, accounts } = useMsal();
  const location = useLocation();

  const [user, setUser] = useState({
    name: '',
  });

  useEffect(() => {
    if (accounts.length > 0) {
      setUser({
        name: accounts[0].name,
      });
    }
  }, [accounts]);

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI,
    });
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <>
      <Disclosure as='nav' className='bg-survey-primary'>
        {({ open }) => (
          <>
            <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
              <div className='border-b border-gray-400'>
                <div className='flex h-16 items-center justify-between px-4 sm:px-0'>
                  <div className='flex items-center'>
                    <div className='hidden md:block'>
                      <div className='flex items-baseline space-x-4'>
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.link}
                            className={`${
                              isCurrent(item.link)
                                ? 'bg-[#0f3347] text-white'
                                : 'text-gray-300 hover:bg-[#2b5a79] hover:text-white'
                            } rounded-md px-3 py-2 text-sm font-medium`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='hidden md:block'>
                    <div className='ml-4 flex items-center md:ml-6'>
                      <Menu as='div' className='relative ml-3'>
                        <div>
                          <Menu.Button className='relative flex max-w-xs items-center rounded-md bg-gray-800 text-sm'>
                            <span className='text-white text-sm font-medium bg-[#0f3347] hover:bg-[#2b5a79] rounded-md px-3 py-2'>
                              {user.name}
                            </span>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-100'
                          enterFrom='transform opacity-0 scale-95'
                          enterTo='transform opacity-100 scale-100'
                          leave='transition ease-in duration-75'
                          leaveFrom='transform opacity-100 scale-100'
                          leaveTo='transform opacity-0 scale-95'
                        >
                          <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg'>
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <button
                                    onClick={handleLogout}
                                    className={`${
                                      active ? 'bg-gray-100' : ''
                                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                  >
                                    {item.name}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className='-mr-2 flex md:hidden'>
                    <Disclosure.Button className='relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400'>
                      <span className='absolute -inset-0.5' />
                      {open ? (
                        <XMarkIcon className='block h-6 w-6' />
                      ) : (
                        <Bars3Icon className='block h-6 w-6' />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className='border-b border-gray-400 md:hidden'>
              <div className='space-y-1 px-2 py-3 sm:px-3'>
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.link}
                    className={`${
                      isCurrent(item.link)
                        ? 'bg-[#0f3347] text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } block rounded-md px-3 py-2 text-base font-medium`}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className='border-t border-gray-400 pb-3 pt-4'>
                <div className='flex items-center px-5'>
                  <div className='text-base font-medium leading-none text-white'>
                    {user.name}
                  </div>
                </div>
                <div className='mt-3 space-y-1 px-2'>
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      onClick={handleLogout}
                      className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default Navigation;
