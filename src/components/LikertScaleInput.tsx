'use client';

interface LikertScaleInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  labels?: readonly string[];
}

export default function LikertScaleInput({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  labels,
}: LikertScaleInputProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <div className="mb-3">
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2 items-center">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
              value === opt
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt}
          </button>
        ))}
        {labels && value >= min && value <= max && (
          <span className="text-xs text-gray-400 ml-2">{labels[value - min]}</span>
        )}
      </div>
    </div>
  );
}
