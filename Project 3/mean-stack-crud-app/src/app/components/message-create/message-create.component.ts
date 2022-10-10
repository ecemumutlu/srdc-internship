import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { ValidateService } from 'src/app/service/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/model/user';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.css'],
})
export class MessageCreateComponent implements OnInit {
  submitted = false;
  messageForm: FormGroup;

  //User:any = [];


  users:any = [];
  user: Object;

  username: any;

  sender: string;
  receiver: string;
  subject: string;
  date: Date;
  messageContent: string;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private authService: AuthService,
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private jwtHelper: JwtHelperService
  ) {
    this.readProfile();
  }
  ngOnInit() {

  }

/*
  readProfile(){

    this.authService.getProfile().subscribe((profile) => {
      this.User = (profile as any).user;
    });
  }
*/



  readProfile(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.user = token;

  }

  onClearClick(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSendMessage(){

    const message = {
      //sender: this.User.username,
      sender: this.user['username'],
      receiver: this.receiver,
      subject: this.subject,
      date: Date.now(),
      messageContent: this.messageContent,

    }
    //Required fields
    if(!this.validateService.validateSendMessage(message)){
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 5000});
      return false;
    }


    this.apiService.createMessage(message).subscribe((data: any) => {
      if(data.success){
        this.flashMessage.show('Message created', {cssClass: 'alert-success', timeout: 5000});
        this.callAddActivity(message);
      }
      else{
        if(data.msg === 'User not found'){
          this.onClearClick();
          this.flashMessage.show(data.msg , {cssClass: 'alert-danger', timeout: 5000});
        }
        else{
          this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 5000});
          this.router.navigate(['/create-message']);
        }
      }
    })
  }

  onCancelClick(){
    this.router.navigate(['/profile']);
  }


  callAddActivity(message){
    const activity = {

      userId: this.user['_id'],
      username: this.user['username'],
      operation: 'send-message',
      date: Date.now(),
      description: 'from ' + message.sender + ' to ' + message.receiver
    };

    this.authService.addActivity(activity).subscribe((data: any) =>{
      if(data.success){
        this.flashMessage.show('Activity added.', {cssClass: 'alert-success', timeout: 2000});
        this.router.navigate(['/user.route/msg-list/3']);
      }
      else{
        this.flashMessage.show('Something went wrong in log operation of send message', {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['/create-message']);
      }
    })
  }


}
