import React, { useState } from 'react';

interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  defaultOpen = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};
