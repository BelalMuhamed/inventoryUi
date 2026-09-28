import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionClass, MachineConnectionClass } from 'src/app/Model/LAN/machine-connection-class';

@Injectable({
  providedIn: 'root'
})
export class CallMAchineService {

  constructor(private http :HttpClient) { }
  // httpPOST(jsonCommand: string, commandName: string | null,_conn:MachineConnectionClass,_action:ActionClass):Observable<any>
  // {
  //     const url = `https://${_conn.MachineIP()}/${_action.sAction}`;
  //      const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });



  // }
}
