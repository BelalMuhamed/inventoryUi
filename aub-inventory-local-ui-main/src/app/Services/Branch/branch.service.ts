import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BranchReadVM } from 'src/app/ViewModels/branch-read-vm';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { environment } from 'src/environments/environment.production';
@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http:HttpClient) { }
  baseLink = environment.baseLink;
  getAllBranches() : Observable<BranchReadVM[]>
  {
    return this.http.get<BranchReadVM[]>(this.baseLink + "Branch/GetBranch");
  }

  addBranch(branch:BranchVm){
    return this.http.post(this.baseLink + "branch/",branch);
  }

  updateBranch(oldBranchName:string,newBranchName:string){
    return this.http.put(this.baseLink + "branch/",{},{
      params:{
        "oldBranchName":oldBranchName,
        "newBranchName":newBranchName
      }
    })
  }

  getByBranchName(branchname:string|null):Observable<any>
  {
    return this.http.get(`${this.baseLink}Branch/branches/${branchname}`);
  }
  GetBranchesCount():Observable<number>
  {
    return this.http.get<number>(`${this.baseLink}Branch/Get-Branches-Count`);
  }
}
