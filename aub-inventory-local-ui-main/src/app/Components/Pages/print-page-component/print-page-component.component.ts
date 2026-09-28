import { PrintconfigsService } from './../../../Services/PrintConfigration/printconfigs.service';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { CardsService } from 'src/app/Services/Cards/cards.service';
import { PrintCardService } from 'src/app/Services/PrintCard/print-card.service';
import { ProductService } from 'src/app/Services/Product/product.service';
import { CardsForUserQuerySearch, PrintedCardsForUser, PrintedCardsPageResult } from 'src/app/ViewModels/card-vm';
import { PrintRequest } from 'src/app/ViewModels/imachine-configs';
import { PrintConfigRespDto } from 'src/app/ViewModels/IPrintConfigDtos';
import { PFULLSTATUS } from 'src/app/ViewModels/IPrinter';
import { Product } from 'src/app/ViewModels/product-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-print-page-component',
  templateUrl: './print-page-component.component.html',
  styleUrls: ['./print-page-component.component.css']
})
export class PrintPageComponentComponent {
PrinterInfo!:PFULLSTATUS;
private fb=inject(FormBuilder)
private PrintCardService = inject(PrintCardService);
  private PrintCardSubscription = new Subscription();
  private BranchService = inject(BranchService);
  private BranchSubscription = new Subscription();
  private ProductService = inject(ProductService);
  private ProductSubscription = new Subscription();
    private PrintConfigService = inject(PrintconfigsService);
  private PrintConfigSubscription = new Subscription();
   private CardServiceUnSubscriber= new Subscription();
  private _CardServiceSubScriber =inject(CardsService);
 printConfig: PrintConfigRespDto | null = null;
   range!:FormGroup;
userName !:string|null;
branchId:number|null=null;
  printerInfoForm!: FormGroup;
  PrintCardHolderNameForm!:FormGroup;
  products:Product[]=[];
  isLoading:boolean=true;
    CardQuerySearch!:CardsForUserQuerySearch ;
        PageCardsForUser !:PrintedCardsPageResult ;
          displayedColumns: string[] = ['maskedPan', 'cardHolderName', 'printedDate', 'cardStatus', 'productName'];
  dataSource = new MatTableDataSource<PrintedCardsForUser>([]);
  totalCount = 0;
      cardHolderName:string='';
    pan:string = '';
        selectedStatus !:number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void
  {
    this.IntialPrinterFormGroup();
    this.IntialPrintForm();
    this.GetConnectedMacineInfo();
    this.GetAllProducts();
    this.initDateForm();
    this.GetBranchByName();
     this.userName = localStorage.getItem('username');
    this.CardQuerySearch = {
    userName: this.userName,
    pageNumber: 1,
    pageSize: 10,
    cardHolderName: null,
    maskedPan: null,
    cardStatus: null,
    dates: null
      };
      this.GetPrintedCardsForCurrentUser(this.CardQuerySearch);
  }
  ngOnDestroy(): void
  {
    this.PrintCardSubscription?.unsubscribe();
    this.ProductSubscription?.unsubscribe();
    this.PrintConfigSubscription?.unsubscribe();
    this.CardServiceUnSubscriber?.unsubscribe();
    this.BranchSubscription?.unsubscribe();
  }
  GetConnectedMacineInfo()
  {
    this.isLoading=true
    this.PrintCardSubscription.add(this.PrintCardService.GetPrinterInfo().subscribe({
      next:(res)=>{
        this.PrinterInfo=res;
        this.PatchPrinterValue();
      }
      ,error:(err)=>{
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.error?.message || 'Something went wrong!',
      });
      },
      complete:()=>{
        this.isLoading=false;
      }
    }))
  }
  IntialPrinterFormGroup()
  {
   this.printerInfoForm = new FormGroup({
  pName: new FormControl('', Validators.required),
  pStatus: new FormControl('', Validators.required),
  pSerial: new FormControl('', Validators.required),
  rType: new FormControl('', Validators.required),

  rCapac: new FormControl('',  Validators.required)
});

  }
  PatchPrinterValue()
  {
   this.printerInfoForm.patchValue(this.PrinterInfo);
  }
  Reset()
  {
  this.isLoading=true;

    this.PrintCardService.ResetPrinter().subscribe({
      next:()=>{
      this.GetConnectedMacineInfo();

      },error:(err)=>{
        Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.error?.message || 'Something went wrong!',
      });
      },
      complete:()=>{
        this.isLoading=false;
      }
    })
  }
Print()
  {
  this.isLoading=true;
   if (!this.printConfig) {
    Swal.fire({
      icon: 'error',
      title: 'Missing Config',
      text: 'This product does not have a valid print configuration.'
    });
    return;
  }
   let request: PrintRequest =
   {
   cardHolderName: this.PrintCardHolderNameForm.get('CardHolderName')?.value,
    productName: this.printConfig.productName,
    printedFace: this.printConfig.printedFace,
    fontFamily: this.printConfig.fontFamily,
    fontSize: this.printConfig.fontSize,
    fontStyle: this.printConfig.fontStyle,
    printColor: this.printConfig.printColor,
    backGroundColor: this.printConfig.backGroundColor,
    riponType: this.printConfig.riponType,
    x: this.printConfig.x,
    y: this.printConfig.y,
    printWay: this.printConfig.printWay,
    productId:this.PrintCardHolderNameForm.get('Product')?.value.id,
    branchName:localStorage.getItem('branchName'),
    branchId:this.branchId,
    userName:localStorage.getItem('username')

   }
   console.log(request);

    this.PrintCardService.printCard(request).subscribe({
      next:(res)=>{
      console.log(res);


      },error:(err)=>{
        Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.error?.message || 'Something went wrong!',
      });
      },
      complete:()=>{
        this.isLoading=false;
      }
    })
  }
  GetAllProducts()
  {
    this.ProductSubscription.add(this.ProductService.getProducts().subscribe({
      next:(res)=>
        {
          this.products=res
          console.log(res);

        },
      error:()=>{ Swal.fire({
        icon: 'error',
        title: 'Error!',
        text:  'Something went wrong in loading products!',
      });}
    }))
  }
IntialPrintForm()
{
   this.PrintCardHolderNameForm=new FormGroup({
          CardHolderName :new FormControl<string>('',{ validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
          Validators.pattern('^[A-Z0-9 ]*$') // <-- allows spaces

    ]}),

         Product: new FormControl<Product | null>(null, {
        validators: [Validators.required]
         })
        })
}
GetBranchByName()
{
  const branchName = localStorage.getItem('branchName');
  this.BranchSubscription.add(this.BranchService.getByBranchName(branchName).subscribe({
    next:(res)=>{
      this.branchId=res.id;
    },
    error:(err)=>{
 Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.error?.message || 'Something went wrong!',
      });
    }
  }))
}
onProductChange(event: any) {
  const product = this.PrintCardHolderNameForm.get('Product')?.value;
  if (!product) return;

  const productName = product.productName;

  // مهم جداً: امسح القيمة القديمة
  this.printConfig = null;

  this.PrintConfigService.getPrintConfigByProductName(productName)
    .subscribe({
      next: (config) => {
        if (!config || !config.image) {
          this.printConfig = null;  // منتج بدون config
          return;
        }

        this.printConfig = config;  // منتج له config فعلاً
      },
      error: (err) => {
        console.error("Error loading config:", err);
        this.printConfig = null;
      }
    });
}
 onPageChange(event: any) {
  this.CardQuerySearch.pageNumber = event.pageIndex + 1;
  this.CardQuerySearch.pageSize = event.pageSize;
  this.GetPrintedCardsForCurrentUser(this.CardQuerySearch);
}


get scaledX() {
  if (!this.printConfig) return 0;
  const scale = 315 / 1016;
  return this.printConfig.x * scale;
}

get scaledY() {
  if (!this.printConfig) return 0;
  const scale = 315 / 1016;
  return this.printConfig.y * scale;
}

get finalX() {
  if (!this.printConfig) return 0;
  const s = 315 / 1016;
  return this.printConfig.printWay == 1 ? (this.printConfig.y * s) + this.magOffset : this.printConfig.x * s;
}

get finalY() {
  if (!this.printConfig) return 0;
  const s = 315 / 1016;
  return this.printConfig.printWay == 1 ? this.printConfig.x * s : this.printConfig.y * s;
}

get magOffset() {
  return !this.printConfig ? 0 : this.printConfig.printWay == 1 ? 60 * (315 / 1016) : 0;
}
  initDateForm(){
    this.range = this.fb.group({
      start:[''],
      end:[''],
    })
  }
  GetPrintedCardsForCurrentUser(CardQuerySearch:CardsForUserQuerySearch)
{
  this.CardServiceUnSubscriber.add(this._CardServiceSubScriber.getPrintedCardForUser(CardQuerySearch).subscribe({
    next:(res)=>{
      this.dataSource.data = res.data;
      this.totalCount = res.totalCount;
      this.PageCardsForUser=res

    },error:(err)=>{
      console.log(err);

    }
  }))
}
 searchCards(){
    let stringDate = JSON.stringify(this.range.value);
    let dateObj = JSON.parse(stringDate);
    let startDate = dateObj.start.substring(0,10);
    let endDate = dateObj.end.substring(0,10);
    this.paginator.firstPage();
    this.CardQuerySearch = {
    userName: this.userName,
    pageNumber: 1,
    pageSize: 10,
    cardHolderName: this.cardHolderName,
    maskedPan: this.pan,
    cardStatus: this.selectedStatus,
    dates:[startDate,endDate]
      };
     this.GetPrintedCardsForCurrentUser(this.CardQuerySearch)

  }
  onStatusChange(event: any) {
  this.selectedStatus = Number(event.target.value);
  console.log("Selected status:", this.selectedStatus);
}
}

