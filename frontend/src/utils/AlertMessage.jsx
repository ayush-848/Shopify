import React from 'react';

function AlertMessage({ message, type }) {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';

  return (
    <div className={`p-3 text-center ${bgColor} ${textColor} rounded-md mb-4`}>
      {message}
    </div>
  );
}

export default AlertMessage;