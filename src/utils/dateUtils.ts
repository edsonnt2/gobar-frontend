import { format } from 'date-fns';

interface FormatDate {
  date: Date | string;
  type: 'dd/MM/yyyy HH:mm:ss' | 'dd/MM/yyyy' | 'HH:mm:ss';
}

export default class DateUtils {
  public static formatDate({ date, type }: FormatDate): string {
    return format(new Date(date), type);
  }
}
