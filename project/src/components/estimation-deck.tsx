import { EstimationCard } from './estimation-card';

const ESTIMATION_VALUES = ['1h', '2h', '4h', '8h', '1d', '1.5d', '2d', '3d'];

interface EstimationDeckProps {
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export function EstimationDeck({ selectedValue, onSelect }: EstimationDeckProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {ESTIMATION_VALUES.map((value) => (
        <EstimationCard
          key={value}
          value={value}
          isSelected={selectedValue === value}
          onSelect={onSelect}
        />
      ))}
      <EstimationCard
        value="custom"
        isCustom
        isSelected={!ESTIMATION_VALUES.includes(selectedValue || '')}
        onSelect={onSelect}
      />
    </div>
  );
}