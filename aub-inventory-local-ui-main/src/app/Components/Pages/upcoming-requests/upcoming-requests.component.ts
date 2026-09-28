import { Component, inject, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import { RequestCardVm } from 'src/app/ViewModels/request-card-vm';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { PageResult } from 'src/app/ViewModels/IAPiRsponse';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BranchRequestDto, BranchRequestFilteration } from 'src/app/Model/BranchRequest/IBranchRequest';
@Component({
  selector: 'app-upcoming-requests',
  templateUrl: './upcoming-requests.component.html',
  styleUrls: ['./upcoming-requests.component.css']
})
export class UpcomingRequestsComponent  {
  isloading:boolean=true;
  private RequestCardService = inject(RequestCardsService);
  private RequestCardSubscription = new Subscription();
  private fb=inject(FormBuilder);
 requestsForBranches!:PageResult<BranchRequestDto>;
  filters:BranchRequestFilteration={
    pageSize:10,
    pageIndex:1,
    askedRequestUser:null,
    dates:[],
    branchName:null,
    status:[]
  }
  totalCount = 0;
   range!:FormGroup;
 SelectedTransactionStatus: number[] = [];
displayedColumns: string[] = ['id', 'destination', 'requestDate','MakedRequestUser','Accept_Refused_User','transactionStatus','actions'];
ngOnInit()
{
  this.initDateForm();
  this.GetBranchesRequests();
}
ngOnDestroy(){
this.RequestCardSubscription?.unsubscribe();
}
 onCheckBoxChange(value: number): void {
    if (this.SelectedTransactionStatus.includes(value)) {
      this.SelectedTransactionStatus = this.SelectedTransactionStatus.filter((item) => item !== value);
    } else {
      this.SelectedTransactionStatus.push(value);
    }
  }
GetBranchesRequests()
{
  this.RequestCardSubscription.add(this.RequestCardService.getRequestes(this.filters).subscribe({
    next:(res)=>{
    this.requestsForBranches=res;
    this.totalCount = res.totalCount;

    console.log(res);


    },
    error:(err)=>{
  Swal.fire({
                icon: 'error',
                title: 'Loading Failed',
                text:  'Something went wrong. Please try again.'
              });
    },
    complete:()=>{
      this.isloading=false;
    }
  }))
}
onPageChange(event: PageEvent): void {
    this.filters.pageIndex = event.pageIndex + 1;
    this.filters.pageSize = event.pageSize;
    this.GetBranchesRequests();
}
getTransactionStatusName(status: number): string {
  const statusMap: { [key: number]: string } = {
    0: 'Accepted',
    1: 'Declined',
    2: 'Pending',
  };

  return statusMap[status] || 'Unknown';
}
initDateForm(){
    this.range = this.fb.group({
      start:[''],
      end:[''],
    })
  }
 onRejectRequest(item: BranchRequestDto) {
  const RejectedTransaction :BranchRequestDto={


  id: item.id,
  destination: item.destination,
  requestDate: item.requestDate,
  acceptDeclinedDate: (new Date()).toISOString(),
  transactionStatus: 1,
  askingTransactionUser: item.askingTransactionUser,
  acceptRequestUser:localStorage.getItem("username")

  }
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you really want to reject request #${item.id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, reject it',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.RequestCardService.updateTransaction(item.id,RejectedTransaction).subscribe({
        next:()=>{
          Swal.fire({
              icon: 'success',
              title: 'Rejected!',
              text: 'The request has been rejected successfully.',
              timer: 2000,
              showConfirmButton: false
            });
            this.GetBranchesRequests();
        },
        error:(err)=>{

          Swal.fire({
               icon: 'error',
               title: 'Error',
               text: err.error?.message || 'Failed to reject the request.'
             });

        }
      })
    } else {
      Swal.close();
    }
  });
}
searchCards(){
      let stringDate = JSON.stringify(this.range.value);
      let dateObj = JSON.parse(stringDate);
      let startDate = dateObj.start.substring(0,10);
      let endDate = dateObj.end.substring(0,10);
     this.filters.status=this.SelectedTransactionStatus;
     this.filters.dates=[startDate,endDate];
      console.log(this.filters);

     this.GetBranchesRequests();
    }

}
