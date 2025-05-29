
import React from 'react';
import { Player, QuestionType } from '../types';

interface TruthDarePromptProps {
  player: Player;
  onChoice: (choice: QuestionType) => void;
}

const TruthDarePrompt: React.FC<TruthDarePromptProps> = ({ player, onChoice }) => {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl text-center">
      <h2 className="text-3xl font-bold text-yellow-400">
        <span className="text-white">{player.name}'s Turn!</span>
      </h2>
      <p className="text-xl text-slate-300">Choose your fate:</p>
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() => onChoice('truth')}
          className="flex-1 py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-400 transition-colors duration-150"
        >
          TRUTH
        </button>
        <button
          onClick={() => onChoice('dare')}
          className="flex-1 py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-400 transition-colors duration-150"
        >
          DARE
        </button>
      </div>
    </div>
  );
};

export default TruthDarePrompt;
