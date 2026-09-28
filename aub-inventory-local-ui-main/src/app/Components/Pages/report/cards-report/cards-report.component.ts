import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ChartConfiguration, ChartDataset, ChartType } from 'chart.js';
import { forkJoin } from 'rxjs';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { CardsService } from 'src/app/Services/Cards/cards.service';
import { ExportExcelService } from 'src/app/Services/ExportExcel/export-excel.service';
import { ReportService } from 'src/app/Services/Reports/report.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { CardReportSearchVm } from 'src/app/ViewModels/card-report-search-vm';
import { CardReportVm } from 'src/app/ViewModels/card-report-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cards-report',
  templateUrl: './cards-report.component.html',
  styleUrls: ['./cards-report.component.css']
})
export class CardsReportComponent implements OnInit{
uploadedcountcards !:number;
 Roles:string[] = localStorage.getItem("roles")?.split(",")||[];
 ContainsBranchAdmin:boolean=this.Roles.includes('Branch Admin');


  public pieChartLabels !: string[];
    public pieChartData !: number[];
    public pieChartType: ChartType = 'pie';

    public chartOptions: ChartConfiguration['options'] = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        datalabels: {
      color: 'white',
      font: {
        weight: 'bold',
        size: 14
      },
      formatter: (value, context) => value
    }
      }
    };
  //#endregion
  @ViewChild('paginator') paginator!: MatPaginator;

  isCCAdmin = true;
  constructor(private datepipe:DatePipe,private exportToExcelService:ExportExcelService,private cardsService:CardsService,private branchService:BranchService,private fb:FormBuilder,private reposrtService:ReportService){}
  ngOnInit(): void {



    //#endregion

    let roles:string[] = localStorage.getItem("roles")?.split(",")||[]
    if(roles.includes("Branch Admin"))
      this.isCCAdmin = false;
    if(!this.isCCAdmin){
      this.selectedBranch = localStorage.getItem("branchName")||""
     
    }
    //this.getAllCards();
    this.getAllBranches();
    this.initDateForm();
    this.getCardsPagination(this.pageIndex,this.pageSize);
    this.GetCardsReportTotalSize();
  }
  cards:CardReportVm[] = [];
  branches:BranchVm[] = [];
  range!:FormGroup;
  pageIndex:number = 0;
  pageSize:number = 20;
  totalCards:number = 0;
  pageEvent!: PageEvent;
  statuses:string[] = ["Uploaded","Success","Failed"];
  selectedBranch:string = '';
  pan:string = '';
  selectedCardStatuses: string[] = [];
  searchApplied = false;

  initDateForm(){
    this.range = this.fb.group({
      start:[''],
      end:[''],
    })
  }

  toggleDropdown(event: any) {
    const dropdownMenu = event.target.nextElementSibling;
    dropdownMenu?.classList.toggle('show');
  }
  getAllBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (data: any) => { this.branches = data ; console.log(data)},
      error: (err) => { console.log(err) },
      complete: () => { console.log("Get Branches Done") }
    })
  }

  public PaginatorEvent(event?:PageEvent):any{
    console.log(event);
    if(!this.searchApplied){ // move in pages of all cards
      this.getCardsPagination(event?.pageIndex||0,event?.pageSize||20)
    }else{// move in pages of searched (filtered) cards
      let stringDate = JSON.stringify(this.range.value);
      let dateObj = JSON.parse(stringDate);
      let startDate = dateObj.start.substring(0,10);
      let endDate = dateObj.end.substring(0,10);
      let cardSearch:CardReportSearchVm = {branchName:this.selectedBranch,Pan:this.pan?.toString(),dates:[startDate,endDate],statuses:this.selectedCardStatuses, pageIndex:this.pageIndex, pageSize:this.pageSize}

      this.reposrtService.GetSearchedCardsPagination(cardSearch,event?.pageIndex||0,event?.pageSize||20).subscribe({
        next:(data:any)=>{this.cards = data;console.log(data)},
        error:(err)=>{console.log(err)},
        complete:()=>{console.log("Searched Done")}
      })
    }
  }

  onCheckBoxChange(value: string): void {
    if (this.selectedCardStatuses.includes(value)) {
      this.selectedCardStatuses = this.selectedCardStatuses.filter((item) => item !== value);
    } else {
      this.selectedCardStatuses.push(value);
    }
    console.log(this.selectedCardStatuses);
  }
  searchCards(){
    let stringDate = JSON.stringify(this.range.value);
    let dateObj = JSON.parse(stringDate);
    let startDate = dateObj.start.substring(0,10);
    let endDate = dateObj.end.substring(0,10);
    if(this.selectedBranch == "All")
      this.selectedBranch = "";
    this.paginator.firstPage();// move back to first page
    this.pageIndex = 0; // reset
    this.pageSize = 20; // reset
    let cardSearch:CardReportSearchVm = {branchName:this.selectedBranch,Pan:this.pan?.toString(),dates:[startDate,endDate],statuses:this.selectedCardStatuses, pageIndex:this.pageIndex, pageSize:this.pageSize}
    console.log(cardSearch);
    this.reposrtService.FilterCardSearch(cardSearch).subscribe({
      next:(data:any)=>{this.cards = data.cardsData;console.log(data);this.totalCards = data.totalItems;this.searchApplied = true},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Filter Done")}
    })
  }
  validSearch():boolean{
    let stringDate = JSON.stringify(this.range.value);
    let dateObj = JSON.parse(stringDate);
    let startDate = dateObj.start?.substring(0,10);
    let endDate = dateObj.end?.substring(0,10);
    if(startDate != '' && endDate == '' || startDate == '' && endDate != '')
      return false;
    if(startDate != '' && endDate !='')
      return true;
    if(this.selectedCardStatuses.find(v=>v!=""))
      return true;
    if(this.selectedBranch!="")
      return true;
    if(this.pan?.toString().length == 6)
      return true;
    return false;
  }
  getCardsPagination(pageIndex:number,pageSize:number){
    this.reposrtService.GetCardsPagination(this.selectedBranch,pageIndex,pageSize).subscribe({
      next:(data:any)=>{console.log(data),this.cards = data},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Get Cards Pagination Done")}
    })
  }
  GetCardsReportTotalSize(){
    this.reposrtService.GetCardsReportTotalSize(this.selectedBranch).subscribe({
      next:(data:any)=>{console.log(data),this.totalCards = data},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Get Total Cards Done")}
    })
  }
  exportCardsToExcel(){
    this.exportToExcelService.exportCardsToExcel(this.cards).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      let date = new Date();
      let dateNow = this.datepipe.transform(date, 'MMM d, y, h:mm:ss a') || '';
      console.log(date);
      link.download = 'Cards_Report_' + dateNow + ".xlsx"; // Change the file name if needed
      link.click();
    }
    )
  }
}
