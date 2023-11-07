import { parse, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export class Message {
  date: Date;
  name: string;
  text: string;

  constructor(date: string, name: string, text: string) {
    // Parse the date using date-fns
    this.date = parse(date, 'dd/MM/yyyy, HH:mm', new Date(), { locale: enUS });
    this.name = name;
    this.text = text;
  }
}
