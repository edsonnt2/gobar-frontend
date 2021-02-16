export default class FormattedUtils {
  public static onlyNumber(value: string): string {
    return value
      .split('')
      .filter(char => Number(char) || char === '0')
      .join('');
  }

  public static valueDefault(value: string): string {
    return value
      .split('')
      .filter(char => Number(char) || char === ',' || char === '0')
      .join('')
      .replace(',', '.');
  }

  public static formattedValue(value: number): string {
    const newValue = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

    return newValue;
  }
}
