import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/Services/TransactionServices/transaction.service';
import { TransactionGetVm } from 'src/app/ViewModels/transaction-get-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch-transactions',
  templateUrl: './branch-transactions.component.html',
  styleUrls: ['./branch-transactions.component.css']
})
export class BranchTransactionsComponent implements OnInit{
  constructor(private transactionsService:TransactionService){}

  ngOnInit(): void {
    this.getTransactionsForBranch();
  }

  branchTransactions:TransactionGetVm[] = [];
  getTransactionsForBranch(){
    let branchName:string = localStorage.getItem("branchName")||"" // to be set from local storage
    this.transactionsService.getTransactionsForBranch(branchName).subscribe({
      next:(data:any)=>{this.branchTransactions = data; console.log(data)},
      error:(err)=>console.log(err),
      complete:()=>{console.log("Get Transactions for branch done")}
    })
  }

  confirmTransaction(transaction:TransactionGetVm){
    transaction.userName = localStorage.getItem("username")||""
    this.transactionsService.updateTransactionToConfirmed(transaction).subscribe({
      next:(data:any)=>{},
      error:(err)=>{console.log(err),
        Swal.fire({
          icon:"error",
          title:"Something Went Wrong",
          text:err.error||err||err.error.errorMessage
        })
      },
      complete:()=> {
        this.getTransactionsForBranch();
        Swal.fire({
          icon: "success",
          title: "Cards Recieved Successfully",
          showConfirmButton: false,
          timer: 2000
        });
      },
    })
  }
}
