import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { PeriodicElementActivity } from 'src/app/Interface/PeriodicElementActivity';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  displayedColumns: string[] = ['userId','username','operation','date','description'];

  user: Object;
  activities:any = [];

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

  dataSource: MatTableDataSource<PeriodicElementActivity>;

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private liveAnnouncer: LiveAnnouncer,

    ) {
      this.limitParam = 10;
      this.sortParam = 'username';
      this.sortDir = 1;
      this.skipParam = 0;
      this.size = 10;
      this.starting = 1;
      this.ending = this.limitParam + 1;
    }

  ngOnInit(): void {
    this.readActivities();
  }


  onClearClick(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSelectedSort(value:string): void {
		this.sortParam = value;
    this.readActivities();
	}
  onSelectedLimit(value: number): void {
		this.limitParam = value;
    this.readActivities();
	}



  readActivities(){

    this.apiService.getActivities(this.limitParam,this.sortParam,this.sortDir,this.skipParam).subscribe((data: any) => {
      if(data.success){
        this.size = data.size;

        this.tableHeader = 'ACTIVITIES';

        this.activities = data.msg;

        this.dataSource = new MatTableDataSource<PeriodicElementActivity>(this.activities);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
      else{
        if(data.msg === 'User not found'){
          this.onClearClick();
          this.flashMessage.show(data.msg , {cssClass: 'alert-danger', timeout: 5000});
        }
        else{
          this.flashMessage.show('Something went wrong in log operation of activity', {cssClass: 'alert-danger', timeout: 5000});
          this.router.navigate(['/']);
        }
      }

    })}




    onPaginateChange(event: PageEvent) {
      console.log(event.pageSize)
      if (this.limitParam !== event.pageSize) {
        this.limitParam = event.pageSize;
        this.ending = this.limitParam * (this.skipParam + 1) + 1 ;
      }
      this.readActivities();
    }



    announceSortChange(sortState: Sort){
      if(sortState.direction){
          this.liveAnnouncer.announce('Sorted ${sortState.direction}ending');
          this.sortParam = sortState.active;
          if(sortState.direction !== 'asc'){
            this.sortDir = -1;
          }
          this.readActivities();
      }
      else{
        this.liveAnnouncer.announce('sorting cleared');
      }
    }


    indexBtn(prevOrNext: number){
      if((this.skipParam + prevOrNext) >= 0){
        if(((this.skipParam + prevOrNext) * this.limitParam) < this.size){
          this.skipParam += prevOrNext;
          this.starting = this.skipParam * this.limitParam + 1;
          if(this.starting + this.limitParam >= this.size){
            this.ending = this.size
          }
          else{
            this.ending = this.starting + this.limitParam;
          }
          this.readActivities();
        }
      }
    }
}



















