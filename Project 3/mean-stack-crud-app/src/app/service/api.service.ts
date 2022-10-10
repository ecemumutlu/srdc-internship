
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUri: string = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService) {}


  //Create user
  createUser(data): Observable<any> {
    let url = `${this.baseUri}/create`;
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    return this.http.post(url, data,{ headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])}).pipe(catchError(this.errorMgmt));
  }
  // Get all employees
  getUsers() {
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    return this.http.get(`${this.baseUri}`,{ headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])});
  }
  // Get employee
  getUser(id): Observable<any> {
    let url = `${this.baseUri}/read/${id}`;
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    return this.http.get(url, { headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])}).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }
  // Update employee
  updateUser(id, data): Observable<any> {
    let url = `${this.baseUri}/update/${id}`;
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    return this.http
      .put(url, data, { headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])})
      .pipe(catchError(this.errorMgmt));
  }


  // Update employee
  updateUser2(id, data): Observable<any> {
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return this.http
      .put('http://localhost:4000/user.route/update2/'+ id , data, { headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])})
      .pipe(catchError(this.errorMgmt));
  }


  // Delete employee

  loggedIn(){
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(localStorage.getItem('token'));
    return isExpired;
  }

  deleteUser(id): Observable<any> {
    let headers = new HttpHeaders();

    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    return this.http
    .delete('http://localhost:4000/user.route/delete/'+id,{ headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])})
    .pipe(catchError(this.errorMgmt));
  }




  //---------------------messages-----------------------------//
    //Create message
  createMessage(data): Observable<any> {
    let url = `${this.baseUri}/create-message`;
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    return this.http.post(url, data,{ headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])}).pipe(catchError(this.errorMgmt));
  }
  // Get all messages
  getMessages(limit,sort,sortDir,skip) {
    console.log("get messages tasin");
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);

    return this.http
    .get('http://localhost:4000/user.route/get-messages/' + limit + '/' + sort +  '/' + sortDir + '/' + skip, { headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])}).pipe(catchError(this.errorMgmt));

    //return this.http.get(`${this.baseUri}/get-messages`);
  }

  getInbox(limit,sort,sortDir,skip) {

    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    //this.headers = this.headers.append('Authorization',localStorage.getItem('token'));
    return this.http.get('http://localhost:4000/user.route/get-inbox/' + limit + '/' + sort +  '/' + sortDir + '/' + skip, { headers: this.headers.append('Username',token['username']).append('UserID',token['_id']).append('Authorization',localStorage.getItem('token')) }).pipe(catchError(this.errorMgmt));
  }
  getOutbox(limit,sort,sortDir,skip){
    console.log("get outbox tasin");

    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    //this.headers = this.headers.append('Authorization',localStorage.getItem('token'));
    return this.http.get('http://localhost:4000/user.route/get-outbox/' + limit + '/' + sort +  '/' + sortDir + '/' + skip, { headers: this.headers.append('Username',token['username']).append('UserID',token['_id']).append('Authorization',localStorage.getItem('token')) }).pipe(catchError(this.errorMgmt));
  }

  // Get message
  getMessage(id): Observable<any> {
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    let url = `${this.baseUri}/read/${id}`;
    return this.http.get(url,{ headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])}).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }
  // Update message
  updateMessage(id, data): Observable<any> {
    let url = `${this.baseUri}/update/${id}`;
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    return this.http
      .put(url, data,{ headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])})
      .pipe(catchError(this.errorMgmt));
  }
  // Delete message
  deleteMessage(id): Observable<any> {
    let url = `${this.baseUri}/delete/${id}`;
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
    return this.http
      .delete(url, { headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])})
      .pipe(catchError(this.errorMgmt));
  }

//------------------------------------ACTIVITY---------------------------------//
    //Create message
    createActivity(data): Observable<any> {
      let url = `${this.baseUri}/add-activity`;
      const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
      //this.headers = this.headers.append('UserID',token['_id']);
      return this.http.post(url, data,{ headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])}).pipe(catchError(this.errorMgmt));
    }
    // Get all messages
    getActivities(limit,sort,sortDir,skip) {
      const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
      //this.headers = this.headers.append('UserID',token['_id']);
      return this.http.get('http://localhost:4000/user.route/get-activities/' + limit + '/' + sort +  '/' + sortDir + '/' + skip,{ headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])});
    }
    // Get message
    getActivity(id): Observable<any> {
      let url = `${this.baseUri}/read/${id}`;
      const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
      //this.headers = this.headers.append('UserID',token['_id']);
      return this.http.get(url, { headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])}).pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
      );
    }
    // Update message
    updateActivity(id, data): Observable<any> {
      let url = `${this.baseUri}/update/${id}`;
      const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
      //this.headers = this.headers.append('UserID',token['_id']);
      return this.http
        .put(url, data, { headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])})
        .pipe(catchError(this.errorMgmt));
    }
    // Delete message
    deleteActivity(id): Observable<any> {
      let url = `${this.baseUri}/delete/${id}`;
          const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //this.headers = this.headers.append('UserID',token['_id']);
      return this.http
        .delete(url, { headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])})
        .pipe(catchError(this.errorMgmt));
    }


//--------------------------------------------ERROR------------------------------------//



  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    //localStorage.clear();
    return throwError(() => {
      return errorMessage;
    });
  }
}
