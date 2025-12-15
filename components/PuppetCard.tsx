import Image from 'next/image';
import { Puppet } from '@/lib/data';

interface PuppetCardProps {
  puppet: Puppet;
  isRevealed?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function PuppetCard({
  puppet,
  isRevealed = true,
  onClick,
  className = '',
}: PuppetCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 ${className} ${
        !isRevealed ? 'bg-zinc-800' : 'bg-transparent'
      }`}
    >
      {isRevealed ? (
        <Image
          src={puppet.image}
          alt={puppet.name}
          width={500}
          height={500}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold text-4xl">
          ?
        </div>
      )}
    </div>
  );
}

