import { TransactionVm } from './../../../ViewModels/ItransactionVm';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { TransactionService } from 'src/app/Services/TransactionServices/transaction.service';
import { BranchReadVM } from 'src/app/ViewModels/branch-read-vm';
import { PageResult } from 'src/app/ViewModels/IAPiRsponse';
import { TransactionsFilters } from 'src/app/ViewModels/ItransactionVm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approved-transactions',
  templateUrl: './approved-transactions.component.html',
  styleUrls: ['./approved-transactions.component.css']
})
export class ApprovedTransactionsComponent implements OnInit {
constructor(private router: Router) { }
  private branchService = inject(BranchService);
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  private transactionSubscription = new Subscription();
  private branchSubscription = new Subscription();

  AllTransaction!: PageResult<TransactionVm>;
  branches: BranchReadVM[] = [];

  userRole: string | null = null;
  branchName: string | null = null;
  isloading: boolean = true;

  sourceInput: string | null = null;
  destinationInput: string | null = null;

  filters: TransactionsFilters = {
    source: null,
    destination: null,
    requestDateRange: null,
    recivedDateRange: null,
    acceptDeclinedDateRange: null,
    transactionStatus: null,
    page: 1,
    pageSize: 10,
  };

  SelectedTransactionStatus: number[] = [];
  totalCount = 0;

  AskingRequestRange!: FormGroup;
  RecivedRange!: FormGroup;
  AcceptOrDeclinedRequestRange!: FormGroup;

  ngOnInit(): void {
    this.userRole = localStorage.getItem("roles");
    this.branchName = localStorage.getItem("branchName");

    this.initDateForm();
    this.GetAllBranches();
    this.GetAllTransactions();
  }

  ngOnDestroy() {
    this.transactionSubscription.unsubscribe();
    this.branchSubscription.unsubscribe();
  }

  initDateForm() {
    this.AskingRequestRange = this.fb.group({
      start: [''],
      end: ['']
    });

    this.RecivedRange = this.fb.group({
      start: [''],
      end: ['']
    });

    this.AcceptOrDeclinedRequestRange = this.fb.group({
      start: [''],
      end: ['']
    });
  }

  GetAllBranches() {
    this.branchSubscription.add(
      this.branchService.getAllBranches().subscribe({
        next: res => this.branches = res,
        error: () => Swal.fire('Error', 'Failed loading branches', 'error')
      })
    );
  }

  onCheckBoxChange(event: any, value: number) {
    if (event.target.checked) {
      if (!this.SelectedTransactionStatus.includes(value)) {
        this.SelectedTransactionStatus.push(value);
      }
    } else {
      this.SelectedTransactionStatus =
        this.SelectedTransactionStatus.filter(x => x !== value);
    }
  }

  onPageChange(page: number) {
  this.filters.page = page;
  this.GetAllTransactions();
}

onPageSizeChange() {
  this.filters.page = 1;
  this.GetAllTransactions();
}

  GetAllTransactions() {

    if (this.userRole?.includes("Card Center Admin")) {
      this.filters.destination = this.destinationInput ?? null;
    } else {
      this.filters.destination = this.branchName;
    }

    this.isloading = true;

    this.transactionSubscription.add(
      this.transactionService.getAllTransactions(this.filters).subscribe({
        next: res => {
          this.AllTransaction = res;
          this.totalCount = res.totalCount;
          this.isloading = false;
        },
        error: err => {
          this.isloading = false;
          Swal.fire('Error', err.error?.message || 'Failed to load', 'error');
        }
      })
    );
  }

  search() {

    // source
    this.filters.source = this.sourceInput?.trim() || null;

    // destination
    if (this.userRole?.includes("Card Center Admin")) {
      this.filters.destination = this.destinationInput ?? null;
    } else {
      this.filters.destination = this.branchName;
    }

    // statuses
    this.filters.transactionStatus =
      this.SelectedTransactionStatus.length > 0 ? [...this.SelectedTransactionStatus] : null;

    // date ranges
    this.filters.requestDateRange =
      this.AskingRequestRange.value.start && this.AskingRequestRange.value.end
        ? [this.AskingRequestRange.value.start, this.AskingRequestRange.value.end]
        : null;

    this.filters.recivedDateRange =
      this.RecivedRange.value.start && this.RecivedRange.value.end
        ? [this.RecivedRange.value.start, this.RecivedRange.value.end]
        : null;

    this.filters.acceptDeclinedDateRange =
      this.AcceptOrDeclinedRequestRange.value.start &&
      this.AcceptOrDeclinedRequestRange.value.end
        ? [
            this.AcceptOrDeclinedRequestRange.value.start,
            this.AcceptOrDeclinedRequestRange.value.end
          ]
        : null;

    this.filters.page = 1;
    console.log(this.filters);

    this.GetAllTransactions();
  }

  clearFilters() {
    this.sourceInput = null;
    this.destinationInput = null;
    this.SelectedTransactionStatus = [];
    this.AskingRequestRange.reset();
    this.RecivedRange.reset();
    this.AcceptOrDeclinedRequestRange.reset();

    this.filters = {
      source: null,
      destination: null,
      requestDateRange: null,
      recivedDateRange: null,
      acceptDeclinedDateRange: null,
      transactionStatus: null,
      page: 1,
      pageSize: 10,
    };

    this.GetAllTransactions();
  }

  getTransactionStatusName(status: number) {
    const map: any = {
      0: 'Recived Without AnyProblem',
      1: 'Recived With Problem',
      2: 'Declined By Branch',
      3: 'Transfer',
      4: 'Declined By Card Center'
    };
    return map[status] || 'Unknown';
  }
  markAsReceived(id: number) {
  Swal.fire({
    title: "Are you sure?",
    text: "Mark this transaction as received?",
    icon: "question",
    showCancelButton: true
  }).then(result => {
    if (result.isConfirmed) {
      // TODO: Call API
      console.log("Received ID:", id);
    }
  });
}

undoTransaction(dto:TransactionVm) {
  Swal.fire({
    title: "Undo this transaction?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true
  }).then(result => {
    if (result.isConfirmed) {
      dto.acceptDeclinedDate= new Date().toISOString();
      dto.acceptRequestUser=localStorage.getItem('username');
      console.log(dto);

      this.transactionService.undoTransaction(dto).subscribe({
        next:()=>{
      Swal.fire('Success', 'Transaction undone successfully', 'success')
       .then(() =>this.GetAllTransactions());

        },
        error:(err)=>{
        Swal.fire('Error', err.error?.message || 'Failed to load', 'error')
       .then(() => this.GetAllTransactions());

        }
      })

    }
  });
}

}
