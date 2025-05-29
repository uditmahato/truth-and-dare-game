
import React, { useState, useEffect, useCallback } from 'react';
import { Player, QuestionCategory, QuestionItem, GamePhase, QuestionType } from './types';
import HomePage from './components/HomePage'; // Import new HomePage component
import PlayerSetup from './components/PlayerSetup';
import CategorySelection from './components/CategorySelection';
import WheelDisplay from './components/WheelDisplay';
import TruthDarePrompt from './components/TruthDarePrompt';
import QuestionDisplay from './components/QuestionDisplay';
import Spinner from './components/Spinner';
import { getQuestionOrDare, resetAskedQuestions } from './services/questionService';
import { MAX_CONSECUTIVE_MISSES_GUARANTEED_TURN } from './constants';

const App: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.HOME); // Initial phase is HOME
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<QuestionCategory[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentQuestionItem, setCurrentQuestionItem] = useState<QuestionItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState<boolean>(false);

  // New state for fairness logic
  const [lastSelectedPlayerId, setLastSelectedPlayerId] = useState<string | null>(null);
  const [playerTurnMissCount, setPlayerTurnMissCount] = useState<Record<string, number>>({});
  const [targetPlayerForSpin, setTargetPlayerForSpin] = useState<Player | null>(null);

  const handleStartGame = () => {
    setGamePhase(GamePhase.PLAYER_SETUP);
  };

  const handlePlayersSet = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    const initialMissCounts: Record<string, number> = {};
    newPlayers.forEach(p => {
      initialMissCounts[p.id] = 0;
    });
    setPlayerTurnMissCount(initialMissCounts);
    setLastSelectedPlayerId(null);
    setTargetPlayerForSpin(null);
    setGamePhase(GamePhase.CATEGORY_SETUP);
  };

  const handleCategoriesSet = (categories: QuestionCategory[]) => {
    setSelectedCategories(categories);
    setGamePhase(GamePhase.READY_TO_SPIN);
    resetAskedQuestions();
  };

  const handleSpinWheel = () => {
    if (players.length === 0) return;

    let finalTargetPlayer: Player | undefined;

    // 1. Check for guaranteed turns
    const playersNeedingGuaranteedTurn = players.filter(
      p => (playerTurnMissCount[p.id] || 0) >= MAX_CONSECUTIVE_MISSES_GUARANTEED_TURN
    );

    if (playersNeedingGuaranteedTurn.length > 0) {
      finalTargetPlayer = playersNeedingGuaranteedTurn[Math.floor(Math.random() * playersNeedingGuaranteedTurn.length)];
    } else {
      // 2. No guaranteed turns, apply "no immediate repeat"
      let eligiblePlayers = [...players];
      if (players.length > 1 && lastSelectedPlayerId) {
        eligiblePlayers = players.filter(p => p.id !== lastSelectedPlayerId);
      }

      if (eligiblePlayers.length === 0 && players.length > 0) {
          // This fallback ensures that if filtering leaves no one (e.g. 1 player was the last selected),
          // we still pick from the available players.
          eligiblePlayers = [...players];
      }
       if (eligiblePlayers.length > 0) {
         finalTargetPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
       } else if (players.length > 0) { // Should not happen if above logic is sound, but absolute fallback
         finalTargetPlayer = players[Math.floor(Math.random() * players.length)];
       }
    }

    if (!finalTargetPlayer && players.length > 0) {
        console.warn("Target player selection failed, picking random player as fallback.");
        finalTargetPlayer = players[Math.floor(Math.random() * players.length)];
    }

    if(finalTargetPlayer) {
      setTargetPlayerForSpin(finalTargetPlayer);
      setGamePhase(GamePhase.SPINNING_WHEEL);
      setIsWheelSpinning(true);
    } else {
      console.error("Could not determine a target player for the spin.");
      // Potentially reset or show an error
    }
  };

  const handleSpinComplete = useCallback((selectedPlayer: Player | null) => {
    if (!selectedPlayer) {
        console.error("Spin completed without a selected player. Returning to ready state.");
        setGamePhase(GamePhase.READY_TO_SPIN);
        setIsWheelSpinning(false);
        setTargetPlayerForSpin(null);
        return;
    }

    setCurrentPlayer(selectedPlayer);
    setLastSelectedPlayerId(selectedPlayer.id);

    setPlayerTurnMissCount(prevCounts => {
      const newCounts = { ...prevCounts };
      players.forEach(p => {
        if (p.id === selectedPlayer.id) {
          newCounts[p.id] = 0;
        } else {
          newCounts[p.id] = (newCounts[p.id] || 0) + 1;
        }
      });
      return newCounts;
    });

    setIsWheelSpinning(false);
    setGamePhase(GamePhase.PLAYER_SELECTED);
    setTargetPlayerForSpin(null);
  }, [players]); // Removed unnecessary dependencies that might cause stale closures or excessive re-creations

  const handleTruthDareChoice = async (choice: QuestionType) => {
    if (!currentPlayer || selectedCategories.length === 0) return;
    setGamePhase(GamePhase.AWAITING_QUESTION);
    setIsLoading(true);
    const question = await getQuestionOrDare(choice, selectedCategories);
    setCurrentQuestionItem(question);
    setIsLoading(false);
    if (question) {
      setGamePhase(GamePhase.QUESTION_DISPLAYED);
    } else {
      alert("No more questions available for the selected criteria! Try changing categories or resetting.");
      setGamePhase(GamePhase.READY_TO_SPIN);
    }
  };

  const handleNextRound = () => {
    setCurrentPlayer(null);
    setCurrentQuestionItem(null);
    setGamePhase(GamePhase.READY_TO_SPIN);
  };

  const handleResetGame = () => {
    setPlayers([]);
    setSelectedCategories([]);
    setCurrentPlayer(null);
    setCurrentQuestionItem(null);
    setIsLoading(false);
    setIsWheelSpinning(false);
    resetAskedQuestions();
    // Reset fairness state
    setPlayerTurnMissCount({});
    setLastSelectedPlayerId(null);
    setTargetPlayerForSpin(null);
    setGamePhase(GamePhase.HOME); // Reset to HOME phase
  };

  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("TRUTH & DARE APP: API_KEY for Gemini is not set in environment variables. AI-generated 'Custom' questions will not be available.");
    }
  }, []);


  const renderContent = () => {
    if (isLoading && gamePhase !== GamePhase.SPINNING_WHEEL) {
        return <Spinner message={gamePhase === GamePhase.AWAITING_QUESTION ? "Fetching your fate..." : "Loading..."} />;
    }

    switch (gamePhase) {
      case GamePhase.HOME: // New case for Home Page
        return <HomePage onStartGame={handleStartGame} />;
      case GamePhase.PLAYER_SETUP:
        return <PlayerSetup onPlayersSet={handlePlayersSet} />;
      case GamePhase.CATEGORY_SETUP:
        return <CategorySelection onCategoriesSet={handleCategoriesSet} />;
      case GamePhase.READY_TO_SPIN:
        return (
          <div className="flex flex-col items-center space-y-8 w-full max-w-xl p-6 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-sky-400">Spin the Wheel!</h2>
            <WheelDisplay players={players} onSpinComplete={() => {}} isSpinning={false} targetPlayer={null}  />
            <button
              onClick={handleSpinWheel}
              disabled={players.length === 0}
              className="py-4 px-8 text-xl font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-md transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              Spin!
            </button>
          </div>
        );
      case GamePhase.SPINNING_WHEEL:
         return (
          <div className="flex flex-col items-center space-y-8 w-full max-w-xl p-6 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-sky-400">Spinning...</h2>
            <WheelDisplay players={players} onSpinComplete={handleSpinComplete} isSpinning={isWheelSpinning} targetPlayer={targetPlayerForSpin} />
            <button
              disabled
              className="py-4 px-8 text-xl font-semibold text-slate-400 bg-slate-600 rounded-lg shadow-md cursor-not-allowed"
            >
              Spinning...
            </button>
          </div>
        );
      case GamePhase.PLAYER_SELECTED:
        return currentPlayer ?
          <TruthDarePrompt player={currentPlayer} onChoice={handleTruthDareChoice} /> :
          <Spinner message="Selecting player..."/>;
      case GamePhase.AWAITING_QUESTION:
        return <Spinner message="Summoning a question..." />;
      case GamePhase.QUESTION_DISPLAYED:
        return currentQuestionItem && currentPlayer && (
          <QuestionDisplay questionItem={currentQuestionItem} currentPlayer={currentPlayer} onNextRound={handleNextRound} />
        );
      default:
        setGamePhase(GamePhase.HOME); // Fallback to home for unknown phase
        return <HomePage onStartGame={handleStartGame} />;
    }
  };
  const currentYear = new Date().getFullYear();

  return (
    <div className="container mx-auto flex flex-col items-center justify-between min-h-screen py-6 px-4"> {/* Changed justify-center to justify-between */}
      <div className="w-full"> {/* Wrapper for top content (title and reset button) */}
        {gamePhase !== GamePhase.HOME && (
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={handleResetGame}
                className="py-2 px-4 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-red-700 hover:text-white rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Reset Game
              </button>
            </div>
        )}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-sky-400">Spin</span> <span className="text-slate-300">the</span> <span className="text-pink-400">Wheel</span>
          </h1>
          <p className="text-xl text-slate-400 mt-2">Truth & Dare Edition</p>
        </div>
      </div>

      <main className="w-full flex-grow flex items-center justify-center"> {/* Main content area */}
        {renderContent()}
      </main>

      <footer className="w-full text-center py-4 mt-auto"> {/* Footer */}
        <p className="text-sm text-slate-500">
          Developed by Udit | &copy; {currentYear} Copyrights to Udit
        </p>
      </footer>
    </div>
  );
};

export default App;
