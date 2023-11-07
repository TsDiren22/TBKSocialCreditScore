import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { User } from '../models/user';
import { CounterService } from './counter.service'; // Import the new DataService

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent implements OnInit {
  constructor(private counterService: CounterService) {} // Inject your service

  @ViewChild('fileInput') fileInput!: ElementRef;
  fileContent: string = '';
  fileContentLines: string[] = [];
  userList: User[] = [];
  data: any[] = [];
  lastDate: Date = new Date();

  ngOnInit() {
    // Retrieve data when the component is initialized
    this.counterService.getData().subscribe(
      (response: any) => {
        this.userList = response.userList; // Assign the received user list to this.userList
      },
      (error) => {
        console.error('Error retrieving data:', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e) => {
      this.fileContent = reader.result as string;
      this.userList = this.parseChatText(this.fileContent);
    };

    reader.readAsText(file);
  }

  parseChatText(text: string): User[] {
    const lines: string[] = text.split('\n');
    const userList: User[] = [];

    let currentUser: User | null = null;
    let currentMessage = '';
    let currentDate = '';

    lines.forEach((line, index) => {
      const parts: RegExpMatchArray | null = line.match(
        /(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}) - ([^:]+): (.+)/
      );

      if (parts && parts.length === 4) {
        const date = parts[1];
        const name = parts[2];
        const messageText = parts[3];

        if (messageText !== 'This message was deleted') {
          if (currentUser && currentUser.name === name) {
            // If the current message has the same user, append it to the current user's message
            currentMessage += '\n' + messageText;
          } else {
            // Create a new user and add the combined message
            if (currentUser) {
              console.log(date);

              currentUser.addMessage(
                new Message(date, currentUser.name, currentMessage)
              );

              // Update the last date
              this.lastDate = new Date(date);
            }

            currentUser = userList.find((user) => user.name === name) as User;
            if (!currentUser) {
              currentUser = new User(name);
              userList.push(currentUser);
            }

            currentMessage = messageText;
            currentDate = date;
          }
        }
      }
    });

    // Add the last combined message for the last user
    if (currentUser) {
      currentUser = currentUser as User;
      currentUser!.addMessage(
        new Message(currentDate, currentUser.name, currentMessage)
      );
    }
    this.calculateUserPoints(userList);
    return userList.sort((a, b) => b.points - a.points);
  }

  toggleUserMessages(user: User) {
    user.expanded = !user.expanded;
  }

  calculateUserPoints(userList: User[]) {
    userList.forEach((user) => {
      const messageCountsByDay = new Map<string, number>();

      user.messages.forEach((message) => {
        const messageDate = new Date(message.date);
        const day = messageDate.getDate();
        const month = messageDate.getMonth() + 1; // Months are zero-based
        const year = messageDate.getFullYear();
        const dateString = `${day}/${month}/${year}`;

        messageCountsByDay.set(
          dateString,
          (messageCountsByDay.get(dateString) || 0) + 1
        );
      });

      messageCountsByDay.forEach((count, date) => {
        if (count >= 5 && count <= 9) {
          user.addPoints(1);
        } else if (count >= 10 && count <= 20) {
          user.addPoints(2);
        } else if (count >= 20) {
          user.addPoints(3);
        }
      });
    });
  }

  saveData() {
    const data = { userList: this.userList };

    this.counterService.saveData(data).subscribe(
      (response) => {
        console.log('Data saved successfully');
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }
}
