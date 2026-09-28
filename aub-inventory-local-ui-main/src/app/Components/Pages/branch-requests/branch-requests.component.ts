import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import { PageResult } from 'src/app/ViewModels/IAPiRsponse';
import { BranchRepuestDetailsPopupComponent } from '../../branch-repuest-details-popup/branch-repuest-details-popup.component';
import Swal from 'sweetalert2';
import { BranchRequestDto, BranchRequestFilteration } from 'src/app/Model/BranchRequest/IBranchRequest';

@Component({
  selector: 'app-branch-requests',
  templateUrl: './branch-requests.component.html',
  styleUrls: ['./branch-requests.component.css']
})
export class BranchRequestsComponent implements OnInit{
  constructor(private requestCardService:RequestCardsService,private fb:FormBuilder, private dialog: MatDialog){}
  ngOnInit(): void {
    this.getBranchRequests();
    this.initDateForm();
  }
  requestsForBranch!:PageResult<BranchRequestDto>;
  filters:BranchRequestFilteration={
    pageSize:10,
    pageIndex:1,
    askedRequestUser:null,
    dates:[],
    branchName:null,
    status:[]
  }

  getBranchRequests(){
    let branchName:string = localStorage.getItem("branchName")||"" ;
    this.filters.branchName=branchName;
    console.log(branchName);

    this.requestCardService.getRequestes(this.filters).subscribe({
      next:(data:any)=>{this.requestsForBranch = data;},
      error:(err)=>{  Swal.fire({
                icon: 'error',
                title: 'Loading Failed',
                text:  'Something went wrong. Please try again.'
              });},
    })

  }
onPageChange(event: PageEvent): void {
    this.filters.pageIndex = event.pageIndex + 1;
    this.filters.pageSize = event.pageSize;
    this.getBranchRequests();
  }
totalCount = 0;

  displayedColumns: string[] = ['id', 'destination', 'requestDate','MakedRequestUser','Accept_Refused_User','transactionStatus','actions'];
getTransactionStatusName(status: number): string {
  const statusMap: { [key: number]: string } = {
    0: 'Accepted',
    1: 'Declined',
    2: 'Pending',
  };

  return statusMap[status] || 'Unknown';
}
  range!:FormGroup;
 SelectedTransactionStatus: number[] = [];
initDateForm(){
    this.range = this.fb.group({
      start:[''],
      end:[''],
    })
  }
 onCheckBoxChange(value: number): void {
    if (this.SelectedTransactionStatus.includes(value)) {
      this.SelectedTransactionStatus = this.SelectedTransactionStatus.filter((item) => item !== value);
    } else {
      this.SelectedTransactionStatus.push(value);
    }
  }
  searchCards(){
      let stringDate = JSON.stringify(this.range.value);
      let dateObj = JSON.parse(stringDate);
      let startDate = dateObj.start.substring(0,10);
      let endDate = dateObj.end.substring(0,10);
     this.filters.status=this.SelectedTransactionStatus;
     this.filters.dates=[startDate,endDate];
      console.log(this.filters);

     this.getBranchRequests();
    }
  openDetailsPopup(transactionId: number): void {
    const dialogRef = this.dialog.open(BranchRepuestDetailsPopupComponent, {
      width: '600px',
      data: { id: transactionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed, result:', result);
      }
    });

  }
}
