import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  flag: any;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }



  onInbox(){

  }

}
