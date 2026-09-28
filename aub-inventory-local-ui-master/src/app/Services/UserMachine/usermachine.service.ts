import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class UsermachineService {

 constructor(private http :HttpClient) { }
    baseLink = environment.baseLink;

GetMachineByuserName(userName : string|null):Observable<any>
{
  return this.http.get(this.baseLink +'PrintedMachineWithUser/'+userName);
}


}
