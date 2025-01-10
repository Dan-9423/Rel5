import { useState, useCallback } from 'react';
import { EmailData } from '@/types/email';

interface ValidationError {
  field: keyof EmailData;
  message: string;
}

export function useEmailValidation() {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateEmail = useCallback((data: EmailData): boolean => {
    const newErrors: ValidationError[] = [];

    // Validar campos obrigatórios
    if (!data.razaoSocial) {
      newErrors.push({
        field: 'razaoSocial',
        message: 'Razão Social é obrigatória'
      });
    }

    if (!data.email) {
      newErrors.push({
        field: 'email',
        message: 'E-mail é obrigatório'
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.push({
        field: 'email',
        message: 'E-mail inválido'
      });
    }

    if (!data.numeroNF) {
      newErrors.push({
        field: 'numeroNF',
        message: 'Número da NF é obrigatório'
      });
    }

    if (data.valorTotal <= 0) {
      newErrors.push({
        field: 'valorTotal',
        message: 'Valor total deve ser maior que zero'
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    validateEmail,
    clearErrors,
    hasError: (field: keyof EmailData) => 
      errors.some(error => error.field === field),
    getError: (field: keyof EmailData) => 
      errors.find(error => error.field === field)?.message
  };
}