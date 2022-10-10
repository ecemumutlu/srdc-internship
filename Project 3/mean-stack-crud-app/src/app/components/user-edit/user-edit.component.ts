

import { User } from './../../../model/user';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  userData: User[];
  UserGender: any = ['Female','Male'];
  UserType: any = ['NA','A'];
  UserObject: Object;


  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private jwtHelper: JwtHelperService

  ) {}
  ngOnInit() {
    this.updateUser();
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.getUser(id);
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

  onClearClick(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSubmit() {
    this.submitted = true;
    if (!this.editForm.valid) {
      return false;
    } else {
      if (window.confirm('Are you sure?')) {
        let id = this.actRoute.snapshot.paramMap.get('id');
        this.apiService.updateUser(id, this.editForm.value).subscribe((data: any) => {
          if(data.success){
            this.flashMessage.show('User updated', {cssClass: 'alert-success', timeout: 5000});
            this.router.navigate(['/users-list']);
            this.callAddActivity();
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
    }
  }





  callAddActivity(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.UserObject = token;
    const activity = {
      userId: this.UserObject['_id'],
      username: this.UserObject['username'],
      operation: 'edit user',
      date: Date.now(),
      description: ''
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
