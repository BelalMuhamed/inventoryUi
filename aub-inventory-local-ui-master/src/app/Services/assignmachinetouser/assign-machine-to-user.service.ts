import { user } from './../../Components/Pages/user/Model/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IassignMachineToUserRequest } from 'src/app/ViewModels/iassign-machine-to-user';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class AssignMachineToUserService {



    constructor(private http:HttpClient) { }
    baseLink = environment.baseLink;
    GetAllUserWithMachines(branchName:string|null):Observable<any>
    {
    return this.http.get(this.baseLink + 'PrintedMachineWithUser', {
  params: { branchName: branchName ?? '' }
});
    }
  UpdateMachineWithUser(req:IassignMachineToUserRequest):Observable<any>
  {
    return  this.http.put(this.baseLink+'PrintedMachineWithUser',req,{responseType: 'text'});
  }

  Delete(userName :string) :Observable<any>
{
  return this.http.delete(this.baseLink+'PrintedMachineWithUser/Machine-users/delete/'+userName,{
  responseType: 'text'
});
}
 GetUserWithOutMachine( branchName:string):Observable<any>
 {
  return this.http.get(this.baseLink+'PrintedMachineWithUser/users-without-machines/'+branchName);
 }
 Add(AddedObj : IassignMachineToUserRequest):Observable<any>
 {
  return this.http.post(this.baseLink+'PrintedMachineWithUser',AddedObj,{responseType: 'text'});
 }

}
