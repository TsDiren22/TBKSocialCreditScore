import { Message } from './message';

export class User {
  name: string;
  messages: Message[];
  expanded: boolean = false;
  points: number = 0;

  constructor(name: string) {
    this.name = name;
    this.messages = [];
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

  addPoints(points: number) {
    this.points += points;
  }
}
