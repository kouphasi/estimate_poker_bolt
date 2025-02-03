import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Loading({ size = 'md', text = 'Loading...' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
        <div className="absolute inset-0 animate-ping opacity-50">
          <div className={`${sizeClasses[size]} rounded-full bg-primary/10`} />
        </div>
      </div>
      <p className="text-gray-500 animate-pulse font-medium">{text}</p>
    </div>
  );
}