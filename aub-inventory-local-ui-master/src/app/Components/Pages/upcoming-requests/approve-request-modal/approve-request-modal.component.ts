import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import { TransactionService } from 'src/app/Services/TransactionServices/transaction.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { RequestCardVm } from 'src/app/ViewModels/request-card-vm';
import { TransactionAddVm } from 'src/app/ViewModels/transaction-add-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approve-request-modal',
  templateUrl: './approve-request-modal.component.html',
  styleUrls: ['./approve-request-modal.component.css']
})
export class ApproveRequestModalComponent implements OnInit {
  @Output() processCompleted: EventEmitter<any> = new EventEmitter();
  constructor(private requestCardService: RequestCardsService, private transactionService: TransactionService, private fb: FormBuilder, private branchService: BranchService, public dialogRef: MatDialogRef<ApproveRequestModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    console.log(this.data);
    
    this.getAllBranches();
    this.initApproveRequestCardsForm();
  }
  branches: BranchVm[] = [];
  RequestCardsForm!: FormGroup
  initApproveRequestCardsForm() {
    this.RequestCardsForm = this.fb.group({
      sourceBranch: ['', Validators.required],
      transferAmount: [, Validators.required],
    })
  }

  getAllBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (data: any) => { this.branches = data; console.log(data) },
      error: (err) => { console.log(err) },
      complete: () => { console.log("Get Branches Done") }
    })
  }

  approveRequest() {
    let sourceBranch = this.RequestCardsForm.get("sourceBranch")?.value;
    if (sourceBranch == this.data.request.branchNameRequesting) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can't transfer to the same branch!",
      });
      return;
    }
    let transferAmount = this.RequestCardsForm.get("transferAmount")?.value;
    let transaction: TransactionAddVm = {
      destination: this.data.request.branchNameRequesting, cardAmount: transferAmount, cardRequestId:this.data.request.id,
      source: sourceBranch, userName: this.data.request.userNameRequesting, productName: this.data.request.cardsType
    }
    this.transactionService.CheckCardsAmountInSourceBranch(sourceBranch, this.data.request.cardsType, transferAmount).subscribe({
      next: (data: any) => { },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: err.error.message || err.error || err,
          text: err.error.description,
        });
      },
      complete: () => {
        // update request to confirmed
        this.data.request.cardAmount = transferAmount;
        this.requestCardService.updaterequestCardsToConfirmed(this.data.request).subscribe({
          next: (data: any) => { },
          error: (err) => { console.log(err)
            Swal.fire({
              icon:"error",
              title:"Something Went Wrong",
              text:err.error||err
            })
           },
          complete: () => {
            console.log("Update request card to confirmed ");
            // add new transaction to DB
            this.transactionService.addTransaction(transaction).subscribe({
              next: (data: any) => { console.log(data) },
              error: (err) => { console.log(err) 
                Swal.fire({
                  icon:"error",
                  title:"Something Went Wrong",
                  text: err.error || err
                })
              },
              complete: () => {
                
                console.log("Approved Done");
                console.log(this.data.request);
                this.dialogRef.close();
                this.processCompleted.emit({success:true,request:this.data.request})
                Swal.fire({
                  icon: "success",
                  title: "Request Approved Successfully",
                  showConfirmButton: false,
                  timer: 2000
                })
              }
            });
          }
        })


      }
    })

  }

  get sourceBranch() { return this.RequestCardsForm.get("sourceBranch") }
  get transferAmount() { return this.RequestCardsForm.get("transferAmount") }

}
