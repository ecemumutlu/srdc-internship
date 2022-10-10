import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateRegister(user){
    if(user.userType == undefined || user.username == undefined || user.password == undefined || user.name == undefined || user.username == undefined
      || user.surname == undefined || user.birthdate == undefined || user.gender == undefined || user.email == undefined){
        return false;
      }
      else{
        return true;
      }
    }

    validateEmail(email){
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    validateSendMessage(message){
      if(message.sender == undefined || message.receiver == undefined || message.subject == undefined || message.date == undefined || message.messageContent == undefined){
          return false;
        }
        else{
          return true;
        }
    }
}
