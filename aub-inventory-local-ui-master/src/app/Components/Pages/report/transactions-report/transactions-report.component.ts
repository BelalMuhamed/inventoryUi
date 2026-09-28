import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { ExportExcelService } from 'src/app/Services/ExportExcel/export-excel.service';
import { ReportService } from 'src/app/Services/Reports/report.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { CardReportSearchVm } from 'src/app/ViewModels/card-report-search-vm';
import { TransactionGetVm } from 'src/app/ViewModels/transaction-get-vm';
import { TransactionReportSearchVm } from 'src/app/ViewModels/transaction-report-search-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transactions-report',
  templateUrl: './transactions-report.component.html',
  styleUrls: ['./transactions-report.component.css']
})
export class TransactionsReportComponent implements OnInit {
  @ViewChild('transactionPaginator') transactionPaginator!: MatPaginator;
  isCCAdmin = true;

  constructor(private datepipe: DatePipe, private exportExcelService: ExportExcelService, private branchService: BranchService, private reportSercies: ReportService, private fb: FormBuilder) { }
  ngOnInit(): void {
    let roles: string[] = localStorage.getItem("roles")?.split(",") || []
    if (roles.includes("Branch Admin") ){ //!roles.includes("Card Center Admin") || !roles.includes("Report Viewer")
      this.isCCAdmin = false;
      this.selectedSourceBranch = localStorage.getItem("branchName") || ""
      this.selectedDestinationBranch = localStorage.getItem("branchName") || ""
    }
    this.getAllBranches();
    this.initDateForm();
    this.getTransactonsPagination(this.pageIndex, this.pageSize);
    this.getTransactionTotalSize();
  }

  range!: FormGroup;
  selectedSourceBranch: string = '';
  selectedDestinationBranch: string = '';
  branches: BranchVm[] = [];
  pageIndex: number = 0;
  pageSize: number = 20;
  totalTransactions: number = 0;
  pageEvent!: PageEvent;
  searchApplied = false;
  selectedTransactionStatuses: string[] = [];

  transactions: TransactionGetVm[] = [];
  initDateForm() {
    this.range = this.fb.group({
      start: [''],
      end: [''],
    })
  }
  getAllBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (data: any) => { this.branches = data; console.log(data) },
      error: (err) => { console.log(err) },
      complete: () => { console.log("Get Branches Done") }
    })
  }

  getTransactonsPagination(pageIndex: number, pageSize: number) {
    this.reportSercies.GetTransactionsPagination(this.selectedSourceBranch, pageIndex, pageSize).subscribe({
      next: (data: any) => { console.log(data), this.transactions = data },
      error: (err) => { console.log(err) },
      complete: () => { console.log("Get Cards Pagination Done") }
    })
  }

  onCheckBoxChange(value: string): void {
    if (this.selectedTransactionStatuses.includes(value)) {
      this.selectedTransactionStatuses = this.selectedTransactionStatuses.filter((item) => item !== value);
    } else {
      this.selectedTransactionStatuses.push(value);
    }
    console.log(this.selectedTransactionStatuses);
  }
  public PaginatorEvent(event?: PageEvent): any {
    console.log(event);
    if (!this.searchApplied) { // move in pages of all cards
      this.getTransactonsPagination(event?.pageIndex || 0, event?.pageSize || 20)
    } else {// move in pages of searched (filtered) cards
      let stringDate = JSON.stringify(this.range.value);
      let dateObj = JSON.parse(stringDate);
      let startDate = dateObj.start.substring(0, 10);
      let endDate = dateObj.end.substring(0, 10);
      let transactionSearch: TransactionReportSearchVm = {
        branchSourceName: this.selectedSourceBranch, branchDestinationName: this.selectedDestinationBranch, dates: [startDate, endDate],
        statuses: this.selectedTransactionStatuses, pageIndex: this.pageIndex, pageSize: this.pageSize
      }

      this.reportSercies.GetSearchedTransactionPagination(transactionSearch, event?.pageIndex || 0, event?.pageSize || 20).subscribe({
        next: (data: any) => { this.transactions = data; console.log(data) },
        error: (err) => { console.log(err) },
        complete: () => { console.log("Searched Done") }
      })
    }
  }
  searchTransactions() {
    if(this.selectedSourceBranch == "All")
      this.selectedSourceBranch = "";
    if(this.selectedDestinationBranch == "All")
      this.selectedDestinationBranch = ""
    if(this.isCCAdmin && this.selectedSourceBranch == this.selectedDestinationBranch && this.selectedSourceBranch!="" && this.selectedDestinationBranch !=""){
      Swal.fire({
        icon:"error",
        title:"Source and Destination",
        text:"Source and Destination Must be Different"
      })
    }else{
      let stringDate = JSON.stringify(this.range.value);
    let dateObj = JSON.parse(stringDate);
    let startDate = dateObj.start.substring(0, 10);
    let endDate = dateObj.end.substring(0, 10);
    this.transactionPaginator.firstPage();// move back to first page
    this.pageIndex = 0; // reset 
    this.pageSize = 20; // reset
    ;

    let transactionSearch: TransactionReportSearchVm = { branchSourceName: this.selectedSourceBranch, branchDestinationName: this.selectedDestinationBranch, dates: [startDate, endDate], statuses: this.selectedTransactionStatuses, pageIndex: this.pageIndex, pageSize: this.pageSize }
    console.log(transactionSearch);
    this.reportSercies.FilterTransactionSearch(transactionSearch).subscribe({
      next: (data: any) => { this.transactions = data.transactionsData; console.log(data); this.totalTransactions = data.totalItems; this.searchApplied = true },
      error: (err) => { console.log(err) },
      complete: () => { console.log("Filter Done") }
    })  
    }
    
  }
  validSearch(): boolean {
    let stringDate = JSON.stringify(this.range.value);
    let dateObj = JSON.parse(stringDate);
    let startDate = dateObj.start?.substring(0, 10);
    let endDate = dateObj.end?.substring(0, 10);
    if (startDate != '' && endDate == '' || startDate == '' && endDate != '')
      return false;
    if (startDate != '' && endDate != '')
      return true;
    if (this.selectedTransactionStatuses.find(v => v != ""))
      return true;
    if (this.selectedSourceBranch != "" || this.selectedDestinationBranch != "")
      return true;
    return false;
  }
  getTransactionTotalSize() {
    this.reportSercies.GetTransactionReportTotalSize(this.selectedSourceBranch).subscribe({
      next: (data: any) => { this.totalTransactions = data }
    })
  }
  exportTransactionsToExcel() {
    this.exportExcelService.exportTransactionsToExcel(this.transactions).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      let date = new Date();
      let dateNow = this.datepipe.transform(date, 'MMM d, y, h:mm:ss a') || '';
      console.log(date);
      link.download = 'Transactions_Report_' + dateNow + ".xlsx"; // Change the file name if needed
      link.click();
    }
    )
  }


}
