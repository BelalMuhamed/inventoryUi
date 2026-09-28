import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { ExportExcelService } from 'src/app/Services/ExportExcel/export-excel.service';
import { ProductService } from 'src/app/Services/Product/product.service';
import { ReportService } from 'src/app/Services/Reports/report.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { ProductQuantityGetVM } from 'src/app/ViewModels/product-quantity-vm';
import { StockReport } from 'src/app/ViewModels/stock-report';
import { StockReportSearchVm } from 'src/app/ViewModels/stock-report-search-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css']
})
export class StockReportComponent implements OnInit {
  @ViewChild('stockPaginator') stockPaginator!: MatPaginator;
  isCCAdmin = true;

  constructor(private productService:ProductService,private datepipe:DatePipe,private exportToExcel:ExportExcelService,private fb:FormBuilder,private branchService:BranchService,private reportService:ReportService){}
  ngOnInit(): void {
    let roles:string[] = localStorage.getItem("roles")?.split(",")||[]
    if(roles.includes("Branch Admin")){ //!roles.includes("Card Center Admin") || !roles.includes("Report Viewer")
      this.isCCAdmin = false;
      this.selectedBranch = localStorage.getItem("branchName")||"";
    }
    this.getAllBranches();
    this.initDateForm();
    this.getStockPagination(this.pageIndex,this.pageSize);
    this.GetCardsReportTotalSize();
    this.getProductsQuantity();
  }
  selectedBranch:string = '';
  range!:FormGroup;
  branches:BranchVm[] = [];
  selectedCardsAmountStatuses: string[] = [];
  pageIndex:number = 0;
  pageSize:number = 20;
  totalStocks:number = 0;
  pageEvent!: PageEvent;
  searchApplied = false;
  stocks:StockReport[] = [];
  utillizedColspan: number = 0;
  inStockColspan: number = 0;
  allProductsColspan: number = 0;
  productsQuantity:ProductQuantityGetVM[] = [];
  initDateForm(){
    this.range = this.fb.group({
      start:[''],
      end:[''],
    })
  }

  getAllBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (data: any) => { this.branches = data ; console.log(data)},
      error: (err) => { console.log(err) },
      complete: () => { console.log("Get Branches Done") }
    })
  }

  onCheckBoxChange(value: string): void {
    if (this.selectedCardsAmountStatuses.includes(value)) {
      this.selectedCardsAmountStatuses = this.selectedCardsAmountStatuses.filter((item) => item !== value);
    } else {
      this.selectedCardsAmountStatuses.push(value);
    }
    console.log(this.selectedCardsAmountStatuses);
  }

  validSearch():boolean{
    if(this.selectedCardsAmountStatuses.find(v=>v!=""))
      return true;
    if(this.selectedBranch!="")
      return true;
    return false;
  }

  searchStocks(){
    this.stockPaginator.firstPage();// move back to first page
    this.pageIndex = 0; // reset 
    this.pageSize = 20; // reset
    console.log(this.selectedBranch);
    if(this.selectedBranch == "All")
      this.selectedBranch = "";
    let stockReportSearchVm:StockReportSearchVm = {branchName : this.selectedBranch,pageIndex:this.pageIndex,pageSize:this.pageSize}
    this.reportService.FilterStockSearch(stockReportSearchVm).subscribe({
      next:(data:any)=>{this.stocks = data.stocksData;console.log(data);this.totalStocks = data.totalItems;this.searchApplied = true},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Filter Done")}
    })
  }
  getStockPagination(pageIndex:number,pageSize:number){
    console.log("selected branch:")
    console.log(this.selectedBranch)
    this.reportService.GetStockPagination(this.selectedBranch,pageIndex,pageSize).subscribe({
      next:(data:any)=>{console.log(data),this.stocks = data},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Get Stock Pagination Done");
    
      this.utillizedColspan = Object.keys(this.stocks[0].utillizedProducts).length;
      this.inStockColspan = Object.keys(this.stocks[0].inStockProducts).length;
      this.allProductsColspan = Object.keys(this.stocks[0].allProductsStock).length;
    }
    })
  }

  public PaginatorEvent(event?:PageEvent):any{
    console.log(event);
    if(!this.searchApplied){ // move in pages of all cards
      this.getStockPagination(event?.pageIndex||0,event?.pageSize||20)
    }else{// move in pages of searched (filtered) cards
      
      let stockSearch:StockReportSearchVm = {branchName:this.selectedBranch,pageIndex:this.pageIndex, pageSize:this.pageSize}
      this.reportService.GetSearchedStocksPagination(stockSearch,event?.pageIndex||0,event?.pageSize||20).subscribe({
        next:(data:any)=>{this.stocks = data;console.log(data)},
        error:(err)=>{console.log(err)},
        complete:()=>{console.log("Searched Done")}
      })
    }
  }
  GetCardsReportTotalSize(){
    this.reportService.GetStocksReportTotalSize(this.selectedBranch).subscribe({
      next:(data:any)=>{console.log(data),this.totalStocks = data},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Get Total Stocks Done")}
    })
  }
  exportStockToExcel(){
    this.exportToExcel.exportStockToExcel(this.stocks).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      let date = new Date();
      let dateNow = this.datepipe.transform(date, 'MMM d, y, h:mm:ss a') || '';
      console.log(date);
      link.download = 'Stock_Report_' + dateNow + ".xlsx"; // Change the file name if needed
      link.click();
      }
    )
  }
  getProductStyle(value: number,key:string): any {
    const product = this.productsQuantity.find(p=>p.productName == key);
    if(product){
      if (value<=product.lowProductQuantity) {
        return { 'background-color': '#dc3545','color':'white' };
      } else if (value>=product.highProductQuantity) {
        return { 'background-color': '#198754','color':'white' };
      } else {
        return { 'background-color': '#ffc107','color':'white' };
      }
    }
  }
  getProductsQuantity(){
    this.productService.getProductsQuantity().subscribe({
      next:(data:any)=>{this.productsQuantity=data,console.log(data)},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("get products quantity done");
      }
    })
  }
}
