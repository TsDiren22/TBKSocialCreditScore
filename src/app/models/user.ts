import { Message } from './message';

export class User {
  id: number = -1;
  name: string;
  points: number = 0;
  messageAmount = 0;
  messages: Message[];

  constructor(name: string) {
    this.name = name;
    this.messages = [];
  }

  addPoints(points: number) {
    this.points += points;
  }

  addMessageCount(messageAmount: number) {
    this.messageAmount += messageAmount;
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }
}
