import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = '', children }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({ className = '', children }) => {
  return (
    <h3 className={`text-lg font-medium text-[#28313F] ${className}`}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ className = '', children }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ className = '', children }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent, CardFooter };