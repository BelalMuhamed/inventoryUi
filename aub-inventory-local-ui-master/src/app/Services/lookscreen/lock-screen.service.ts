import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';


@Injectable({
  providedIn: 'root'
})
export class LockScreenService {

  constructor(private http:HttpClient) { }
  baseLink = environment.baseLink;
  lockScreen(): Observable<any> {
    return this.http.post(`${this.baseLink}lock-screen`, {});
  }

}
