import { ProductStockDetailsPerBranchesDto } from './../../../ViewModels/stock-read-vm';
import { CardReportPerSpecificPeriodDto, CardReportPieChartRequest, PrintedCardsReportPerBranches, PrintedCardsReportPerProducts, ThePercentageOfCardsPrintedEachYearDTO } from './../../../ViewModels/card-vm';
import { ReportService } from 'src/app/Services/Reports/report.service';
import { Component, ElementRef, HostListener, inject, NgZone, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartDataset, ChartOptions, ChartType, Legend, Ticks } from 'chart.js';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Services/Product/product.service';
import {  ProductVM } from 'src/app/ViewModels/product-vm';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { BranchReadVM } from 'src/app/ViewModels/branch-read-vm';
import { CardsService } from 'src/app/Services/Cards/cards.service';
import { BranchCardsReport } from 'src/app/ViewModels/report-vm';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/Services/User/user.service';
import { StockService } from 'src/app/Services/Stock/stock.service';
import { productStockDto } from 'src/app/ViewModels/stock-read-vm';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';
import { ActiveElement } from 'chart.js/dist/plugins/plugin.tooltip';
import { NgChartsModule } from 'ng2-charts';
import Swal from 'sweetalert2';
// import * as am5 from "@amcharts/amcharts5";
// import * as am5map from "@amcharts/amcharts5/map";
// import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

@Component({
  selector: 'app-ccdash-board',
  templateUrl: './ccdash-board.component.html',
  styleUrls: ['./ccdash-board.component.css']

})
export class CCDashBoardComponent {

//#region

 printPage() {
  // 1) حوّل كل الـ canvas لصور
  document.querySelectorAll('canvas').forEach((canvas: any) => {
    const img = document.createElement('img');
    img.src = canvas.toDataURL();   // يحول الـ chart لصورة
    img.style.maxWidth = "100%";
    img.style.display = "block";
    img.classList.add("chart-print-img");

    // أخلي الصورة قبل الـ canvas
    canvas.parentNode?.insertBefore(img, canvas);
    canvas.style.display = 'none';
  });

  // 2) استنى شوية علشان الصور تلحق تظهر
  setTimeout(() => {
    window.print();

    // 3) بعد الطباعة رجّع الـ canvas
    document.querySelectorAll('canvas').forEach((canvas: any) => {
      canvas.style.display = 'block';
      if (canvas.previousSibling instanceof HTMLImageElement &&
          canvas.previousSibling.classList.contains("chart-print-img")) {
        canvas.previousSibling.remove();
      }
    });
  }, 300); // 300ms كفاية، تقدر تزود لو لسه في مشكلة
}




//#endregion

  //#region variables
  onHoldCards:number=0;
  pageLoaded = false;
  PrecentageOfPrintedCardsEveryear !:ThePercentageOfCardsPrintedEachYearDTO[];
  MaximumYearPrecentageObj !:ThePercentageOfCardsPrintedEachYearDTO|undefined;
  CurrentYearPrecentageObj !: ThePercentageOfCardsPrintedEachYearDTO|undefined;
  CurrentYearPrintedCards :number|undefined;
  currentYearPrecentage !:number|null;
  currentYear: number = new Date().getFullYear();
  TotalStockCards !:number|null;
  TotalBranches :number=0;
  usersCount :number=0;
  ProductStock !:productStockDto[];
  selectedStockProduct!:productStockDto;
  ProductStockDetails !: ProductStockDetailsPerBranchesDto[];
  selectedRange :string='years'
  selectedPeriod !:string;
  CardsReportChart!:CardReportPerSpecificPeriodDto[];
  PrintedCardsRequestPerBranches !:CardReportPieChartRequest;
  PrintedCardsResponsePerBranchesForTwoPiesChartData !:PrintedCardsReportPerBranches[];
  PrintedCardsResponsePerProductsForTwoPiesChartData !:PrintedCardsReportPerProducts[];

  today: Date = new Date();
  //#endregion


  //#region Variables
  Products !:ProductVM[];
  BranchCardReport !:BranchCardsReport[];
  isPiechar:boolean=true;
  //#endregion
  //#region  Services
 private _ProductService = inject(ProductService);
 private  _ReportServices = inject(ReportService);
private _cardService = inject(CardsService);
private _branchService = inject(BranchService);
private _userService = inject(UserService);
private _StockService= inject(StockService)

 //#endregion
 //#region UnSubScriper
    private _UnSubscribe_ProductService !: Subscription;
    private _UnSubScribe_ReportServices !: Subscription;
    private _Unsubscribe_cardService !: Subscription;
    private _Unsubscribe_cardService02 !: Subscription;
    private _Unsubscribe_cardService03 !: Subscription;
    private _Unsubscribe_BranchService !: Subscription;
    private _unsubscribeUserService !: Subscription;
    private _unsubScribeStockSrvice !: Subscription;
    private _unSubscribeStockService02 !:Subscription;
    private _unsubscribeCardService04 !:Subscription;
 //#endregion
//#region Stock bar and pie ChartData



// StockbarChartData: ChartData<'bar'> = {
//   labels: [] as string[],
//   datasets: [{ label: 'Quantity', data: [] as number[],backgroundColor:'#42a7f5' }]
// };
// StockbarChartOptions: ChartOptions<'bar'> = {
//   responsive: true,
//   plugins: {
//     legend: {
//       display: true,
//       position: 'top',
//       labels: {
//         generateLabels: (chart) => {
//           const labels = chart.data.labels as string[];
//           return labels.map((label, index) => ({
//             text: label,
//             fillStyle: '#42a7f5',
//             hidden: false,
//             datasetIndex: 0
//           }));
//         }
//       }
//     }
//      ,datalabels: { display: true ,color:'black'}
//   },
//   scales: {
//     x: { title: { display: true, text: 'Products' } },
//     y: { title: { display: true, text: 'Quantity' } }
//   }
// };
StockbarChartData: ChartData<'bar'> = {
  labels: [] as string[],
  datasets: [
    {
      label: 'Quantity',
      data: [] as number[],
      backgroundColor: '#42a7f5'
    },
    {
      label: 'Holded Amount',
      data: [] as number[],
      backgroundColor: '#f5d142'
    }
  ]
};
StockbarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    datalabels: {
      display: true,
      color: 'black'
    }
  },
  scales: {
    x: { title: { display: true, text: 'Products' } },
    y: { title: { display: true, text: 'Quantity / Holded Amount' } }
  }
};

 waveChartData: ChartData<'pie', (number | null)[]> = {
    labels: [],
    datasets: [
      {
        label: 'Quantity',
        data: [],

      }as ChartDataset<'pie', (number | null)[]>
    ]
  };

  waveChartOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: { display: true },
  }
};



//#endregion
//#region bar chart cards report
 CardsbarChartDataReport: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

 CardsbarChartReportOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    datalabels: {
      color: 'white',
      anchor: 'center',
      align: 'center',
      formatter: (value) => value,
      font: { weight: 'bold' }
    }
  },
  scales: {
    x: { stacked: false },
    y: { stacked: false }
  }
};

//#endregion
//#region success cards stock pie chart




public pieSuccesscardsChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '70%', // donut effect
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        generateLabels: (chart) => {
          const data = chart.data;
          if (!data || !data.labels || !data.datasets.length) {
            return [];
          }

          const dataset = data.datasets[0];
          const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);

          return (data.labels as string[]).map((label, i) => {
            const value = (dataset.data as number[])[i];
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';

            return {
              text: `${label}: ${value} (${percentage}%)`,
              fillStyle: Array.isArray(dataset.backgroundColor)
                ? dataset.backgroundColor[i] as string
                : dataset.backgroundColor as string,
              hidden: isNaN(value) || value <= 0,
              index: i
            };
          });
        }
      }
    },
    datalabels: {
      color: '#fff',
      font: { weight: 'bold' },
      formatter: (value: number) => {
        return value > 0 ? value : '';
      }
    }
  }
};

  public pieSuccesscardsChartLabels: string[] = [];
  public pieSuccesscardsChartDatasets: ChartDataset<'doughnut'>[] = [
    {
      data: [],
      backgroundColor: [],
      borderRadius: 10, // rounded slices
      spacing: 4        // gap between slices
    }
  ];
public pieSuccesscardsChartType: 'doughnut' = 'doughnut';
//#endregion
//#region damaged cards stock pie chart
public pieDamagedcardsChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '70%', // donut effect
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        generateLabels: (chart) => {
          const data = chart.data;
          if (!data || !data.labels || !data.datasets.length) {
            return [];
          }

          const dataset = data.datasets[0];
          const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);

          return (data.labels as string[]).map((label, i) => {
            const value = (dataset.data as number[])[i];
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';

            return {
              text: `${label}: ${value} (${percentage}%)`,
              fillStyle: Array.isArray(dataset.backgroundColor)
                ? dataset.backgroundColor[i] as string
                : dataset.backgroundColor as string,
              hidden: isNaN(value) || value <= 0,
              index: i
            };
          });
        }
      }
    },
    datalabels: {
      color: '#fff',
      font: { weight: 'bold' },
      formatter: (value: number) => {
        return value > 0 ? value : '';
      }
    }
  }
};

  public pieDamagedcardsChartLabels: string[] = [];
  public pieDamagedcardsChartDatasets: ChartDataset<'doughnut'>[] = [
    {
      data: [],
      backgroundColor: [],
      borderRadius: 10, // rounded slices
      spacing: 4        // gap between slices
    }
  ];
public pieDamagedcardsChartType: 'doughnut' = 'doughnut';
//#endregion

//#region success cards chart data per product
public pieSuccesscardsPerProductccesscardsChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '70%', // donut effect
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        generateLabels: (chart) => {
          const data = chart.data;
          if (!data || !data.labels || !data.datasets.length) {
            return [];
          }

          const dataset = data.datasets[0];
          const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);

          return (data.labels as string[]).map((label, i) => {
            const value = (dataset.data as number[])[i];
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';

            return {
              text: `${label}: ${value} (${percentage}%)`,
              fillStyle: Array.isArray(dataset.backgroundColor)
                ? dataset.backgroundColor[i] as string
                : dataset.backgroundColor as string,
              hidden: isNaN(value) || value <= 0,
              index: i
            };
          });
        }
      }
    },
    datalabels: {
      color: '#fff',
      font: { weight: 'bold' },
      formatter: (value: number) => {
        return value > 0 ? value : '';
      }
    }
  }
};

  public pieSuccesscardsPerProductChartLabels: string[] = [];
  public pieSuccesscardsPerProductChartDatasets: ChartDataset<'doughnut'>[] = [
    {
      data: [],
      backgroundColor: [],
      borderRadius: 10,
      spacing: 4
    }
  ];
public pieSuccesscardsPerProductChartType: 'doughnut' = 'doughnut';
//#endregion
//#region damage cards chart data per product
public pieDamagedcardsPerProductccesscardsChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '70%', // donut effect
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        generateLabels: (chart) => {
          const data = chart.data;
          if (!data || !data.labels || !data.datasets.length) {
            return [];
          }

          const dataset = data.datasets[0];
          const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);

          return (data.labels as string[]).map((label, i) => {
            const value = (dataset.data as number[])[i];
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';

            return {
              text: `${label}: ${value} (${percentage}%)`,
              fillStyle: Array.isArray(dataset.backgroundColor)
                ? dataset.backgroundColor[i] as string
                : dataset.backgroundColor as string,
              hidden: isNaN(value) || value <= 0,
              index: i
            };
          });
        }
      }
    },
    datalabels: {
      color: '#fff',
      font: { weight: 'bold' },
      formatter: (value: number) => {
        return value > 0 ? value : '';
      }
    }
  }
};

  public pieDamagedcardsPerProductChartLabels: string[] = [];
  public pieDamagedcardsPerProductChartDatasets: ChartDataset<'doughnut'>[] = [
    {
      data: [],
      backgroundColor: [],
      borderRadius: 10,
      spacing: 4
    }
  ];
public pieDamagedcardsPerProductChartType: 'doughnut' = 'doughnut';
//#endregion
//#endregion
//#region Hooks
 ngOnInit():void{


this._Unsubscribe_cardService02=this._cardService.GetThePercentageOfCardsPrintedEachYear().subscribe(
  {
    next:(res)=>{
      const currentYear = new Date().getFullYear();
        this.PrecentageOfPrintedCardsEveryear = res;
        this.CurrentYearPrecentageObj = this.PrecentageOfPrintedCardsEveryear
          .find(item => item.year === currentYear);
       if (!this.CurrentYearPrecentageObj ||
   (this.CurrentYearPrecentageObj.totalDamagedCards + this.CurrentYearPrecentageObj.totalSucceededCards) === 0) {

  this.CurrentYearPrintedCards = 0;
  this.currentYearPrecentage = 0;
}
else {
  const total = this.CurrentYearPrecentageObj.totalDamagedCards + this.CurrentYearPrecentageObj.totalSucceededCards;
  this.CurrentYearPrintedCards = total;
  this.currentYearPrecentage = (this.CurrentYearPrecentageObj.totalSucceededCards * 100) / total;
}

        this.MaximumYearPrecentageObj = this.PrecentageOfPrintedCardsEveryear.find(p => Math.max(p.totalSucceededCards)&& p.year != currentYear)


    },error:(err)=>{
      console.log(err);

    }
  }
)
this._unsubscribeCardService04= this._cardService.GetCardsCountByStatus(0).subscribe({
  next:(res)=>
  {
    this.TotalStockCards=res
    this._cardService.GetCardsCountByStatus(4).subscribe({
      next:(res)=>{
        this.onHoldCards=res;

      },
      error:(err)=>{
        Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: err.error?.message || 'Something went wrong!',
            });
      }
    })
  }
  ,
  error:(err)=>
  {
     Swal.fire({
           icon: 'error',
           title: 'Error!',
           text: err.error?.message || 'Something went wrong!',
         });

  }
})
this._Unsubscribe_BranchService=this._branchService.GetBranchesCount().subscribe(({
  next:(res)=>{
    this.TotalBranches=res
    console.log(res);

  },error:(err)=>{
console.log(err.message);

  }
}))
this._unsubscribeUserService=this._userService.GetUsersCount().subscribe({
    next:(res)=>{this.usersCount=res;
  },error:(err)=>{
    console.log(err.message);

  }
})
this._unsubScribeStockSrvice=this._StockService.GetStockForEachProduct().subscribe({
  next:(res)=>{
   // Sort and select top product
this.ProductStock = res.sort((a, b) => b.quantity - a.quantity);
this.selectedStockProduct = this.ProductStock[0];

// Update bar chart data with two datasets: Quantity (blue) and HoldedAmount (yellow)
this.StockbarChartData = {
  labels: this.ProductStock.map(x => x.productName),
  datasets: [
    {
      label: 'Quantity',
      data: this.ProductStock.map(x => x.quantity),
      backgroundColor: Array(this.ProductStock.length).fill('#42a7f5') // blue
    },
    {
      label: 'Holded Amount',
      data: this.ProductStock.map(x => x.holdAmount),
      backgroundColor: Array(this.ProductStock.length).fill('#f5d142') // yellow
    }
  ]
};
this._unSubscribeStockService02=this._StockService.GetProductStockDetailsPerBranches(this.selectedStockProduct.productName).subscribe({
  next:(res)=>{

    this.ProductStockDetails=res.sort((a, b) => b.quantity - a.quantity);
     this.waveChartData = {
        labels: res.map(x => x.branchName),
        datasets: [
          {
            label: 'Quantity',
          data: res.map(x => x.quantity > 0 ? x.quantity : null) as number[],          }
        ]
      };

  },error:(err)=>{
console.log(err.message);

  }
})
  },
  error:(err)=>{
    console.log(err);

  }
})
this.LoadChartData(this.selectedRange)
 }
 ngAfterViewInit() {
    setTimeout(() => {
      this.pageLoaded = true;
    }, 1000);
  }
  OnDestroy():void
 {
  this._UnSubscribe_ProductService?.unsubscribe();
  this._UnSubScribe_ReportServices?.unsubscribe();
  this._Unsubscribe_cardService?.unsubscribe();
  this._Unsubscribe_cardService02?.unsubscribe();
  this._Unsubscribe_cardService03?.unsubscribe();
  this._Unsubscribe_BranchService?.unsubscribe();
  this._unsubscribeUserService?.unsubscribe();
  this._unsubScribeStockSrvice?.unsubscribe();
  this._unSubscribeStockService02?.unsubscribe();
  this._unsubscribeCardService04?.unsubscribe();

 }
 //#endregion
//#region methods
toggleChart()
{
  this.isPiechar=!this.isPiechar
}

//#endregion



 //#region methods
 onBarClick(event: any) {
  if (event.active && event.active.length > 0) {
    const element = event.active[0];
    const datasetIndex = element.datasetIndex;
    const index = element.index;

    const label = this.StockbarChartData.labels![index] as string;

    const value = this.StockbarChartData.datasets[datasetIndex].data[index] as number;


    this.handleBarClick({ label, value });
  }
}

handleBarClick(bar: { label: string; value: number }) {
  this.selectedStockProduct.productName=bar.label;
  this.selectedStockProduct.quantity=bar.value;

  this._unSubscribeStockService02=this._StockService.GetProductStockDetailsPerBranches(bar.label).subscribe({
  next:(res)=>{

    this.ProductStockDetails=res.sort((a, b) => b.quantity - a.quantity);
     this.waveChartData = {
        labels: res.map(x => x.branchName),
        datasets: [
          {
            label: 'Quantity',
            data:res.map(x => x.quantity === 0 ? null : x.quantity),
          }
        ]
      };

  },error:(err)=>{
console.log(err.message);

  }
})
}

onSelectChange(event: Event) {

  const value = (event.target as HTMLSelectElement).value;
 this.selectedRange=value;


this.LoadChartData(this.selectedRange);

}
//#region Load Chart  Data Report
LoadChartData(selectedRange: string) {
  this._cardService.GetCardsReportToChart(selectedRange).subscribe({
    next: (res) => {
      this.CardsReportChart = res;


      if(this.selectedRange!='months' && this.CardsReportChart.length>0)
      {
      this.selectedPeriod=res[0].specificPeriod;

      }
      else if(this.selectedRange==='months' )
      {
        this.selectedPeriod='January'
      }
      console.log(this.selectedPeriod);
    if(this.CardsReportChart.length>0)
    {
      this.LoadCardsPrintedReportForBranches(this.selectedRange, this.selectedPeriod);
      this.LoadCardsPrintedReportForProducts(this.selectedRange,this.selectedPeriod)
    }

    else{
      this.selectedPeriod=''
      this.selectedRange=''
       this.pieSuccesscardsChartLabels=[];
       this.pieDamagedcardsChartLabels=[];
       this.pieSuccesscardsChartDatasets=[];
       this.pieDamagedcardsChartDatasets=[];
       this.pieDamagedcardsPerProductChartDatasets=[];
       this.pieDamagedcardsChartLabels=[];
         this.pieSuccesscardsPerProductChartDatasets=[];
       this.pieSuccesscardsChartLabels=[];
    }

      const combined = this.CardsReportChart.map(x => ({
        label: x.specificPeriod,
        damage: x.damageCards,
        success: x.successCards
      }));


      const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
      ];


      const isMonth = (val: string) => months.includes(val);
const isNumber = (val: string) => !isNaN(Number(val));

if (combined.every(c => isMonth(c.label))) {
  // sort by month index
  combined.sort((a, b) => months.indexOf(a.label) - months.indexOf(b.label));
}
else if (combined.every(c => isNumber(c.label))) {
  combined.sort((a, b) => Number(a.label) - Number(b.label));
}


     this.CardsbarChartDataReport = {
  labels: combined.map(c => c.label),
  datasets: [
    {
      label: 'Damage Cards',
      data: combined.map(c => c.damage),
      backgroundColor: 'rgb(126, 87, 194)',
      barPercentage: 0.7,
      categoryPercentage: 0.7
    },
    {
      label: 'Success Cards',
      data: combined.map(c => c.success),
      backgroundColor: 'rgb(66, 167, 245)',
      barPercentage: 0.7,
      categoryPercentage: 0.7
    }
  ]
};

    },
    error: (err) => {
      console.log(err.message);
    }
  });
}
LoadCardsPrintedReportForBranches(specidficPeriodType:string, selectedPeriod:string)
{

  this.PrintedCardsRequestPerBranches={
    specidficPeriodType:specidficPeriodType,
    selectedPeriod:selectedPeriod
  }
  this._unsubscribeCardService04 = this._cardService.getPrintedCardsReport(this.PrintedCardsRequestPerBranches).subscribe({
    next:(res)=>{
      this.PrintedCardsResponsePerBranchesForTwoPiesChartData=res;
     this.pieSuccesscardsChartLabels = res.map(x => x.branchName);
   const successColors = this.generateColors(res.length);

        this.pieSuccesscardsChartDatasets = [
          {
            data: res.map(x => x.successCards),
            borderRadius: 10,
            backgroundColor: successColors,
            spacing: 4
          }
        ];

         this.pieDamagedcardsChartLabels = res.map(x => x.branchName);


        this.pieDamagedcardsChartDatasets = [
          {
            data: res.map(x => x.damageCards),
            borderRadius: 10,
            backgroundColor: successColors,
            spacing: 4
          }
        ];
    },
    error:(err)=>{
      console.log(err.message);

    }
  })
}
LoadCardsPrintedReportForProducts(specidficPeriodType:string, selectedPeriod:string)
{

  this.PrintedCardsRequestPerBranches={
    specidficPeriodType:specidficPeriodType,
    selectedPeriod:selectedPeriod
  }
  this._unsubscribeCardService04 = this._cardService.getPrintedCardsReportForProducts(this.PrintedCardsRequestPerBranches).subscribe({
    next:(res)=>{
      this.PrintedCardsResponsePerProductsForTwoPiesChartData=res;
     this.pieSuccesscardsPerProductChartLabels = res.map(x => x.productName);
   const successColors = this.generateColors(res.length);

        this.pieSuccesscardsPerProductChartDatasets = [
          {
            data: res.map(x => x.successCards),
            borderRadius: 10,
            backgroundColor: successColors,
            spacing: 4
          }
        ];

         this.pieDamagedcardsPerProductChartLabels = res.map(x => x.productName);


        this.pieDamagedcardsPerProductChartDatasets = [
          {
            data: res.map(x => x.damageCards),
            borderRadius: 10,
            backgroundColor: successColors,
            spacing: 4
          }
        ];
    },
    error:(err)=>{
      console.log(err.message);

    }
  })
}


 //#endregion
private generateColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    colors.push(color);
  }
  return colors;
}

onBarChartClick(event: { event?: ChartEvent, active?: {}[] }) {
  if (event.active && event.active.length > 0) {
    const activePoint = event.active[0] as ActiveElement;
    const datasetIndex = activePoint.datasetIndex;
    const dataIndex = activePoint.index;

    const labels = this.CardsbarChartDataReport.labels as string[] | undefined;
    const datasets = this.CardsbarChartDataReport.datasets as any[];

    if (labels && datasets) {
      const clickedLabel = labels[dataIndex];

        this.selectedPeriod=clickedLabel;
        this.LoadCardsPrintedReportForBranches(this.selectedRange,this.selectedPeriod)
        this.LoadCardsPrintedReportForProducts(this.selectedRange,this.selectedPeriod)
    }

  }
}

}


