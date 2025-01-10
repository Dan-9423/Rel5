import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  children,
  error,
  required,
  className
}: FormFieldProps) {
  return (
    <div className={className}>
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}