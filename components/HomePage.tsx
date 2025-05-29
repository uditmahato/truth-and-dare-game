
import React from 'react';

interface HomePageProps {
  onStartGame: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  return (
    <div className="w-full max-w-lg p-8 md:p-12 space-y-8 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl text-center">
      <header className="space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold text-sky-400">
          Welcome to Spin the Wheel
        </h2>
        <p className="text-2xl md:text-3xl font-semibold text-pink-400">
          Truth & Dare Edition!
        </p>
      </header>

      <p className="text-lg text-slate-300 leading-relaxed">
        Get ready for a whirlwind of fun, secrets, and hilarious challenges!
        Gather your friends, spin the wheel, and let the fates decide your next truth or dare.
      </p>

      <div>
        <button
          onClick={onStartGame}
          className="w-full md:w-auto py-4 px-10 text-xl font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label="Start a new game of Truth and Dare"
        >
          Start New Game
        </button>
      </div>

      <footer className="pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-500">
          Select players, pick your categories, and let the fun begin!
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
