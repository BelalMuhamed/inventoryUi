import { Component, OnInit } from '@angular/core';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import { RequestCardVm } from 'src/app/ViewModels/request-card-vm';

@Component({
  selector: 'app-branch-requests',
  templateUrl: './branch-requests.component.html',
  styleUrls: ['./branch-requests.component.css']
})
export class BranchRequestsComponent implements OnInit{
  constructor(private requestCardService:RequestCardsService){}
  ngOnInit(): void {
    this.getBranchRequests();
  }
  requestsForBranch:RequestCardVm[] = []

  getBranchRequests(){
    let branchName:string = localStorage.getItem("branchName")||"" // to be set from local storage
    this.requestCardService.getRequestedCardsForBranch(branchName).subscribe({
      next:(data:any)=>{this.requestsForBranch = data; console.log(data)},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Get Requests")}
    })

  }


}
