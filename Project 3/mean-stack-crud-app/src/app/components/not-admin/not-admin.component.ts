import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-not-admin',
  templateUrl: './not-admin.component.html',
  styleUrls: ['./not-admin.component.css']
})
export class NotAdminComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
