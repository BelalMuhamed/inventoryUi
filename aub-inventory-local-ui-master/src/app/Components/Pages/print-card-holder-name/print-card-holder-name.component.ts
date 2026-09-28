import { PrintConfiguration } from './../../../ViewModels/imachine-configs';
import { CardData } from './../../../Model/LAN/machine-connection-class';
import { user } from 'src/app/Components/Pages/user/Model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UsermachineService } from './../../../Services/UserMachine/usermachine.service';
import { Component, inject, ViewChild } from '@angular/core';
import { EjectCardReq, GetMachineInfoFromMachineReques, IMachineConfigs, LoadCardReq, PrintCardRequest, PrintRequest, ResponseFromMachine } from 'src/app/ViewModels/imachine-configs';
import { forkJoin, Subscription, finalize } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { Product, ProductVM } from 'src/app/ViewModels/product-vm';
import { ProductService } from 'src/app/Services/Product/product.service';
import { PrintCardService } from 'src/app/Services/PrintCard/print-card.service';
import { SignalRServiceService } from 'src/app/Services/SignalRService/signal-rservice.service';
import { MachinesConfigsService } from 'src/app/Services/MachinesConfigs/machines-configs.service';
import { MatIconButton } from '@angular/material/button';
import { PrintconfigsService } from 'src/app/Services/PrintConfigration/printconfigs.service';
import { SigmaServicesService } from 'src/app/Services/Sigma/sigma-services.service';
import { PrintConfigForSpecificFaceReq, ProductPrintConfigVM } from 'src/app/ViewModels/ProductPrintConfigVM';
import { CardsForUserQuerySearch, PrintedCardsForUser, PrintedCardsPageResult } from 'src/app/ViewModels/card-vm';
import { CardsService } from 'src/app/Services/Cards/cards.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-print-card-holder-name',
  templateUrl: './print-card-holder-name.component.html',
  styleUrls: ['./print-card-holder-name.component.css'],
})
export class PrintCardHolderNameComponent {

  //#region Services
  private _activeRoute = inject(ActivatedRoute);
  private _UserMachineService =inject(UsermachineService);
  private _ProductsService =inject(ProductService);
  private _PrintCard = inject(PrintCardService);
  private _printconfig = inject(PrintconfigsService);
  private _branch = inject(BranchService);
  private _SigmaServices =inject(SigmaServicesService);
  private PrintConfigServiceUnSubscriber=new Subscription();
 private CardServiceUnSubscriber= new Subscription();
  private _CardServiceSubScriber =inject(CardsService);
  constructor( private router: Router,private fb:FormBuilder) {}



  //#endregion


  //#region Subscription Pointers
   private _UnSubscribe_activeRoute !: Subscription;
   private _UnSubscribe_UserMachineService !: Subscription;
     private _UnSubscribe_ProductsService !: Subscription;
private _unsubscripe_PrintCard !: Subscription;
private _unsubscripe_PrintCard02!: Subscription;
private _unsubSecripeGetMachineInfoFromMachine !:Subscription;
private _unsubSecripeejectCard !:Subscription;
private _unsubScripe_printconfig !:Subscription;

   //#endregion

   //#region  variables
        isLoading = false;
        products!:ProductVM[];
        MAchineAvaliable:boolean=false;
        MachineDetails !: IMachineConfigs;
        userName !:string|null;
        MAchineIp !:string;
        MachineInfoRespone!:ResponseFromMachine;
        req !:GetMachineInfoFromMachineReques;
        ejectCardResp !:EjectCardReq;
        iscardinside :boolean=false;
        loadCardReq !:LoadCardReq;
        BtnAvaliable :boolean = true;
        SelectedProduct !:Product|null|undefined;
        SelectedConfig !: ProductPrintConfigVM|null;
        originalWidth = 900;
        originalHeight = 600;
        displayWidth = 500;
        displayHeight = 314;
        CardQuerySearch!:CardsForUserQuerySearch ;
        PageCardsForUser !:PrintedCardsPageResult ;
        pan:string = '';
        selectedStatus !:number;
        range!:FormGroup;
      cardHolderName:string='';


        get posX() {
          return ((this.SelectedConfig?.offSetX ?? 0) / this.originalWidth) * this.displayWidth;
        }
        get posY() {
            return ((this.SelectedConfig?.offSetY ?? 0) / this.originalHeight) * this.displayHeight;

        }
        get CardHolderName() {
          return this.PrintCardHolderNameForm.get('CardHolderName');
        }
  //#endregion

  //#region Form
  //#region tables

  displayedColumns: string[] = ['maskedPan', 'cardHolderName', 'printedDate', 'cardStatus', 'productName'];
  dataSource = new MatTableDataSource<PrintedCardsForUser>([]);
  totalCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion
    //#region MAchineConfiguration form
    MachineDetailsForm = new FormGroup({
          ip:new FormControl<string>('',{validators:[Validators.required]}),
          feederId: new FormControl<number|null>(null,{validators:[Validators.required,Validators.pattern('^[01]$')]}),
          hooperId: new FormControl<number|null>(null,{validators:[Validators.required,Validators.pattern('^[01]$')]}),
          rejectedId: new FormControl<number|null>(null,{validators:[Validators.required,Validators.pattern('^[01]$')]}),
          port: new FormControl<string>('',{validators:[Validators.required]}),
          tipTemp: new FormControl<string>('',{validators:[Validators.required]}),
          tipPres: new FormControl<number|null>(null,{validators:[Validators.required]}),
          tipCons: new FormControl<number|null>(null,{validators:[Validators.required]}) ,
          tipTime: new FormControl<number|null>(null,{validators:[Validators.required]}) ,
          model: new FormControl<string>('',{validators:[Validators.required]}) ,
          name: new FormControl<string>('',{validators:[Validators.required]}) ,
          sn: new FormControl<string>('',{validators:[Validators.required]}) ,
          branchName:new FormControl<string>('',{validators:[Validators.required]}),
          Status:new FormControl<string>('',Validators.required),
          card_inside: new FormControl<string>('',Validators.required),
          cover_open:new FormControl<string>('',Validators.required)
        })
        //#endregion

    //#region card form
        PrintCardHolderNameForm=new FormGroup({
          CardHolderName :new FormControl<string>('',{ validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(26),
          Validators.pattern('^[A-Z0-9 ]*$') // <-- allows spaces

    ]}),

         Product: new FormControl<Product | null>(null, {
        validators: [Validators.required]
         })
        })
        //#endregion
           initDateForm(){
    this.range = this.fb.group({
      start:[''],
      end:[''],
    })
  }

  //#endregion

  //#region Hooks
    ngOnInit()
    {


        this.initDateForm();
      this.loadCardReq = {} as LoadCardReq;
      this.req = {} as GetMachineInfoFromMachineReques;
      this.ejectCardResp = {} as EjectCardReq;

    this._UnSubscribe_activeRoute= this._activeRoute.paramMap.subscribe({
      next:(res)=>{
          this.userName = res.get("userName");
          this._UnSubscribe_UserMachineService = this._UserMachineService.GetMachineByuserName(this.userName).subscribe({
            next:(res)=>{
              console.log(res);

              this.MachineDetails=res;
              this.loadCardReq.Ip= this.MAchineIp= this.ejectCardResp.Ip=this.req.Ip=res.ip;
              this.loadCardReq.Port=   this.ejectCardResp.Port=this.req.Port=res.port;
              this.ejectCardResp.HooperId=Number(res.hooperId);
              this.loadCardReq.FeederId=Number(res.feederId);

              this.ResetMachineInfo();
            },
            error:(err)=>
            {
              Swal.fire({
              title: "Cann't load Machine Configuration ",
              icon:"error",
              text:err.error || err.errors || err.error.errorMessage,

            })
            }


          })
      },
      error:(err)=>{
          Swal.fire({
          title: "Cann't load Machine Configuration ",
          icon:"error",
          text:err.error || err.errors || err.error.errorMessage,

        })
      }
    })



  //#region Get Products
  this._UnSubscribe_ProductsService = this._ProductsService.Get().subscribe({
    next:(res)=>{
      this.products=res;
      console.log(this.products);


    },
    error:(err)=>{
          Swal.fire({
          title: "Cann't load Products ",
          icon:"error",
          text:err.error || err.errors || err.error.errorMessage,});
    }
  })

  //#endregion
    //#region  get printed cards
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
    //#endregion
    }


ngOnDestroy()
{



  this._UnSubscribe_UserMachineService?.unsubscribe();
  this._UnSubscribe_activeRoute?.unsubscribe();
this._UnSubscribe_ProductsService?.unsubscribe();
this._unsubscripe_PrintCard?.unsubscribe();
 this._unsubscripe_PrintCard02?.unsubscribe();
 this._unsubSecripeGetMachineInfoFromMachine?.unsubscribe();
 this._unsubSecripeejectCard?.unsubscribe();
 this._unsubScripe_printconfig?.unsubscribe();
 this.PrintConfigServiceUnSubscriber?.unsubscribe();
this.CardServiceUnSubscriber?.unsubscribe();

}


//#endregion




//#region Methods
populateMachineForm(MachineDetails: IMachineConfigs, MachineInfoRespone: ResponseFromMachine): void {
  this.MachineDetailsForm.patchValue({
    ip: MachineDetails.ip,
    feederId: MachineDetails.feederId,
    hooperId: MachineDetails.hooperId,
    rejectedId: MachineDetails.rejectedId,
    port: MachineDetails.port,
    tipTemp: MachineInfoRespone.Machine_Status.tipper_temperature,
    tipPres: MachineDetails.tipPres,
    tipCons: MachineDetails.tipCons,
    tipTime: MachineDetails.tipTime,
    model: MachineDetails.model,
    sn: MachineDetails.sn,
    name: MachineDetails.name,
    Status: MachineInfoRespone.Machine_Status.machine_status,
    card_inside:MachineInfoRespone.Machine_Status.card_inside,
    cover_open:MachineInfoRespone.Machine_Status.cover_open,


  });
}
ResetMachineInfo()
{
  this.isLoading=true;
 this._unsubSecripeGetMachineInfoFromMachine=this._PrintCard.GetMachineInfoFromMachien(this.req).subscribe(
            {
              next:(res)=>{

                this.MachineInfoRespone = JSON.parse(res.message);




              this.MAchineAvaliable = this.MachineInfoRespone?.Machine_Status?.machine_status?.toLowerCase().trim() === 'ready';
                this.iscardinside=this.MachineInfoRespone?.Machine_Status?.card_inside?.toLowerCase().trim() === 'true'

             this.populateMachineForm(this.MachineDetails,this.MachineInfoRespone);


          this.isLoading=false
              }
              ,error:(err)=>{
                console.log(err);

                   Swal.fire({
                        title: "Cann't connect to machine ",
                        icon:"error",
                        text:"please check connection or back ground service! ",
                        timer:1000
                      });
          this.isLoading=false
              }
            }
          )
        }
RestartMachine()
{
  this.isLoading=true
   this._unsubSecripeGetMachineInfoFromMachine=this._PrintCard.ResetMachine(this.req).subscribe(
            {
              next:(res)=>{
               this.ResetMachineInfo();
                Swal.fire({
                        title: "Done",
                        icon:"info",
                        text:"machine has been restarted ",
                        timer:1000
                      });
              }
              ,error:(err)=>{
                   Swal.fire({
                        title: "Cann't  reset machine",
                        icon:"error",
                        text:err.error || err.errors || err.error.errorMessage,
                        timer:1000
                      });
              }
            }
          )
}
Eject()
{
  this.isLoading=true
  this._unsubSecripeejectCard =this._PrintCard.EjectCard(this.ejectCardResp).subscribe({
    next:(res)=>
    {
      this.isLoading=false
       Swal.fire({
                        title: "Done",
                        icon:"info",
                        text:"machine has been restarted ",
                        timer:1000
                      });
    },error:(err)=>{
      this.isLoading=false


      Swal.fire({


                        title: "Cann't Eject card",
                        icon:"error",
                        text:"failed to eject card ",
                        timer:1000
                      });
    }
  })
}

onSelectedProductChange(event: any) {
      this.SelectedConfig=null;
 var ReqToGetSelectedConfig: PrintConfigForSpecificFaceReq | null = null;
  this.SelectedProduct = this.PrintCardHolderNameForm.get('Product')?.value;

  if(this.SelectedProduct != undefined || this.SelectedProduct != null )
  {
  ReqToGetSelectedConfig= {
  productName: this.SelectedProduct.productName,
  printedFace: 0
};
  this.PrintConfigServiceUnSubscriber.add(this._printconfig.GetById(ReqToGetSelectedConfig).subscribe({
    next:(res)=>{

      this.SelectedConfig=res



    },error:(err)=>{
    }
  }))

  }
}
onFaceChange(event: Event) {
 const value = Number((event.target as HTMLSelectElement).value);
 this.SelectedConfig=null;
 var ReqToGetSelectedConfig: PrintConfigForSpecificFaceReq | null = null;
  this.SelectedProduct = this.PrintCardHolderNameForm.get('Product')?.value;

  if(this.SelectedProduct != undefined || this.SelectedProduct != null )
  {
  ReqToGetSelectedConfig= {
  productName: this.SelectedProduct.productName,
  printedFace: value
};
 this.PrintConfigServiceUnSubscriber.add(this._printconfig.GetById(ReqToGetSelectedConfig).subscribe({
    next:(res)=>{
      this.SelectedConfig=res



    },error:(err)=>{
    }
  }))

  }
}
Print():void
{
this.isLoading=true
  //#region  Load Request Data
let printreq: PrintRequest = {
  cardHolderName: String(this.PrintCardHolderNameForm.get('CardHolderName')?.value),
  machineIp:this.MAchineIp,
  userName: this.userName!,
  productName:this.SelectedProduct?.productName,
 token:localStorage.getItem('token'),
 branchName: localStorage.getItem('branchName'),
printedFace:0
};






 //#endregion

  this._PrintCard.PrintCardHolderName(printreq).subscribe(
    {
      next:(res)=>{
        Swal.fire({
        title:"Printed card ",
        text:"card printed sucessfuly ",
        icon:"info"
      })
        this.isLoading=false
      },
      error:(err)=>{
        this.isLoading=false
        Swal.fire({
        title:"error printing card  ",
        text:err.message,
        icon:"error"
      })
      }
    }
  )

}
convertToPrintConfiguration(data: any): PrintConfiguration {
  return {
    printedItem: 1,
    font: data?.font ?? null,
    cpi: data?.cpi ?? null,
    offSetX: data?.offSetX ?? null,
    offSetY: data?.offSetY ?? null
  };
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
 onPageChange(event: any) {
  this.CardQuerySearch.pageNumber = event.pageIndex + 1;
  this.CardQuerySearch.pageSize = event.pageSize;
  this.GetPrintedCardsForCurrentUser(this.CardQuerySearch);
}

onStatusChange(event: any) {
  this.selectedStatus = Number(event.target.value);
  console.log("Selected status:", this.selectedStatus);
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
//#endregion



}
