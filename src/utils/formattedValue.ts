export default function formattedValue(value: number): string {
  const newValue = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return newValue;
}
