import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface EstimationCardProps {
  value: string;
  isSelected?: boolean;
  isCustom?: boolean;
  onSelect: (value: string) => void;
}

export function EstimationCard({ value, isSelected, isCustom, onSelect }: EstimationCardProps) {
  const [customValue, setCustomValue] = useState('');

  return (
    <Card
      className={cn(
        'w-24 h-36 cursor-pointer transition-transform hover:scale-105',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={() => onSelect(isCustom ? customValue : value)}
    >
      <CardContent className="p-4 flex items-center justify-center h-full">
        {isCustom ? (
          <input
            type="number"
            className="w-full text-center bg-transparent border-b focus:outline-none"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Custom"
          />
        ) : (
          <span className="text-2xl font-bold">{value}</span>
        )}
      </CardContent>
    </Card>
  );
}