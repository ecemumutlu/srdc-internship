import { Component, OnInit , ViewChild} from '@angular/core';
import { PeriodicElement } from 'src/app/Interface/PeriodicElement';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { AuthService } from './../../service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.css']
})
export class MsgListComponent implements OnInit {

  displayedColumns: string[] = ['_id','sender','receiver','subject','date','button'];
  user: Object;
  id: string;
  sortParam: string;
  limitParam: number;
  Message:any = [];
  skipParam: number;
  size: number;
  starting: number;
  ending; number;

  sortDir: number;
  //dataSource:any = [];

  tableHeader: string;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  dataSource: MatTableDataSource<PeriodicElement>;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private liveAnnouncer: LiveAnnouncer,
    private flashMessage: FlashMessagesService,
    private router: Router,
    ) {
      this.readProfile();
      this.id = this.route.snapshot.paramMap.get('id');
      this.allInboxOrInbox();
      this.inboxOrOutbox();
      this.limitParam = 10;
      this.sortParam = 'sender';
      this.sortDir = 1;
      this.skipParam = 0;
      this.size = 10;
      this.starting = 1;
      this.ending = this.limitParam + 1;


  }

  ngOnInit(): void {
    this.readMessage();
  }

  onClearClick(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSelectedSort(value:string): void {
		this.sortParam = value;
    this.readMessage();
	}
  onSelectedLimit(value: number): void {
		this.limitParam = value;
    this.readMessage();
	}

  readMessage(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.user = token;
    if(this.id === '3'){
      this.apiService.getOutbox(this.limitParam,this.sortParam,this.sortDir,this.skipParam).subscribe((data: any) => {
        if(data.success){
          this.size = data.size;

          this.tableHeader = 'OUTBOX';
          this.Message = data.msg;
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.Message);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;



          this.callAddActivity();
          this.router.navigate(['/user.route/msg-list/3']);
        }
        else{
          if(data.msg === 'User not found'){
            this.onClearClick();
            this.flashMessage.show(data.msg , {cssClass: 'alert-danger', timeout: 5000});
          }
          else{
            this.flashMessage.show('Something went wrong in log operation of outbox', {cssClass: 'alert-danger', timeout: 5000});
            this.router.navigate(['/']);
          }
        }

      })
    }
    else if(this.id === '2'){
      this.apiService.getInbox(this.limitParam,this.sortParam,this.sortDir,this.skipParam).subscribe((data: any) => {
        if(data.success){
          this.size = data.size;

          this.tableHeader = 'INBOX';
          this.Message = data.msg;

          this.dataSource = new MatTableDataSource<PeriodicElement>(this.Message);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.callAddActivity();
        }
        else{
          if(data.msg === 'User not found'){
            this.onClearClick();
            this.flashMessage.show(data.msg , {cssClass: 'alert-danger', timeout: 5000});
          }
          else{
            this.flashMessage.show('Something went wrong in log operation of outbox', {cssClass: 'alert-danger', timeout: 5000});
            this.router.navigate(['/']);
          }
        }

      })
    }
    else{
      this.apiService.getMessages(this.limitParam,this.sortParam,this.sortDir,this.skipParam).subscribe((data: any) => {
        if(data.success){
          this.size = data.size;

          this.tableHeader = 'ALL MESSAGES';
          this.Message = data.msg;

          this.dataSource = new MatTableDataSource<PeriodicElement>(this.Message);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.callAddActivity();
        }
        else{
          if(data.msg === 'User not found'){
            this.onClearClick();
            this.flashMessage.show(data.msg , {cssClass: 'alert-danger', timeout: 5000});
          }
          else{
            this.flashMessage.show('Something went wrong in log operation of outbox', {cssClass: 'alert-danger', timeout: 5000});
            this.router.navigate(['/']);
          }
        }

      })
    }


  }

  onPaginateChange(event: PageEvent) {
    if (this.limitParam !== event.pageSize) {
      this.limitParam = event.pageSize;
      this.ending = this.limitParam * (this.skipParam + 1) + 1 ;
    }
    this.readMessage();
  }



  announceSortChange(sortState: Sort){
    if(sortState.direction){
        this.liveAnnouncer.announce('Sorted ${sortState.direction}ending');
        this.sortParam = sortState.active;
        if(sortState.direction !== 'asc'){
          this.sortDir = -1;
        }
        this.readMessage();
    }
    else{
      this.liveAnnouncer.announce('sorting cleared');
    }
  }


  indexBtn(prevOrNext: number){
    if((this.skipParam + prevOrNext) >= 0){
      if((((this.skipParam + prevOrNext) * this.limitParam) < this.size)){
        this.skipParam += prevOrNext;
        this.starting = this.skipParam * this.limitParam + 1;
        if(this.starting + this.limitParam >= this.size){
          this.ending = this.size
        }
        else{
          this.ending = this.starting + this.limitParam;
        }
        this.readMessage();
      }
    }
    else{
      this.skipParam = 0;
    }
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



  readMsg(msg){
    let modal = document.getElementById('modal');
    let modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = msg;
    modal.style.display = 'block';
    modal.style.position = 'absolute';
    modal.style.left = '50%'
    modal.style.top = '30%';
    modal.style.zIndex = '100';
    modal.style.transform = 'translate(-50%, 0)';
    modal.style.backgroundColor = 'skyblue';
    modal.style.padding = '10px 15px'
  }


  closeRead(){
    let modal = document.getElementById('modal');
    modal.style.display = 'none';
  }



}
