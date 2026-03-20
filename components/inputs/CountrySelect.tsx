import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import countries from '@/data/countries.json';
import { useEffect, useMemo, useRef } from 'react';

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
};

interface CountrySelectProps {
  value: CountrySelectValue | null;
  onChange: (value: CountrySelectValue) => void;
}

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerRef?.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const countryByValue = useMemo(() => {
    const map = new Map<string, CountrySelectValue>();
    (countries as CountrySelectValue[]).forEach((country) =>
      map.set(country.value, country),
    );
    return map;
  }, []);

  return (
    <Select
      value={value?.value}
      onValueChange={(value) => {
        const country = countryByValue.get(value);
        if (!country) return;
        onChange(country);
      }}
    >
      <SelectTrigger className="w-full" ref={triggerRef}>
        <SelectValue placeholder="Anywhere" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Country</SelectLabel>
          {countries.map((country) => (
            <SelectItem
              key={country.value}
              value={country.value}
              className="flex items-center gap-3"
            >
              <div>{country.flag}</div>
              <div>
                {country.label},
                <span className="ml-1 text-neutral-500">{country.region}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
