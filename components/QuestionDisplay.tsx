
import React from 'react';
import { QuestionItem, Player, QuestionCategory } from '../types';

interface QuestionDisplayProps {
  questionItem: QuestionItem;
  currentPlayer: Player;
  onNextRound: () => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questionItem, currentPlayer, onNextRound }) => {
  const categoryColors: Record<QuestionCategory, string> = {
    [QuestionCategory.INTENSE]: 'bg-red-600',
    [QuestionCategory.ROMANTIC]: 'bg-pink-500',
    [QuestionCategory.CAREER]: 'bg-blue-500',
    [QuestionCategory.DECEPTION]: 'bg-purple-500',
    [QuestionCategory.FUN]: 'bg-green-500',
    [QuestionCategory.WILD]: 'bg-orange-500',
    [QuestionCategory.CUSTOM]: 'bg-indigo-500',
  };

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl text-center">
      <h2 className="text-2xl font-semibold text-yellow-400">
        {currentPlayer.name}, your {questionItem.type === 'truth' ? 'Truth' : 'Dare'} is:
      </h2>
      <div className="my-6 p-6 bg-slate-700 rounded-lg min-h-[100px] flex items-center justify-center">
        <p className="text-xl md:text-2xl text-white leading-relaxed">{questionItem.text}</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {questionItem.categories.map(cat => (
          <span key={cat} className={`px-3 py-1 text-xs font-medium text-white rounded-full ${categoryColors[cat] || 'bg-gray-500'}`}>
            {cat}
          </span>
        ))}
      </div>

      <button
        onClick={onNextRound}
        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-150"
      >
        Next Round
      </button>
    </div>
  );
};

export default QuestionDisplay;
