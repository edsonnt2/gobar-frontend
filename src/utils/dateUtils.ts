import { format } from 'date-fns';

interface FormatDate {
  date: Date | string;
  type: 'dd/MM/yyyy HH:mm:ss' | 'dd/MM/yyyy' | 'HH:mm:ss';
}

export class DateUtils {
  public static formatDate({ date, type }: FormatDate): string {
    return format(new Date(date), type);
  }

  public static formattedBirth(date: string): string {
    const splitDate = date.split('/');

    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
  }
}
