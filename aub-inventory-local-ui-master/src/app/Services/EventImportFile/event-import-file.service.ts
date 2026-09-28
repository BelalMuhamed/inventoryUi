import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class EventImportFileService {

  constructor(private http: HttpClient) { }

  baseLink = environment.baseLink;
  
  uploadFile(file:FormData){
    return this.http.post(this.baseLink +"ImportFile/UploadFile",file);
  }
  
  forceSettleCards(file:FormData){
    return this.http.post(this.baseLink +"ImportFile/ForceSettleCards",file);
  }
}
