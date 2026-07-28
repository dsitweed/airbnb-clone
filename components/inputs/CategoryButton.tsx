import { cn } from '@/lib/utils';
import { Category } from '@/types/common';
import { useRef } from 'react';
import { FieldValues, UseFormWatch } from 'react-hook-form';

interface CategoryButtonProps extends Category {
  onClick: (filedName: string, filedValue: string) => void;
  watch: UseFormWatch<FieldValues>;
}

export default function CategoryButton({
  icon: Icon,
  label,
  onClick,
  watch,
}: CategoryButtonProps) {
  const isSelected = watch('category') === label;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleChange = () => {
    if (isSelected) return;

    onClick('category', label);
  };

  return (
    <div className="col-span-1">
      <button
        ref={buttonRef}
        type="submit"
        onClick={handleChange}
        onFocus={handleChange}
        className={cn(
          'flex w-full cursor-pointer flex-col gap-3 rounded-xl border-2 p-2 transition duration-200 border-red-400 hover:border-black',
          isSelected ? 'border-black' : 'border-neutral-200',
        )}
      >
        <Icon size={24} />
        <span className="text-start text-sm font-semibold select-none">
          {label}
        </span>
      </button>
    </div>
  );
}
