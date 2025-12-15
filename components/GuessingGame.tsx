'use client';

import { useState, useEffect, useMemo } from 'react';
import { puppets } from '@/lib/data';
import Image from 'next/image';

export default function GuessingGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [lastGuessCorrect, setLastGuessCorrect] = useState<boolean | null>(null);
  
  // Create a shuffled order of puppets for the game session
  const [gameOrder, setGameOrder] = useState<number[]>([]);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const indices = puppets.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setGameOrder(indices);
    setCurrentIndex(0);
    setScore({ correct: 0, wrong: 0 });
    setGameState('playing');
    setLastGuessCorrect(null);
  };

  const currentPuppetIndex = gameOrder[currentIndex];
  const currentPuppet = puppets[currentPuppetIndex];

  // Generate options for current puppet
  const options = useMemo(() => {
    if (currentPuppetIndex === undefined) return [];
    
    const otherPuppets = puppets.filter(p => p.id !== currentPuppet.id);
    // Shuffle others to get 3 random wrong answers
    const shuffledOthers = [...otherPuppets].sort(() => Math.random() - 0.5).slice(0, 3);
    
    const allOptions = [...shuffledOthers, currentPuppet];
    // Shuffle options so the correct one isn't always last
    return allOptions.sort(() => Math.random() - 0.5);
  }, [currentPuppetIndex, currentPuppet]);

  const handleGuess = (guessedId: string) => {
    if (gameState !== 'playing') return;

    const isCorrect = guessedId === currentPuppet.id;
    setLastGuessCorrect(isCorrect);
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1)
    }));
    setGameState('feedback');

    // Auto advance after short delay
    setTimeout(() => {
      if (currentIndex < puppets.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setGameState('playing');
        setLastGuessCorrect(null);
      } else {
        setGameState('finished');
      }
    }, 1500);
  };

  if (!currentPuppet) return null;

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-300">
        <h2 className="text-4xl font-bold mb-6">Game Over!</h2>
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-center mb-8">
          <p className="text-zinc-400 mb-2">Final Score</p>
          <div className="text-6xl font-black mb-4">
            {score.correct} <span className="text-2xl text-zinc-600 font-normal">/ {puppets.length}</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <span>✅ {score.correct} Correct</span>
            <span>❌ {score.wrong} Wrong</span>
          </div>
        </div>
        <button
          onClick={resetGame}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Score Header */}
      <div className="flex justify-between items-center mb-4 px-4">
        <span className="text-zinc-500 font-mono text-sm">
          {currentIndex + 1} / {puppets.length}
        </span>
        <div className="flex gap-4 font-mono text-sm">
          <span className="text-green-500">Correct: {score.correct}</span>
          <span className="text-red-500">Wrong: {score.wrong}</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Image Container - constraints to fit viewport */}
        <div className="relative w-full md:w-1/2 h-full max-h-[60vh] md:max-h-[70vh] aspect-[3/4] md:aspect-square bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800">
          <Image
            src={currentPuppet.image}
            alt="Who is this puppet?"
            fill
            className="object-contain p-4"
            priority
          />
          
          {/* Feedback Overlay */}
          {gameState === 'feedback' && (
            <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 animate-in fade-in duration-200`}>
              <div className={`text-6xl font-black ${lastGuessCorrect ? 'text-green-500' : 'text-red-500'} drop-shadow-lg`}>
                {lastGuessCorrect ? 'CORRECT!' : 'WRONG!'}
              </div>
            </div>
          )}
        </div>

        {/* Options Panel */}
        <div className="w-full md:w-1/3 flex flex-col gap-3">
          <h3 className="text-xl font-bold text-center mb-4 text-zinc-300">Who is this?</h3>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleGuess(option.id)}
              disabled={gameState !== 'playing'}
              className={`p-4 rounded-xl text-lg font-bold transition-all border-2 ${
                gameState === 'feedback' && option.id === currentPuppet.id
                  ? 'bg-green-500/20 border-green-500 text-green-500'
                  : gameState === 'feedback' && !lastGuessCorrect
                  ? 'bg-zinc-900 border-zinc-800 opacity-50'
                  : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 hover:scale-[1.02]'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
