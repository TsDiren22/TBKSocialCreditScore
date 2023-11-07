import { Component } from '@angular/core';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
})
export class RewardsComponent {
  rewards: Reward[] = [
    new Reward('Song', 'Give me a song to listen to.', 5),
    new Reward('Movie', 'Decide my next movie to watch.', 30),
    new Reward('Draw', 'Drawing of a certain character (not real people).', 50),
    new Reward(
      'Game',
      'Decide my next game to play (I must own the game).',
      150
    ),
    new Reward('Goodie', 'Get a secret goodie.', 175),
    new Reward('Cup', 'Get a cup of your favourite football team.', 200),
  ];
}

export class Reward {
  name: string;
  description: string;
  price: number;

  constructor(name: string, description: string, price: number) {
    this.name = name;
    this.description = description;
    this.price = price;
  }
}
