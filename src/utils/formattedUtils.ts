export class FormattedUtils {
  public static onlyNumber(value: string): string {
    return value
      .split('')
      .filter(char => +char || char === '0')
      .join('');
  }

  public static valueDefault(value: string): string {
    return value
      .split('')
      .filter(char => +char || char === ',' || char === '0')
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

  public static formattedTaxId(value: string): string {
    return value
      .split('')
      .map((char, index) => {
        let caracter: string;
        if (value.length < 12) {
          switch (index) {
            case 3:
              caracter = '.';
              break;
            case 6:
              caracter = '.';
              break;
            case 9:
              caracter = '-';
              break;
            default:
              caracter = '';
              break;
          }
        } else {
          switch (index) {
            case 2:
              caracter = '.';
              break;
            case 5:
              caracter = '.';
              break;
            case 8:
              caracter = '/';
              break;
            case 12:
              caracter = '-';
              break;
            default:
              caracter = '';
              break;
          }
        }

        return index < 14 ? caracter + char : '';
      })
      .join('');
  }
}
