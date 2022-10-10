import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit {
  submitted = false;
  userForm: FormGroup;
  UserGender: any = ['Female','Male'];
  UserType: any = ['NA','A'];


  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) {
    this.mainForm();
  }
  ngOnInit() {}
  mainForm() {
    this.userForm = this.fb.group({
      userType: ['', [Validators.required]],
      username: ['',[Validators.required]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['',[Validators.required]],
    });
  }
  // Choose designation with select dropdown
  updateGender(e) {
    this.userForm.get('gender').setValue(e, {
      onlySelf: true,
    });
  }

  updateUserType(e) {
    this.userForm.get('userType').setValue(e, {
      onlySelf: true,
    });
  }
  // Getter to access form control
  get myForm() {
    return this.userForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.userForm.valid) {
      return false;
    } else {
      return this.apiService.createUser(this.userForm.value).subscribe({
        complete: () => {
          console.log('User successfully created!'),
            this.ngZone.run(() => this.router.navigateByUrl('/users-list'));
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }
}
