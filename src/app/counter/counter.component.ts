import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { User } from '../models/user';
import { CounterService } from './counter.service'; // Import the new DataService
import { parse, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Observable } from 'rxjs';

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
  lastDate: Date = new Date(0, 0, 0);
  latestMessageDate: Date = new Date(0, 0, 0);
  valDate: Date = new Date(2014, 1, 1);
  savedUserList: User[] = [];
  fileIsLoaded: boolean = false;
  hideAddedUsers: boolean = false;

  async ngOnInit() {
    await this.getDate();
    this.savedUserList = await this.getAllUsers().toPromise();
    this.savedUserList.sort((a, b) => b.points - a.points);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e) => {
      this.fileContent = reader.result as string;
      this.userList = this.parseChatText(this.fileContent);
      console.log(this.userList);
    };

    reader.readAsText(file);
  }

  async getDate() {
    this.counterService.getLatestMessageDate().subscribe(
      (response: any) => {
        this.latestMessageDate = parseISO(response);
      },
      (error) => {
        console.error('No data found');
      }
    );
  }

  sortAddedUsers(nUserList: User[]): User[] {
    let sortedUserList: User[] = [];
    let checkList: User[] = [];

    if (this.savedUserList.length == 0) {
      checkList = nUserList;
    } else {
      checkList = this.savedUserList;
    }

    // Iterate over savedUserList
    checkList.forEach((savedUser) => {
      const uploadedUser = nUserList.find(
        (user) => user.name == savedUser.name
      );

      if (uploadedUser) {
        sortedUserList.push(uploadedUser);
      } else {
        let curUser = new User(savedUser.name);
        sortedUserList.push(curUser);
      }
    });

    checkList.forEach((nUser) => {
      const savedUser = checkList.find((user) => user.name == nUser.name);

      if (!savedUser) {
        sortedUserList.push(nUser);
      }
    });

    nUserList.forEach((nUser) => {
      const savedUser = checkList.find((user) => user.name == nUser.name);

      if (!savedUser) {
        sortedUserList.push(nUser);
      }
    });

    return sortedUserList;
  }

  getAllUsers(): Observable<any> {
    return this.counterService.getUsers();
  }

  async addPoints(name: string) {
    let user = this.savedUserList.find((user) => user.name === name);

    let points: number | null = null;

    while (points === null) {
      // Open dialog with input field to add points based on user input
      const userInput = prompt('How many points do you want to add?');

      if (userInput === null) {
        // User pressed Cancel
        return;
      }

      // Parse the input as a number
      points = parseInt(userInput);

      // Check if the input is a valid number
      if (isNaN(points)) {
        alert('Please enter a valid number for points.');
        points = null; // Reset points to trigger the next iteration of the loop
      }
    }

    try {
      const response = await this.counterService
        .addPoints(points, user!.id)
        .toPromise();
      // Handle the response if needed
    } catch (error) {
      console.error('Error saving points:', error);
    }

    window.location.reload();
  }

  parseChatText(text: string): User[] {
    const lines: string[] = text.split('\n');
    const userList: User[] = [];

    let currentUser: User | null = null;
    let currentMessage = '';
    let currentDate = new Date();

    lines.forEach((line, index) => {
      const parts: RegExpMatchArray | null = line.match(
        /(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}) - ([^:]+): (.+)/
      );

      if (parts && parts.length === 4) {
        const date = parse(parts[1], 'dd/MM/yyyy, HH:mm', new Date(), {
          locale: nl,
        });
        const name = parts[2];
        const messageText = parts[3];

        if (
          messageText !== 'This message was deleted' &&
          name !== '<Media omitted>' &&
          date > this.latestMessageDate
        ) {
          if (currentUser && currentUser.name === name) {
            // If the current message has the same user, append it to the current user's message
            currentMessage += '\n' + messageText;
          } else {
            // Create a new user and add the combined message
            if (currentUser) {
              currentUser.addMessageCount(1);
              currentUser.addMessage(new Message(currentDate, currentMessage));

              // Update the last date
              this.lastDate = new Date(date);
              this.latestMessageDate = this.lastDate;
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
      currentUser!.addMessageCount(1);
      currentUser!.addMessage(new Message(currentDate, currentMessage));
    }
    this.calculateUserPoints(userList);
    this.fileIsLoaded = true;

    if (userList.length > 0) {
      console.log(userList);
      let newList = this.sortAddedUsers(userList);
      console.log(newList);
      if (this.savedUserList.length == 0) {
        this.savedUserList = newList.sort((a, b) => b.points - a.points);
        this.hideAddedUsers = true;
      }
      newList = this.sortAddedUsers(newList);

      return newList;
    } else {
      return userList.sort((a, b) => b.points - a.points);
    }
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

  async saveData() {
    try {
      // Step 1: Retrieve savedUsers
      const savedUsersResponse = await this.getAllUsers().toPromise();
      if (savedUsersResponse) {
        const savedUsers = savedUsersResponse;

        // Step 2: Process user data
        for (const x of this.userList) {
          let y = savedUsers.find((user: User) => user.name == x.name);

          if (y) {
            await this.processMessageCount(x, y.id);
            await this.processPoints(x, y.id);
          } else {
            await this.createUserAndProcess(x);
          }
        }

        this.userList = [];
        this.fileIsLoaded = false;
        this.hideAddedUsers = false;
      }
      await this.saveLatestMessageDate();
    } catch (error) {
      console.error('Error during saveData:', error);
    }
    window.location.reload();
  }

  async processMessageCount(x: User, userId: number) {
    try {
      const response = await this.counterService
        .addMessageCount(x.messageAmount, userId)
        .toPromise();
    } catch (error) {
      console.error('Error counting messages:', error);
    }
  }

  async processPoints(x: User, userId: number) {
    try {
      const response = await this.counterService
        .addPoints(x.points, userId)
        .toPromise();
    } catch (error) {
      console.error('Error saving points:', error);
    }
  }

  async createUserAndProcess(x: User) {
    try {
      const userResponse: any = await this.counterService
        .createUser(x)
        .toPromise();

      await this.processMessageCount(x, userResponse.id);
      await this.processPoints(x, userResponse.id);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  async saveLatestMessageDate() {
    try {
      const response = await this.counterService
        .addLatestMessageDate(this.lastDate)
        .toPromise();
    } catch (error) {
      console.error('Error saving latest message date:', error);
    }
  }
}
