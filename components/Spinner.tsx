
import React from 'react';

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl">
      <div className="w-16 h-16 border-4 border-t-sky-500 border-r-sky-500 border-b-slate-600 border-l-slate-600 rounded-full animate-spin"></div>
      <p className="text-xl text-sky-400">{message}</p>
    </div>
  );
};

export default Spinner;
