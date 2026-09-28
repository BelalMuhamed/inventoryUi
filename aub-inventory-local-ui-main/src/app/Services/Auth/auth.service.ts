import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IUserModel } from '../../Model/Users/iuser-model';
import { IToken } from '../../Model/itoken';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseLink = environment.baseLink;
  private token: IToken = {} as IToken;
  private isLoggedSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isUserLogged);

  constructor(private http: HttpClient) { }

  getADUsers():Observable<string[]> {
    return this.http.get<string[]>(this.baseLink + 'Auth/GetADUsers');
  }

  //Login
  getToken(credentials: IUserModel): Observable<IToken> {
    return this.http.post<IToken>(this.baseLink + 'Auth/Login', credentials).pipe(
      tap(
        response => {
          this.isLoggedSubject.next(true);
          console.log(response);
          //setToken
          this.token = response;
          //save token in local storage
          localStorage.setItem("token", response.token);
          //set username in localStorage
          localStorage.setItem("username", response.userName);
          //set username in localStorage
          localStorage.setItem("name", response.name);
          //set Roles in local Storage
          localStorage.setItem("roles", response.role);
          //set Roles in local Storage
          localStorage.setItem("branchName", response.branchName);
          
        }
      )
    );
  }
  validateCardCenterAdmin(username:string,password:string){
    return this.http.post(this.baseLink+"Auth/ValidateCardCenterAdmin",{},{
      params:{
        "username":username,
        "password":password
      }
    })
  }

  //Log out
  logOut() {
    localStorage.clear();
    this.isLoggedSubject.next(false);
  }



  //Get User status
  get isUserLogged():boolean {
    return (localStorage.getItem('token')) ? true : false;
  }


  //User Status Subject
  get loggedStatus() : Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }



  getAllGroups() : Observable<string[]> {
    return this.http.get<string[]>(this.baseLink + "auth/GetAllGroups");
  }





}
