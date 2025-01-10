import IMask from 'imask';

export const masks = {
  cnpj: {
    mask: '00.000.000/0000-00'
  },
  phone: {
    mask: '(00) 00000-0000'
  }
};

export function maskInput(element: HTMLInputElement, maskType: keyof typeof masks) {
  const mask = IMask(element, masks[maskType]);
  return mask;
}

export function formatCNPJInput(value: string): string {
  return value.replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
}

export function formatPhoneInput(value: string): string {
  return value.replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
    .substring(0, 15);
}