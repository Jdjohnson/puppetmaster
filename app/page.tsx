'use client';

import { useState } from 'react';
import GameToggle from '@/components/GameToggle';
import GuessingGame from '@/components/GuessingGame';
import MemoryGame from '@/components/MemoryGame';
import { puppets } from '@/lib/data';
import PuppetCard from '@/components/PuppetCard';

export default function Home() {
  const [mode, setMode] = useState<'guessing' | 'memory'>('guessing');
  const [showAll, setShowAll] = useState(false);

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-black text-white">
      {/* Compact Header */}
      <header className="flex-none flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-black/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tighter">Puppet Master</h1>
          <GameToggle mode={mode} setMode={setMode} />
        </div>
        
        <button
          onClick={() => setShowAll(true)}
          className="text-xs font-medium text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
        >
          View All Puppets
        </button>
      </header>

      {/* Main Game Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full max-w-7xl mx-auto px-4 py-4 flex flex-col justify-center">
          {mode === 'guessing' ? <GuessingGame /> : <MemoryGame />}
        </div>

        {/* View All Overlay */}
        {showAll && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md overflow-y-auto p-8 animate-in fade-in duration-200">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">All Puppets</h2>
                <button
                  onClick={() => setShowAll(false)}
                  className="px-4 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {puppets.map((p) => (
                  <div key={p.id} className="group">
                    <PuppetCard puppet={p} className="aspect-square mb-2" />
                    <p className="text-center text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {p.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
