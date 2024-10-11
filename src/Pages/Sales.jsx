import React, { useState } from 'react';

const Sales = () => {
  const [tab, setTab] = useState('home');

  return (
    <div className="mb-5">
      {/* Tab Buttons */}
      <div>
        <ul className="flex flex-wrap mt-3 border-b border-white-light dark:border-[#191e3a]">
          <li>
            <a
              href="#"
              className={`p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-[#191e3a] dark:hover:border-b-black ${
                tab === 'home' ? '!border-white-light !border-b-white text-primary dark:!border-[#191e3a] dark:!border-b-black' : ''
              }`}
              onClick={() => setTab('home')}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-[#191e3a] dark:hover:border-b-black ${
                tab === 'profile' ? '!border-white-light !border-b-white text-primary dark:!border-[#191e3a] dark:!border-b-black' : ''
              }`}
              onClick={() => setTab('profile')}
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-[#191e3a] dark:hover:border-b-black ${
                tab === 'contact' ? '!border-white-light !border-b-white text-primary dark:!border-[#191e3a] dark:!border-b-black' : ''
              }`}
              onClick={() => setTab('contact')}
            >
              Contact
            </a>
          </li>
          <li>
            <span className="p-3.5 py-2 -mb-[1px] block pointer-events-none text-white-light dark:text-dark">
              Disabled
            </span>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="pt-5 flex-1 text-sm">
        {tab === 'home' && (
          <div className="active">
            <h4 className="font-semibold text-2xl mb-4">We move your world!</h4>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        )}
        {tab === 'profile' && (
          <div>
            <div className="flex items-start">
              <div className="w-20 h-20 ltr:mr-4 rtl:ml-4 flex-none">
                <img src="/assets/images/profile-34.jpeg" alt="Profile" className="w-20 h-20 m-0 rounded-full ring-2 ring-[#ebedf2] dark:ring-white-dark object-cover" />
              </div>
              <div className="flex-auto">
                <h5 className="text-xl font-medium mb-4">Media heading</h5>
                <p className="text-white-dark">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin.
                  Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                </p>
              </div>
            </div>
          </div>
        )}
        {tab === 'contact' && (
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        )}
        {tab === 'disabled' && (
          <div>Disabled</div>
        )}
      </div>
    </div>
  );
};

export default Sales;
