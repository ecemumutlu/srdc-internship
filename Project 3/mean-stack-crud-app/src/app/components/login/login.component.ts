import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
    ) { }

  ngOnInit(): void {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if((data as any).success){
        this.authService.storeUserData((data as any).token, (data as any).user);
        this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 3000});
        this.callAddActivity((data as any).user);
        console.log(((data as any).user));

        if(((data as any).user as any).userType === 'NA'){
          this.router.navigate(['/notAdmin']);
        }
        else{
          this.router.navigate(['/admin']);
        }
      }
      else{
        this.flashMessage.show(data['msg'], {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['/login']);
      }
    })

  }


  callAddActivity(user){
    console.log(user['id']);
    const activity = {

      userId: user['id'],
      username: user['username'],
      operation: 'login',
      date: Date.now(),
      description: ''
    };

    this.authService.addActivity(activity).subscribe((data: any) =>{
      if(data.success){
        console.log('Activity added.');
      }
      else{
        console.log('Something went wrong in log operation of login');
      }
    })
  }

}
