import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'src/app/service/validate.service';
import { AuthService } from 'src/app/service/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ignoreElements } from 'rxjs';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted = false;
  UserGender: any = ['Female','Male'];
  UserType: any = ['NA','A'];
  id: string;
  user_id: string;

  UserObject: Object;

  userType: String;
  username: String;
  password: String;
  name: String;
  surname: String;
  gender: String;
  birthdate: Date;
  email: String;
  editForm: FormGroup;


  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    public fb: FormBuilder,
    ) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.user_id = this.route.snapshot.paramMap.get('user');
     }

  ngOnInit(): void {
    this.someMethod();

    /*
    if(this.id === '1'){
      this.updateUser();
      this.getUser(this.user_id);
      this.editForm = this.fb.group({
        userType: ['', [Validators.required]],
        username: ['',[Validators.required]],
        password: ['', [Validators.required]],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        birthdate: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        email: ['',[Validators.required],
        ],
      });
    }
    */
  }



  onCancelClick(){
    this.router.navigate(['/admin']);
  }



	onSelected(value:string): void {
		this.userType = value;
	}

  onSelectedGender(value:string): void {
		this.gender = value;
	}

  onClearClick(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onRegisterSubmit(){
      this.submitted = true;
      console.log(this.userType);

      const user = {
        userType: this.userType,
        username: this.username,
        password: this.password,
        name: this.name,
        surname: this.surname,
        gender: this.gender,
        birthdate: this.birthdate,
        email: this.email
      }

      //Required fields
      if(!this.validateService.validateRegister(user)){
        this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 2000});
        return false;
      }

      //Validate email
      if(!this.validateService.validateEmail(user.email)){
        this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 2000});
        return false;
      }

      //Register User

      this.authService.registerUser(user).subscribe((data: any) => {
        if(data.success){
          this.flashMessage.show('User created', {cssClass: 'alert-success', timeout: 5000});
          this.router.navigate(['/users-list'])
          this.callAddActivity(user);
        }
        else{
          if(data.msg === 'User not found'){
            this.onClearClick();
            this.flashMessage.show(data.msg , {cssClass: 'alert-danger', timeout: 5000});
          }
          else{
            this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 5000});
            this.router.navigate(['/register']);
          }

        }
      })
  }

  someMethod(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.UserObject = token;
  }


//-----------------------update------------------------

/*
updateGender(e) {
  this.editForm.get('gender').setValue(e, {
    onlySelf: true,
  });
}

updateUserType(e) {
  this.editForm.get('userType').setValue(e, {
    onlySelf: true,
  });
}


  // Getter to access form control
  get myForm() {
    return this.editForm.controls;
  }
  getUser(id) {
    this.apiService.getUser(id).subscribe((data: any) => {
      if(data.success){
        this.editForm.setValue({
          userType: data.msg['userType'],
          username: data.msg['username'],
          password: data.msg['password'],
          name: data.msg['name'],
          surname: data.msg['surname'],
          birthdate: new Date(data.msg['birthdate']),
          gender: data.msg['gender'],
          email: data.msg['email'],
        });
      }
      else{
        if(data.msg === 'User not found'){
          this.onClearClick();
          this.flashMessage.show(data.msg , {cssClass: 'alert-danger', timeout: 5000});
        }
        else{
          this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 5000});
          this.router.navigate(['/users-list']);
        }

      }

    });
  }
  updateUser() {
    this.editForm = this.fb.group({
      userType: ['', [Validators.required]],
      username: ['',[Validators.required]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['',[Validators.required],
      ],
    });
  }

*/

  callAddActivity(user){
    const activity = {
      userId: this.UserObject['_id'],
      username: this.UserObject['username'],
      operation: 'create user',
      date: Date.now(),
      description: 'admin: ' + this.UserObject['username'] + ' created a user named ' + user.username
    };

    this.authService.addActivity(activity).subscribe((data: any) =>{
      if(data.success){
        console.log('Activity added.');
        this.router.navigate(['/admin']);
      }
      else{
        console.log('Something went wrong in log operation of create-user');
      }
    })
  }

}
