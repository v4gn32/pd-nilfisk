import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const id = props.id || Math.random().toString(36).substring(2, 9);
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-[#28313F] mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-[#38AFD9] focus:border-transparent
          disabled:opacity-50 disabled:bg-gray-100
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;