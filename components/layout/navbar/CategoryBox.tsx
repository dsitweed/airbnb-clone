import { cn } from '@/lib/utils';
import { Category } from '@/types/common';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';

interface CategoryBoxProps extends Category {
  selected?: boolean;
}

export default function CategoryBox({
  icon: Icon,
  label,
  description,
  selected,
}: CategoryBoxProps) {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = () => {
    let currentQuery = {};
    if (params) {
      currentQuery = queryString.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    };

    if (params.get('category') === label) {
      delete updatedQuery.category;
    }

    const url = queryString.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      {
        skipNull: true,
      },
    );

    router.push(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex max-w-fit cursor-pointer flex-col items-center justify-center gap-2 border-b-2 p-2 text-xl transition hover:text-neutral-800 md:text-2xl',
        selected
          ? 'border-b-neutral-800 text-neutral-800'
          : 'border-transparent text-neutral-500',
      )}
    >
      <Icon />
      <small className="text-sm font-medium select-none">{label}</small>
    </button>
  );
}
