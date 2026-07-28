import { FieldValues, UseFormWatch } from 'react-hook-form';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

interface CounterProps {
  title: string;
  subtitle: string;
  onChange: (name: string, value: number) => void;
  name: string;
  watch: UseFormWatch<FieldValues>;
}

export default function Counter({
  title,
  subtitle,
  onChange,
  name,
  watch,
}: CounterProps) {
  const value = watch(name);

  const onAdd = () => {
    onChange(name, value + 1);
  };

  const onReduce = () => {
    if (value === 1) return;
    onChange(name, value - 1);
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <h3 className="font-semibold">{title}</h3>
        <p className="font-light text-gray-600">{subtitle}</p>
      </div>
      <div className="flex flex-row items-center gap-4">
        <button
          type="button"
          onClick={onReduce}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-400 text-neutral-600 transition hover:opacity-80"
        >
          <AiOutlineMinus />
        </button>
        <div className="text-lg font-light text-neutral-600 select-none">
          {value}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-400 text-neutral-600 transition hover:opacity-80"
          autoFocus={title === 'Guests'}
        >
          <AiOutlinePlus />
        </button>
      </div>
    </div>
  );
}
