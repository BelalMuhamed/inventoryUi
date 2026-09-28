import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { ExportExcelService } from 'src/app/Services/ExportExcel/export-excel.service';
import { ReportService } from 'src/app/Services/Reports/report.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { Branches, PerformanceMetricVm } from 'src/app/ViewModels/performance-metric-vm';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})

export class PerformanceComponent implements OnInit{
  constructor (private branchService:BranchService,private performanceService:ReportService,private excelService:ExportExcelService,private datepipe:DatePipe){}
  performanceMetrics!:PerformanceMetricVm;
  products:string[] = [];
  branchesData: Branches = {};
  selectedBranch:string = "";
  brancheNames:BranchVm[] = [];
  years: number[] = [];
  selectedYear = null;
  role :string|null='';
  ngOnInit(): void {
    const branch= localStorage.getItem("branchName");
    const currentYear = new Date().getFullYear();
     this.role= localStorage.getItem("roles");
    if(this.role != null && this.role=='Branch Admin')
    {
      this.selectedBranch=branch??"";
      this.selectedYear=currentYear as any;
      this.searchPerformance()
       this.getAllBranches();
    this.populateYears();
    }
    else{
 this.getPerformance();
    this.getAllBranches();
    this.populateYears();
    }

  }
  monthNames = ['Januanry', 'February', 'March', 'Aprril', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'];
  populateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 25; i++) {
      this.years.push(currentYear - i);
    }
  }
  getPerformance(){
    console.log("Get Peroformance");

    this.performanceService.getPerformanceMetrics().subscribe({
      next:(data:any)=>{this.performanceMetrics = data;console.log("metrics",data);
        this.parseRemainingProducts(data);
      },
      error:(err)=>{console.log(err);}
    })
  }

  calculateTotal(numbers?:number[]){
    if(numbers != undefined){
      let sum = 0;
      numbers.forEach(element => {
        sum+=element;
      });
      return sum;
    }
    return 0;
  }
  getAllBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (data: any) => { this.brancheNames = data ; console.log(data)},
      error: (err) => { console.log(err) },
      complete: () => { console.log("Get Branches Done") }
    })
  }
  exportPerformanceToExcel(){
    this.excelService.exportPerformanceToExcel(this.performanceMetrics).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      let date = new Date();
      let dateNow = this.datepipe.transform(date, 'MMM d, y, h:mm:ss a') || '';
      console.log(date);
      link.download = 'Performance_Metric_Report_' + dateNow + ".xlsx"; // Change the file name if needed
      link.click();
      }
    )
  }

  searchPerformance() {
    console.log(this.selectedBranch);

    this.branchesData = {};
    const year = this.selectedYear||new Date().getFullYear();

    this.performanceService.filterPerformanceByBranch(this.selectedBranch,year).subscribe({
      next:(data:any)=>{this.performanceMetrics = data;console.log("metrics",data);
        this.parseRemainingProducts(data);
      },
      error:(err)=>{console.log(err);}
    })
  }
  parseRemainingProducts(data:any){
    Object.keys(data.performnceMetrics).forEach(branchName => {
      // assign upcoming data to branches data
      this.branchesData[branchName] = data.performnceMetrics[branchName];
      this.branchesData[branchName].remainingStockProducts = data.performnceMetrics[branchName].remainingStockProducts;

      // sort product names of the remaining products response
      let sortedKeys = Object.keys(this.branchesData[branchName].remainingStockProducts).sort();
      let sortedDictionary: { [key: string]: number } = {};
      sortedKeys.forEach(key => {
        // assign each product name and it's remaining value into sorted dictionary for each brnach
        sortedDictionary[key] = this.branchesData[branchName].remainingStockProducts[key];
        // sortedDictionray key is product name and the value is remaining quantity of this product in each branch SORTED
      });
      this.branchesData[branchName].remainingStockProducts = sortedDictionary;

      // sort product names (HEADERS OF THE TABLE IN HTML)
      this.products = Array.from(Object.keys(data.performnceMetrics[branchName].remainingStockProducts));
      this.products.sort();


    });
    console.log("branchesData",this.branchesData);
  }
  @ViewChild(MatDatepicker, { static: false }) picker!: MatDatepicker<Date>;
  selectedDate!:Date;
  dateForm:FormControl = new FormControl('');
  chosenYearHandler(ev:any){
    const date = new Date(ev);
    const year = date.getFullYear();
    console.log(year);
    this.dateForm.setValue(date);
    this.selectedDate = date;
    console.log(this.selectedDate);

    this.picker.close()
  }
  validSearch(){
    if(this.selectedYear!= null)
      return true;
    if(this.selectedBranch!='')
      return true;
    return false;
  }
}
