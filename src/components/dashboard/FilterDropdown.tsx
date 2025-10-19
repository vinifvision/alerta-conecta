import React, { useState } from 'react';

interface FilterDropdownProps {
  label: string;
  options?: string[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setIsOpen(false);
  };

  return (
    <div className="relative h-[72px] border flex items-center justify-between cursor-pointer bg-[#F6F6F6] px-5 py-0 rounded-xl border-solid border-[rgba(0,0,0,0.14)] max-md:flex-1 max-md:min-w-[150px] max-sm:w-full max-sm:min-w-[auto]">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-black text-[25px] font-medium max-sm:text-lg">
          {selectedValue || label}
        </span>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M20.031 9.53055L12.531 17.0306C12.4614 17.1003 12.3787 17.1556 12.2876 17.1933C12.1966 17.2311 12.099 17.2505 12.0004 17.2505C11.9019 17.2505 11.8043 17.2311 11.7132 17.1933C11.6222 17.1556 11.5394 17.1003 11.4698 17.0306L3.96979 9.53055C3.82906 9.38982 3.75 9.19895 3.75 8.99993C3.75 8.80091 3.82906 8.61003 3.96979 8.4693C4.11052 8.32857 4.30139 8.24951 4.50042 8.24951C4.69944 8.24951 4.89031 8.32857 5.03104 8.4693L12.0004 15.4396L18.9698 8.4693C19.0395 8.39962 19.1222 8.34435 19.2132 8.30663C19.3043 8.26892 19.4019 8.24951 19.5004 8.24951C19.599 8.24951 19.6965 8.26892 19.7876 8.30663C19.8786 8.34435 19.9614 8.39962 20.031 8.4693C20.1007 8.53899 20.156 8.62171 20.1937 8.71276C20.2314 8.8038 20.2508 8.90138 20.2508 8.99993C20.2508 9.09847 20.2314 9.19606 20.1937 9.2871C20.156 9.37815 20.1007 9.46087 20.031 9.53055Z" fill="black"/>
        </svg>
      </button>
      
      {isOpen && options.length > 0 && (
        <ul 
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
          role="listbox"
        >
          {options.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                role="option"
                aria-selected={selectedValue === option}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterDropdown;
