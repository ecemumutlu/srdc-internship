
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { AuthService } from './../../service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import  { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  ngOnInit(): void {


  }
/*
  user: Object;
  id: string;
  Message:any = [];
  tableHeader: string;
  @ViewChild('paginator') paginator: MatPaginator;

  dataSource: MatTableDataSource<Document>;

  displayedColumns: string[] = ['_id','sender','receiver','subject','date','messageContent'];
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private jwtHelper: JwtHelperService
    ) {
      this.readProfile();

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.readMessage();

    this.allInboxOrInbox();
    this.inboxOrOutbox();

  }

  ngAfterViewInit(){

  }

  readMessage(){
    this.apiService.getMessages().subscribe((data: Document[]) => {
      console.log('buradasin');
     this.Message = data;
     this.dataSource = new MatTableDataSource<Document>(this.Message);
     this.dataSource.paginator = this.paginator;

     this.callAddActivity();

    })
  }
  removeMessage(message, index) {
    if(window.confirm('Are you sure?')) {
        this.apiService.deleteMessage(message._id).subscribe((data) => {
          this.Message.splice(index, 1);
        }
      )
    }
  }

  readProfile(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.user = token;
  }

  inboxOrOutbox(){
    if (this.id !== '3'){
      return true; //inbox
    }
    else{
      this.tableHeader = 'OUTBOX';
      return false; //outbox
    }
  }

  allInboxOrInbox(){
    if (this.id === '1'){
      this.tableHeader = 'ALL MESSAGES';
      return true; //all inbox
    }
    else{
      this.tableHeader = 'INBOX';
      return false; //inbox
    }

  }


  callAddActivity(){
    const activity = {
      userId: this.user['_id'],
      username: this.user['username'],
      operation: 'show '+ this.tableHeader.toLowerCase(),
      date: Date.now(),
      description: ''
    };

    this.authService.addActivity(activity).subscribe((data: any) =>{
      if(data.success){
        console.log('Activity added.');
      }
      else{
        console.log('Something went wrong in log operation of send message', {cssClass: 'alert-danger', timeout: 5000});
      }
    })

  }

*/

}
