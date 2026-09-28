import { IAUBUsersParams } from './../../Model/Users/iuser-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUBUsersResponse, user } from 'src/app/Components/Pages/user/Model/user';
import { environment } from 'src/environments/environment.production';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseLink = environment.baseLink;
  constructor(private http:HttpClient) { }

  getAll():Observable<user[]>{
    return this.http.get<user[]>(this.baseLink + 'user/getAll',{});
  }

  update(user:user):Observable<any> {
    return this.http.put(this.baseLink+'user/update',user);
  }

  delete(username:string):Observable<any> {
    return this.http.delete(this.baseLink + 'user/remove?username='+username);
  }

  add(user:user):Observable<user>{
    return this.http.post<user>(this.baseLink+ 'user/Add',user);
  }
  GetUsersCount():Observable<number>
  {
   return this.http.get<number>(this.baseLink+'user/Get-Users-Count');
  }
 getUsers(_params:IAUBUsersParams):Observable<AUBUsersResponse>{
   let queryParams = new HttpParams()
      .set('pageNumber', _params.pageNumber)
      .set('pageSize', _params.pageSize);

    if (_params.search) {
      queryParams = queryParams.set('search', _params.search);
    }

    return this.http.get<AUBUsersResponse>(`${this.baseLink}User/Users`, {
      params: queryParams,
    });
  }

}
