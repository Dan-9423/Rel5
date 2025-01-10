import { useState } from 'react';
import { Input } from './input';
import { FormControl } from './form';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function CurrencyInput({ className, error, onChange, value, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() => {
    if (typeof value === 'number') {
      return formatCurrency(value.toString());
    }
    return '';
  });

  function formatCurrency(value: string) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d)(\d{2})$/, '$1,$2');
    value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');
    return value;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, '');
    const formattedValue = formatCurrency(value);
    setDisplayValue(formattedValue);
    
    if (onChange) {
      const numericValue = Number(value) / 100;
      onChange({
        ...e,
        target: {
          ...e.target,
          value: numericValue.toString()
        }
      });
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-muted-foreground">R$</span>
      </div>
      <FormControl>
        <Input
          {...props}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => !displayValue && setDisplayValue('0,00')}
          className={cn(
            "pl-9",
            "[appearance:textfield]",
            "[&::-webkit-outer-spin-button]:appearance-none",
            "[&::-webkit-inner-spin-button]:appearance-none",
            className
          )}
        />
      </FormControl>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}