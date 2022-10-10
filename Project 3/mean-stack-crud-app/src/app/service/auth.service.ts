import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from 'src/app/service/api.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

//import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken: any;
  user: any;
  flag: any;
  baseUri: string = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private jwtHelper: JwtHelperService) { }

  registerUser(user){
    let headers = new HttpHeaders();
    this.loadToken();
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    headers =  headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:4000/user.route/register', user, {headers: this.headers.append('Authorization',localStorage.getItem('token')).append('UserID',token['_id'])}).pipe(catchError(this.errorMgmt));
  }

  authenticateUser(user){
    return this.http.post('http://localhost:4000/user.route/authenticate', user, {headers: this.headers});
  }


  isUserAuthenticated(user){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return this.http.post('http://localhost:4000/user.route/isAuthenticated', user, {headers: this.headers.append('UserID',token['_id']).append('Authorization',localStorage.getItem('token'))}).pipe(catchError(this.errorMgmt));
  }

  storeUserData(token, user){
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user;
    this.flag = user.userType;
  }



  logout(){
    console.log('logouttayım')
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn(){
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(localStorage.getItem('token'));
    return isExpired;
  }






  isAdmin(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.user = token;
    if(this.user['userType'] === 'A'){
      return true;
    }
    else{
      return false;
    }
  }





  getProfile(){

    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    //headers = headers.append('UserID',token['_id'])
    //headers = headers.append('Authorization',this.authToken);
    //headers =  headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:4000/user.route/profile', {headers: this.headers.append('UserID',token['_id']).append('Authorization',localStorage.getItem('token'))}).pipe(catchError(this.errorMgmt));
  }

  loadToken(){
    const token = localStorage.getItem('token');
    this.authToken = token;
  }



  sendMessage(message){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return this.http.post('http://localhost:4000/user.route/create-message', message, {headers: this.headers.append('UserID',token['_id']).append('Authorization',localStorage.getItem('token'))}).pipe(catchError(this.errorMgmt));
  }


  addActivity(activity){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return this.http.post('http://localhost:4000/user.route/add-activity', activity, {headers: this.headers.append('UserID',token['_id']).append('Authorization',localStorage.getItem('token'))}).pipe(catchError(this.errorMgmt));
  }


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
    return throwError(() => {
      return errorMessage;
    });
  }

}


