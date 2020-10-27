import { Component } from "@angular/core";
import * as socketClient from "socket.io-client";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {

  nickname: string;
  room: string;

  currentRoom: string;

  messageText: string;
  messages: Array<any> = [];
  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = socketClient.connect();
  }

  ngOnInit() {
    this.listenForMessages();
  }

  joinRoom() {
    if (this.currentRoom === this.room) {
      return;
    }

    this.messages = [];
    this.currentRoom = this.room;

    this.socket.emit("joinRoom", {
      nickname: this.nickname,
      room: this.room,
    });
  }

  listenForMessages() {
    this.socket.on("message", data => {
      this.messages.push(data);
    });
  }

  sendMessage() {
    this.socket.emit("newMessage", {
      nickname: this.nickname,
      room: this.currentRoom,
      message: this.messageText
    });

    this.messageText = "";
  }
}
