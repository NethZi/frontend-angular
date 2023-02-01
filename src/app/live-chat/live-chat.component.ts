import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from './../rest-api.service';

import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss']
})
export class LiveChatComponent implements OnInit {

  @ViewChild('popup', {static: false}) popup: any;

  public roomId: string;
  public messageText: string;
  public messageArray: { user: string, message: string }[] = [];
  private storageArray = [];

  public showScreen = false;
  public phone: string;
  public currentUser;
  public selectedUser;
  email: any;
  isLogged: boolean = true;
  users: any;
  public userList = [];
  public userList1 = [
    {
      id: 1,
      name: 'Shoezy',
      email: 'yasasa97r@gmail.com',
      image: 'assets/user/user-1.png',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3'
      }
    },
    {
      id: 2,
      name: 'Nethmini',
      email: 'nethug@gmail.com',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: 'Diluka',
      email: '9988776655',
      image: 'assets/user/user-3.png',
      roomId: {
        1: 'room-2',
        2: 'room-4',
        4: 'room-6'
      }
    },
    {
      id: 4,
      name: 'Yasasa',
      email: 'yasasa@gmail.com',
      image: 'assets/user/user-4.png',
      roomId: {
        1: 'room-3',
        2: 'room-5',
        3: 'room-6'
      }
    }
  ];

  constructor(
      private modalService: NgbModal,
      private chatService: ChatService,
      private rest: RestApiService
  ) {
  }

  ngOnInit(): void {
    this.startChat();
    this.chatService.getMessage()
        .subscribe((data: { user: string, room: string, message: string }) => {
          // this.messageArray.push(data);
          if (this.roomId) {
            setTimeout(() => {
              this.storageArray = this.chatService.getStorage();
              const storeIndex = this.storageArray
                  .findIndex((storage) => storage.roomId === this.roomId);
              this.messageArray = this.storageArray[storeIndex].chats;
            }, 500);
          }
        });
  }


  async startChat() {
    try {
          const data = await this.rest.get(
              'http://localhost:3030/api/users',
          );
          this.userList = data['users'];
          console.log(this.userList);
      } catch (e) {
      }
    this.userList.forEach((obj, index) => {
      obj.id = index + 1;
      console.log(obj.id);
      if (obj.id  == 1) {
            obj.roomId = {
              2: 'room-1',
              3: 'room-2',
              4: 'room-3'
            };
          }
      if (obj.id  == 2) {
        obj.roomId = {
          1: 'room-1',
          3: 'room-4',
          4: 'room-5'
        };
      }
      if (obj.id == 3) {
        obj.roomId = {
          1: 'room-2',
          2: 'room-4',
          4: 'room-6'
        };
      }
      if (obj.id == 4) {
        obj.roomId = {
          1: 'room-3',
          2: 'room-5',
          3: 'room-6'
        };
      }
      obj.image = 'assets/img/logo.png';

    });

    this.email = sessionStorage.getItem('email');
    this.currentUser = this.userList.find(user => user.email === this.email);
    this.userList = this.userList.filter((user) => user.email !== this.email);

    if (this.currentUser) {
      this.showScreen = true;
    }
  }

  selectUserHandler(email: string): void {
    this.selectedUser = this.userList.find(user => user.email === email);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
        .findIndex((storage) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({user: username, room: roomId});
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    });

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
        .findIndex((storage) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };

      this.storageArray.push(updateStorage);
    }

    this.chatService.setStorage(this.storageArray);
    this.messageText = '';
  }

}
