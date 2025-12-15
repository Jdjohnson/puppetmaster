type GameMode = 'guessing' | 'memory';

interface GameToggleProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
}

export default function GameToggle({ mode, setMode }: GameToggleProps) {
  return (
    <div className="flex bg-zinc-900 rounded-lg p-1">
      <button
        onClick={() => setMode('memory')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          mode === 'memory'
            ? 'bg-zinc-700 text-white shadow-sm'
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        Memory
      </button>
      <button
        onClick={() => setMode('guessing')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          mode === 'guessing'
            ? 'bg-zinc-700 text-white shadow-sm'
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        Guessing
      </button>
    </div>
  );
}
