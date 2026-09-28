import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from 'src/app/Model/Groups/group';
import { GroupNamesVM } from 'src/app/ViewModels/group-names-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class GroupNamesService {
  baseLink = environment.baseLink;

  constructor(private http:HttpClient) { }
  private addGroupNameLink = this.baseLink + "GroupNames";
  
  addGroupName(groupName:GroupNamesVM){
    return this.http.post(this.addGroupNameLink,groupName)
  } 

  getGroups() : Observable<any> {
    return this.http.get(this.addGroupNameLink);
  }

  getBranchGroups(branchName:string) : Observable<Group[]>{
    return this.http.get<Group[]>(this.addGroupNameLink + '/GetBranchGroups?branchName=' + branchName);
  }

  deleteGroup(groupId:number) {
    return this.http.delete<any>(this.addGroupNameLink  +"/" + groupId);
  }
}
