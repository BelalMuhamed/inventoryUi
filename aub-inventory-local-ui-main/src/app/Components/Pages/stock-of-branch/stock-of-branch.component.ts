import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartConfiguration, ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { StockService } from 'src/app/Services/Stock/stock.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-of-branch',
  templateUrl: './stock-of-branch.component.html',
  styleUrls: ['./stock-of-branch.component.css']
})
export class StockOfBranchComponent implements OnInit{

  //#region  char
    public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#5A5A5A' }
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { display: false }
      }
    }
  };

  public barChartLabels !: string[] ;

  public barChartData !: ChartDataset<'bar'>[];

  public barChartType: ChartType = 'bar';
  //#endregion
  public pieChartLabels !: string[] ;
  public pieChartData !: number[] ;
  public pieChartType: ChartType = 'pie';

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };
currentBranch:string= '';
dataSource:any;
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!:MatSort;
displayedColumns: string[] = ['Product', 'Avaliable amount'];
branchStock:any;
isEmpty:boolean = true;
constructor(private stockService:StockService){
  this.currentBranch = localStorage.getItem('branchName')!;
}

ngOnInit(): void {
    this.stockService.GetBranchStock(this.currentBranch).subscribe({
      next:(data) => {
        this.branchStock = data.productsWithAmount;
        this.isEmpty = false;
      this.barChartLabels=this.pieChartLabels=data.productsWithAmount.map(p => p.productName);
        this.pieChartData=data.productsWithAmount.map(p => p.cardAmount);
        this.barChartData = [
    {
      data: data.productsWithAmount.map(p => p.cardAmount),
      backgroundColor: '#2F80ED',
      borderRadius: 8,
      barThickness: 30
    }
  ];
      },
      complete:() => {
        this.dataSource = new MatTableDataSource<any>(this.branchStock);
        this.paginator.pageSize = 10;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(error) => {
        if(error.status == 404){
         this.isEmpty = true;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${error.message}`,
          });
        }
      }
    })
  }


}
