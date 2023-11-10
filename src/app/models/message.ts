import { parse, format } from 'date-fns';
import { enUS, nl } from 'date-fns/locale';

export class Message {
  userId: number = -1;
  date: Date;
  name: string;

  constructor(date: Date, name: string) {
    // Parse the date using date-fns
    this.date = date;
    this.name = name;
  }
}
