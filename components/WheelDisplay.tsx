
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Player } from '../types';

interface WheelDisplayProps {
  players: Player[];
  onSpinComplete: (selectedPlayer: Player | null) => void;
  isSpinning: boolean;
  targetPlayer: Player | null;
}

const SEGMENT_COLORS = ['#E53935', '#03A9F4', '#4CAF50', '#303F9F', '#FFEB3B', '#FF7043']; // Red, Light Blue, Green, Indigo, Yellow, Deep Orange
// const PEG_COLOR = 'bg-yellow-400'; // Pegs are removed
const POINTER_COLOR = 'border-t-red-600';
const BORDER_COLOR = 'border-slate-900'; 
const HUB_BACKGROUND_COLOR = 'bg-slate-800';
const DIVIDER_LINE_COLOR = 'bg-black';

const WheelDisplay: React.FC<WheelDisplayProps> = ({ players, onSpinComplete, isSpinning, targetPlayer }) => {
  const [rotation, setRotation] = useState<number>(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [spinDurationMs, setSpinDurationMs] = useState<number>(5000);

  const numPlayers = players.length;
  const wheelSizeRem = 22; 
  const wheelRadiusRem = wheelSizeRem / 2;


  const currentRotationRef = useRef(rotation);
  useEffect(() => {
    currentRotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    let spinEndTimer: ReturnType<typeof setTimeout> | undefined;

    if (isSpinning) {
      setIsAnimating(true);
      setHighlightedIndex(null);

      if (numPlayers === 0 || !players || players.length === 0) {
        setIsAnimating(false);
        onSpinComplete(null);
        return;
      }

      let winningPlayerIndex: number = -1;
      let actualTargetPlayer: Player | null = null;

      if (targetPlayer) {
        const currentPlayers = players; 
        const foundIndex = currentPlayers.findIndex(p => p.id === targetPlayer.id);
        if (foundIndex !== -1) {
          winningPlayerIndex = foundIndex;
          actualTargetPlayer = currentPlayers[foundIndex];
        } else {
          winningPlayerIndex = Math.floor(Math.random() * numPlayers);
          actualTargetPlayer = currentPlayers[winningPlayerIndex];
        }
      } else {
        winningPlayerIndex = Math.floor(Math.random() * numPlayers);
        actualTargetPlayer = players[winningPlayerIndex]; 
      }

      if (!actualTargetPlayer || winningPlayerIndex === -1) {
        setIsAnimating(false);
        onSpinComplete(null);
        return;
      }
      
      const anglePerSegment = 360 / numPlayers;
      const currentAbsoluteRotation = currentRotationRef.current; 

      const baseTargetRotation = -(anglePerSegment * winningPlayerIndex + anglePerSegment / 2);
      const fullSpins = 5 + Math.floor(Math.random() * 3);
      
      const normalizedCurrentRotation = (currentAbsoluteRotation % 360 + 360) % 360;
      const normalizedBaseTargetRotation = (baseTargetRotation % 360 + 360) % 360;

      let rotationDelta = (normalizedBaseTargetRotation - normalizedCurrentRotation + 360) % 360;
      let targetRotationCalc = currentAbsoluteRotation + (fullSpins * 360) + rotationDelta;
      
      if (rotationDelta === 0 && numPlayers > 0) { 
          targetRotationCalc += 360 * (1 + Math.floor(Math.random() * 2)); 
      }
       if (numPlayers === 1 && targetRotationCalc <= currentAbsoluteRotation) { 
           targetRotationCalc = currentAbsoluteRotation + 360 * (2 + Math.floor(Math.random() * 2));
      }
      
      const duration = 4000 + Math.random() * 2000; 
      setSpinDurationMs(duration);
      setRotation(targetRotationCalc); 

      spinEndTimer = setTimeout(() => {
        setHighlightedIndex(winningPlayerIndex);
        onSpinComplete(actualTargetPlayer); 
        setIsAnimating(false); 
      }, duration);

      return () => {
        if (spinEndTimer) {
          clearTimeout(spinEndTimer);
        }
      };
    } else {
      if (isAnimating) {
         setIsAnimating(false); 
      }
    }
}, [isSpinning, players, targetPlayer, onSpinComplete, numPlayers]);


  const anglePerSegment = numPlayers > 0 ? 360 / numPlayers : 0;

  const conicGradientBackground = useMemo(() => {
    if (numPlayers === 0) return 'transparent';
    const parts = players.map((_, index) => {
      const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];
      const startAngle = index * anglePerSegment;
      const endAngle = (index + 1) * anglePerSegment;
      return `${color} ${startAngle}deg ${endAngle}deg`;
    });
    return `conic-gradient(${parts.join(', ')})`;
  }, [numPlayers, players, anglePerSegment]);

  return (
    <div className="relative flex flex-col items-center justify-center my-8">
      {numPlayers > 0 && (
        <div className="absolute top-[-35px] left-1/2 transform -translate-x-1/2 z-30" aria-hidden="true">
          <div className={`absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-3 h-5 ${DIVIDER_LINE_COLOR} rounded-t-sm`}></div>
          <div className={`w-0 h-0
            border-l-[18px] border-l-transparent
            border-r-[18px] border-r-transparent
            border-t-[28px] ${POINTER_COLOR} shadow-md`}>
          </div>
        </div>
      )}

      {/* Non-rotating container for wheel assembly */}
      <div
        className="relative w-80 h-80 md:w-96 md:h-96" 
        style={{ width: `${wheelSizeRem}rem`, height: `${wheelSizeRem}rem` }}
        role="img"
        aria-label="Spinning wheel"
      >
        {/* This is the part that actually spins. Player names are NOW CHILDREN of this div. */}
        <div
          className={`absolute inset-0 rounded-full flex items-center justify-center shadow-2xl ${BORDER_COLOR} border-4 overflow-hidden`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isAnimating ? `transform ${spinDurationMs}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : 'none',
            background: conicGradientBackground,
          }}
        >
          {/* Divider Lines - children of spinning part */}
          {numPlayers > 1 && Array.from({ length: numPlayers }).map((_, index) => (
            <div
              key={`line-${index}`}
              className={`absolute w-0.5 h-1/2 ${DIVIDER_LINE_COLOR} top-0 left-1/2 origin-bottom`}
              style={{
                transform: `translateX(-50%) rotate(${index * anglePerSegment}deg)`,
                zIndex: 1,
              }}
              aria-hidden="true"
            />
          ))}
          
          {/* Central Hub - child of spinning part */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 ${HUB_BACKGROUND_COLOR} rounded-full flex items-center justify-center ${BORDER_COLOR} border-4 shadow-inner`} style={{zIndex: 10}}>
              <span className="text-yellow-400 font-bold text-xl md:text-2xl">SPIN!</span>
          </div>

          {/* Player Names - NOW children of the SPINNING part */}
          {players.map((player, index) => {
            if (!player || !player.name || player.name.trim() === "") {
              return null; 
            }
            const segmentMidAngle = index * anglePerSegment + anglePerSegment / 2;
            
            const textRadialPositionFactor = 0.65;
            const textDistanceRem = wheelRadiusRem * textRadialPositionFactor;
            
            let fontSize;
            if (numPlayers <= 2) fontSize = '1.1rem';
            else if (numPlayers <= 4) fontSize = '1.0rem';
            else if (numPlayers <= 7) fontSize = '0.85rem';
            else fontSize = '0.75rem';

            const segmentArcLengthAtTextRadius = textDistanceRem * (anglePerSegment * Math.PI / 180);
            const maxWidthRem = Math.max(2.5, segmentArcLengthAtTextRadius * 0.8);

            return (
              <div
                key={player.id}
                className={`absolute top-1/2 left-1/2 px-1 py-0.5 rounded 
                            transition-all duration-300 ease-in-out 
                            ${highlightedIndex === index && !isAnimating ? 
                              'bg-yellow-300 text-slate-900 scale-110 shadow-lg ring-2 ring-yellow-100 font-bold' : 
                              'text-white font-semibold'}`}
                style={{
                  // Transform relative to the spinning parent's center
                  transform: `translate(-50%, -50%) rotate(${segmentMidAngle}deg) translateY(-${textDistanceRem}rem)`,
                  textAlign: 'center',
                  maxWidth: `${maxWidthRem}rem`,
                  fontSize: fontSize,
                  zIndex: 20, // Above hub
                }}
                aria-label={player.name}
              >
                <span 
                  className={`block whitespace-nowrap overflow-hidden text-ellipsis ${(highlightedIndex !== index || isAnimating) ? 'text-pop-shadow' : ''}`}
                  style={{
                    display: 'inline-block', 
                    transform: (segmentMidAngle % 360 > 90 && segmentMidAngle % 360 < 270) ? 'rotate(180deg)' : 'none', 
                  }}
                >
                  {player.name}
                </span>
              </div>
            );
          })}
        </div> {/* End of spinning part */}
      </div> {/* End of non-rotating container */}
    </div>
  );
};

export default WheelDisplay;
