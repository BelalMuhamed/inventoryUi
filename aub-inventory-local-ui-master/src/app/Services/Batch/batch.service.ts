import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  baseLink = environment.baseLink;
  constructor(private http:HttpClient) 
  { 
    
  }

  uploadFile(file:FormData) : Observable<any>{
    return this.http.post<any>(this.baseLink + "batch/UploadFile",file);
  }

   
}
