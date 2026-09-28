import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit{
  constructor(){
    this.getUserRole();
  }
  ngOnInit(): void {
  }
  userRole:string = "";
  showPerformanceFlag:boolean = false;
  getUserRole() {
    this.userRole = JSON.stringify(localStorage.getItem("roles")).replaceAll('"',' ').trim();
    console.log("User Role",this.userRole);
    
    if(this.userRole == "Card Center Admin" || this.userRole == "Report Viewer")
      this.showPerformanceFlag = true;
    else
      this.showPerformanceFlag = false    
  }
  showPerformance(){
    
  }
}
