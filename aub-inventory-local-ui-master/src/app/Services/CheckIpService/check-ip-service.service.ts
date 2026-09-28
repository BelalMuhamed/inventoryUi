import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class CheckIpServiceService {

 constructor(private http:HttpClient) { }
   baseLink = environment.baseLink;
   GetUserIP():Observable<any>
   {
    return this.http.get(`${this.baseLink}Auth/Get-Client-ip`);
   }
}
