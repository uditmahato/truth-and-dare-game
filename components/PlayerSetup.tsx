
import React, { useState, useCallback, useEffect } from 'react';
import { Player } from '../types';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants';

interface PlayerSetupProps {
  onPlayersSet: (players: Player[]) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onPlayersSet }) => {
  const [numPlayersCount, setNumPlayersCount] = useState<number>(MIN_PLAYERS); // Actual count for logic, drives # of fields
  const [numPlayersDisplayValue, setNumPlayersDisplayValue] = useState<string>(String(MIN_PLAYERS)); // For input field value
  const [playerNames, setPlayerNames] = useState<string[]>(() => Array(MIN_PLAYERS).fill(''));

  const updatePlayerNameFields = useCallback((count: number) => {
    setPlayerNames(currentNames => {
      const newNames = Array(count).fill('');
      for (let i = 0; i < Math.min(currentNames.length, count); i++) {
        newNames[i] = currentNames[i];
      }
      return newNames;
    });
  }, []);

  // Effect to update player name fields when numPlayersCount changes
  useEffect(() => {
    updatePlayerNameFields(numPlayersCount);
  }, [numPlayersCount, updatePlayerNameFields]);


  const handleNumPlayersDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setNumPlayersDisplayValue(inputValue);

    // Allow user to type; validation and logic update on blur or submit
    // However, if they type a valid number within range, update the logical count immediately for responsiveness if desired.
    // For now, we primarily rely on blur/submit for final validation of numPlayersCount itself.
    // If we wanted immediate update of fields:
    // const parsedCount = parseInt(inputValue, 10);
    // if (!isNaN(parsedCount) && parsedCount >= MIN_PLAYERS && parsedCount <= MAX_PLAYERS) {
    //   if (numPlayersCount !== parsedCount) {
    //     setNumPlayersCount(parsedCount);
    //   }
    // }
  };
  
  const handleNumPlayersInputBlur = () => {
    let finalCount = parseInt(numPlayersDisplayValue, 10);
    if (isNaN(finalCount) || finalCount < MIN_PLAYERS) {
      finalCount = MIN_PLAYERS;
    } else if (finalCount > MAX_PLAYERS) {
      finalCount = MAX_PLAYERS;
    }

    setNumPlayersDisplayValue(String(finalCount));
    if (numPlayersCount !== finalCount) {
      setNumPlayersCount(finalCount); // This will trigger useEffect to update playerNames array size
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalPlayerCount = parseInt(numPlayersDisplayValue, 10);
    if (isNaN(finalPlayerCount) || finalPlayerCount < MIN_PLAYERS) {
        finalPlayerCount = MIN_PLAYERS;
    } else if (finalPlayerCount > MAX_PLAYERS) {
        finalPlayerCount = MAX_PLAYERS;
    }

    // Update display value if it was corrected by validation (e.g. empty, too low/high)
    if (numPlayersDisplayValue !== String(finalPlayerCount)) {
        setNumPlayersDisplayValue(String(finalPlayerCount));
    }
    
    // Construct the list of names to validate based on the finalPlayerCount
    // using the current playerNames state, ensuring array is correct length for validation.
    const namesToValidate: string[] = [];
    for (let i = 0; i < finalPlayerCount; i++) {
        namesToValidate.push(playerNames[i] || ''); // Use existing name or default to empty string
    }

    if (namesToValidate.some(name => name.trim() === '')) {
        alert('Please enter names for all players.');
        // If the number of fields shown (numPlayersCount) was not matching finalPlayerCount,
        // update numPlayersCount so the UI re-renders with the correct number of fields for the user to fix.
        if (numPlayersCount !== finalPlayerCount) {
            setNumPlayersCount(finalPlayerCount); // This triggers useEffect -> updatePlayerNameFields
        }
        return;
    }
    
    const players: Player[] = namesToValidate.map((name, index) => ({
        id: `player-${index + 1}-${Date.now()}`,
        name: name.trim(),
    }));
    
    onPlayersSet(players);

    // After successful submission, ensure numPlayersCount reflects finalPlayerCount
    // This is mostly for internal consistency if the component were to remain mounted and interactive.
    if (numPlayersCount !== finalPlayerCount) {
        setNumPlayersCount(finalPlayerCount);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-sky-400">Player Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="numPlayers" className="block text-sm font-medium text-slate-300">
            Number of Players ({MIN_PLAYERS}-{MAX_PLAYERS})
          </label>
          <input
            type="number"
            id="numPlayers"
            value={numPlayersDisplayValue}
            onChange={handleNumPlayersDisplayChange}
            onBlur={handleNumPlayersInputBlur}
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
            aria-describedby="numPlayersHelp"
          />
          <p id="numPlayersHelp" className="sr-only">Enter a number between {MIN_PLAYERS} and {MAX_PLAYERS}. Number of name fields below will update.</p>
        </div>

        {/* Generate input fields based on the logical numPlayersCount */}
        {Array.from({ length: numPlayersCount }, (_, index) => (
          <div key={`player-name-input-${index}`}>
            <label htmlFor={`playerName-${index}`} className="block text-sm font-medium text-slate-300">
              Player {index + 1} Name
            </label>
            <input
              type="text"
              id={`playerName-${index}`}
              value={playerNames[index] || ''}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              placeholder={`Enter Player ${index + 1}'s Name`}
              maxLength={20}
              className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-150"
        >
          Next: Select Categories
        </button>
      </form>
    </div>
  );
};

export default PlayerSetup;
