import { IconType } from 'react-icons';

interface ListingCategoryProps {
  icon: IconType;
  label: string;
  description: string | undefined;
}

export default function ListingCategory({
  icon: Icon,
  label,
  description,
}: ListingCategoryProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-4">
        <Icon size={40} className="text-neutral-600" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{label}</span>
          {description && (
            <p className="font-light text-neutral-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
