import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import { RequestCardVm } from 'src/app/ViewModels/request-card-vm';
import { MatDialog } from '@angular/material/dialog';
import { ApproveRequestModalComponent } from './approve-request-modal/approve-request-modal.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-upcoming-requests',
  templateUrl: './upcoming-requests.component.html',
  styleUrls: ['./upcoming-requests.component.css']
})
export class UpcomingRequestsComponent implements OnInit {
  constructor(private cardRequestService:RequestCardsService,public dialog: MatDialog,private requestCardService:RequestCardsService){
    //this.requestCardConnection = new HubConnectionBuilder().withUrl("http://172.30.240.80:1234/requestCardHub").build()
  }
  ngOnInit(): void {
    // this.requestCardConnection.start()
    // .then(()=>{this.subscribeToRequestCardNotification()})
    // .catch(err => console.error(err));  

    this.getRequestedCards();
  }
  //private requestCardConnection:HubConnection;
  upcomingRequests:RequestCardVm[] = [];
  // subscribeToRequestCardNotification(){
  //   this.requestCardConnection.on("requestCard",(request:RequestCardVm)=>{
  //     console.log(request);
  //     this.upcomingRequests.push(request)
  //   });
  // }
  getRequestedCards(){
    this.cardRequestService.getRequestedCards().subscribe({
      next:(data:any)=>{this.upcomingRequests = data;console.log(data)},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("get all requests done")}
    })
  }

  openApproveRequestDialog(request:RequestCardVm): void {
    const dialogRef = this.dialog.open(ApproveRequestModalComponent, {
      data:{request: request}
    });
    dialogRef.componentInstance.processCompleted.subscribe((result)=>{
      console.log("print result here: ",result);
      if(result.success){
        this.upcomingRequests = this.upcomingRequests.filter(req=>req.id != result.request.id);
        this.getRequestedCards();
      }
    })
    // dialogRef.beforeClosed().subscribe(result=>{
    //   if(result.isApproved){
    //     console.log("Remove Request");
    //     this.upcomingRequests = this.upcomingRequests.filter(req=>req.id != result.request.id);
    //   }
    // })

    // dialogRef.afterClosed().subscribe(
    //   {
    //     next:(result) => {
    //         console.log(result);
    //         if(result.isApproved){
    //           console.log("Remove Request");
    //           this.upcomingRequests = this.upcomingRequests.filter(req=>req.id != result.request.id);
    //         }
    //     },
    //     complete:() => {
    //       this.getRequestedCards();
    //     }
    // });
  }

  cancelRequest(request:RequestCardVm){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cancel Request',
      cancelButtonText:"Dismiss"
    }).then((result) => {
      debugger;
      if (result.isConfirmed) {
        this.requestCardService.updaterequestCardsToDeclined(request).subscribe({
          next:(data:any)=>{},
          error: (err) => { console.log(err),
            Swal.fire({
              icon:"error",
              title:"Something Went Wrong",
              text:err.error||err
            })
           },
          complete: () => { 
            Swal.fire({
              icon:"success",
              title:"Request Cancelled Successfully",
              timer:2000,
              showConfirmButton:false,
            })
            this.getRequestedCards() }
        })
      }
    })
    
  }
}
