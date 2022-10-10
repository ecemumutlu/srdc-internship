import { Subject } from "rxjs";

export class Message {
  sender: string;
  receiver: string;
  subject: string;
  date: Date;
  messageContent: string;

}
