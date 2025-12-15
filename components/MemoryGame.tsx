'use client';

import { useState, useEffect } from 'react';
import { puppets, Puppet } from '@/lib/data';
import PuppetCard from './PuppetCard';

interface Card extends Puppet {
  uniqueId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const duplicatedPuppets = [...puppets, ...puppets];
    const shuffled = duplicatedPuppets
      .sort(() => Math.random() - 0.5)
      .map((puppet, index) => ({
        ...puppet,
        uniqueId: `${puppet.id}-${index}`,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setIsChecking(false);
  };

  const handleCardClick = (clickedCard: Card) => {
    if (isChecking || clickedCard.isFlipped || clickedCard.isMatched) return;

    const newCards = cards.map((card) =>
      card.uniqueId === clickedCard.uniqueId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);
      checkForMatch(newFlippedCards, newCards);
    }
  };

  const checkForMatch = (currentFlipped: Card[], currentCards: Card[]) => {
    const [card1, card2] = currentFlipped;
    const isMatch = card1.id === card2.id;

    if (isMatch) {
      const matchedCards = currentCards.map((card) =>
        card.id === card1.id ? { ...card, isMatched: true } : card
      );
      setCards(matchedCards);
      setFlippedCards([]);
      setIsChecking(false);
    } else {
      setTimeout(() => {
        const resetCards = currentCards.map((card) =>
          card.uniqueId === card1.uniqueId || card.uniqueId === card2.uniqueId
            ? { ...card, isFlipped: false }
            : card
        );
        setCards(resetCards);
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const isGameComplete = cards.length > 0 && cards.every((card) => card.isMatched);

  return (
    <div className="flex flex-col items-center h-full max-h-full overflow-hidden">
      <div className="flex-none flex items-center justify-between w-full max-w-4xl mb-4">
        <div className="text-lg font-mono text-zinc-400">Moves: {moves}</div>
        <button
          onClick={startNewGame}
          className="px-4 py-1.5 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-xs font-bold uppercase tracking-wide"
        >
          Reset
        </button>
      </div>

      {isGameComplete && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">🎉 You Won!</h2>
            <p className="text-zinc-400 mb-6">It took you {moves} moves to match everyone.</p>
            <button
              onClick={startNewGame}
              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Grid container with overflow-y-auto to handle different screen sizes gracefully, but trying to fit all */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-y-auto">
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 md:gap-3 w-full max-w-6xl auto-rows-fr">
          {cards.map((card) => (
            <PuppetCard
              key={card.uniqueId}
              puppet={card}
              isRevealed={card.isFlipped || card.isMatched}
              onClick={() => handleCardClick(card)}
              className="aspect-square w-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
