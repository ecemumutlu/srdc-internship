import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: Object;

  constructor(private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService,
    ) {    this.showProfile();
    }

  ngOnInit() {


    //this.someMethod();
  }



  onClearClick(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  showProfile(){

    this.authService.getProfile().subscribe((data: any) => {
      if(data.success){
        this.user = data.msg;
        this.callAddActivity();
      }else{
        if(data.msg === 'User not found'){
          console.log(data.msg);
          this.onClearClick();
          this.flashMessage.show(data.msg , {cssClass: 'alert-danger', timeout: 5000});
        }
        else{
          this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 5000});
          if(this.jwtHelper.decodeToken(localStorage.getItem('token'))['userType'] === 'A'){
            this.router.navigate(['/admin']);
          }
          else{
            this.router.navigate(['/notAdmin']);
          }
        }
      }

    })
  }


  callAddActivity(){
    const activity = {
      userId: this.user['_id'],
      username: this.user['username'],
      operation: 'show profile',
      date: Date.now(),
      description: ''
    };

    this.authService.addActivity(activity).subscribe((data: any) =>{
      if(data.success){
        console.log('Activity added.');
      }
      else{
          console.log('Something went wrong in log operation of show profile');
      }
    })
  }

}
