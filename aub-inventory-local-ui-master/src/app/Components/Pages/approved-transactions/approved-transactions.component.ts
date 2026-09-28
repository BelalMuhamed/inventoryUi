import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/Services/TransactionServices/transaction.service';
import { TransactionGetVm } from 'src/app/ViewModels/transaction-get-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approved-transactions',
  templateUrl: './approved-transactions.component.html',
  styleUrls: ['./approved-transactions.component.css']
})
export class ApprovedTransactionsComponent implements OnInit{

  constructor(private transactionService:TransactionService){}
  ngOnInit(): void {
    this.getOnTransferTransactions();
  }
  transactions:TransactionGetVm[] = [];
  getOnTransferTransactions(){
    this.transactionService.getOnTransferTransactions().subscribe({
      next:(data:any)=>{this.transactions=data;console.log(data)},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Get OnTransfer Transactions Done")}
    })
  }
  UndoApprovedTransaction(transaction:TransactionGetVm){
    this.transactionService.UndoApprovedTransaction(transaction).subscribe({
      next:(data:any)=>{},
      error:(err)=>{
        Swal.fire({
          icon:"error",
          title:"Something Went Wrong",
          text:err.error || err,
        })
      },
      complete:()=>{
        this.getOnTransferTransactions();
        Swal.fire({
          icon:"success",
          title:"Transaction is Undone Successfully",
          timer:2000,
          showConfirmButton:false,
        })
      }
    })
  }

}
  