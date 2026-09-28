import { SigmaServicesService } from 'src/app/Services/Sigma/sigma-services.service';
import { UsermachineService } from 'src/app/Services/UserMachine/usermachine.service';
import { LoginServiceService } from './../../../Services/login-service.service';
import { Component, inject } from '@angular/core';
import { Subscription, finalize, timer } from 'rxjs';
import Swal from 'sweetalert2';
import { isigmaInfo, PrintRequestForSigma } from 'src/app/ViewModels/isigma';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formatArrayBuffer } from '@microsoft/signalr/dist/esm/Utils';
import { Title } from '@angular/platform-browser';
import { icon, text } from '@fortawesome/fontawesome-svg-core';
import { Product, ProductVM } from 'src/app/ViewModels/product-vm';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { ProductService } from 'src/app/Services/Product/product.service';
import { BranchService } from 'src/app/Services/Branch/branch.service';

@Component({
  selector: 'app-print-card-holder-name-from-sigma',
  templateUrl: './print-card-holder-name-from-sigma.component.html',
  styleUrls: ['./print-card-holder-name-from-sigma.component.css']
})
export class PrintCardHolderNameFromSigmaComponent {

//#region Services
      private _UserMachineService =inject(UsermachineService);
      private _sigmaServices =inject(SigmaServicesService);
      private _ProductsService =inject(ProductService);
      private _branchService =inject(BranchService);

  //#endregion

//#region unsubscriper
     private _UnSubscribe_UserMachineService !: Subscription;
     private _UnSubscribe_sigmaServices !: Subscription;
     private _UnSubscribe_UserMachineService01 !: Subscription;
     private _UnSubscribe_ProductsService !: Subscription;
     private _UnSubscribe_branchService !: Subscription;


  //#endregion

//#region  variables
 products!:ProductVM[];
 branchdata!:BranchVm;
  userName!:string|null;
  branchName!:string|null;
  PrinterName!:string|null;
  SigmaInformation !:isigmaInfo;
  btndisabled:boolean=true;
  _req!:PrintRequestForSigma;
  isloading:boolean=false;

//#endregion

//#region Hooks
ngOnInit():void
{
 this.userName= localStorage.getItem('username');
 this.branchName= localStorage.getItem('branchName');

this._UnSubscribe_UserMachineService=this._UserMachineService.GetMachineByuserName(this.userName).subscribe(
 {
  next:(res)=>
  {
    this.PrinterName=res.name;
   this.GetMachineInfo();


  },error:(err)=>
  {
  Swal.fire({
                   title: "Cann't load Machine information for this user please check server ! ",
                   icon:"error",

                 })

  }
 }
)
//#region Get Products
  this._UnSubscribe_ProductsService = this._ProductsService.Get().subscribe({
    next:(res)=>{
      this.products=res;



    },
    error:(err)=>{

          Swal.fire({
          title: "Cann't load Products ! ",
          icon:"error",
          text:err.error || err.errors || err.error.errorMessage,});
    }
  })

  //#endregion
//#region  get  branch
this._UnSubscribe_branchService=this._branchService.getByBranchName(this.branchName).subscribe(
  {
    next:(res)=>
    {
      this.branchdata=res;
      console.log(res);

    },
    error:(err)=>
    {
          Swal.fire({
          title: "Cann't load Products ! ",
          icon:"error",
          text:err.error || err.errors || err.error.errorMessage,});
    }
  }
)
//#endregion
}
ngOnDestroy():void
{
this._UnSubscribe_UserMachineService?.unsubscribe();
this._UnSubscribe_sigmaServices?.unsubscribe();
this._UnSubscribe_ProductsService?.unsubscribe();
}
//#endregion

//#region  methods

GetMachineInfo()
{
  if(this.PrinterName != null)
  {
    this.isloading= true;
     this._UnSubscribe_sigmaServices=this._sigmaServices.GetSigmaInfo(this.PrinterName).subscribe(
      {
          next:(res)=>{
              console.log(res);


              this.SigmaInformation={
                Ip:res.printerOptionsValues._printerAddress,
                model:res.printerOptionsValues._printerModel,
                serialNumber:res.printerOptionsValues._printerSerialNumber,
                LockState:res.printerOptionsValues._lockState,
                status:res.suppliesValues._printerStatus,
                FeederStatus:res.hOPPER_INFORMATION[1]._status
              }
           this.populateMachineForm(this.SigmaInformation);
              this.isloading=false;


          },error:(err)=>{
            this.isloading=false
             Swal.fire({
                   title: "Cann't load Machine information ",
                   icon:"error",
                   text:err.error || err.errors || err.error.errorMessage,

                 })

          }
      }
    )
  }
  else
  {
    Swal.fire({
                   title: "Cann't load printer Configuration ",
                   icon:"error",
                   text:"error in printer name",

                 })
  }

}

populateMachineForm(sigmainfo:isigmaInfo)
{
  this.SigmaInfoForm.patchValue({
  Ip:sigmainfo.Ip,
  model:sigmainfo.model,
  LockState:sigmainfo.LockState,
  serialNumber:sigmainfo.serialNumber,
  status:sigmainfo.status,
  FeederStatus:sigmainfo.FeederStatus
  })
}
RestartPrinter()
{

this._UnSubscribe_UserMachineService01=this._sigmaServices.restart(this.PrinterName).subscribe({
  next:(res)=>{

 setTimeout(()=>{
    this.GetMachineInfo();
    },1000)

     setTimeout(()=>{
    this.GetMachineInfo();
    },40000)

  },error:(err)=>
  {
    Swal.fire({
       title: "Cann't connect to machine please check connection !",
       icon:"error",
        text:err,
         timer:1000
        });

  }
})
}

Print()
{
  this.btndisabled=false;
    this._req={
       CardHolderName: String(this.PrintCardHolderNameForm.get('CardHolderName')?.value),
        product: this.PrintCardHolderNameForm.get('Product')?.value,
         PrinterName:this.PrinterName,
         UserName:this.userName,
      branch:this.branchdata

    }

  this.PrintCardHolderNameForm
  this._UnSubscribe_UserMachineService01=this._sigmaServices.PrintFromSigma(this._req).subscribe(
    {
      next:(res)=>
      {
        console.log(res);

      },
      error:(err)=>{
        console.log(err);

      }
    }
  )
}
//#endregion


//#region Forms
SigmaInfoForm =new FormGroup({
  Ip:new FormControl('',{validators:[Validators.required]}),
  model:new FormControl('',{validators:[Validators.required]}),
  LockState:new FormControl('',{validators:[Validators.required]}),
  serialNumber:new FormControl('',{validators:[Validators.required]}),
  status:new FormControl('',{validators:[Validators.required]}),
  FeederStatus:new FormControl('',{validators:[Validators.required]})
})


PrintCardHolderNameForm=new FormGroup({
          CardHolderName :new FormControl<string>('',{ validators: [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(24),
          Validators.pattern('^[A-Z0-9 ]*$')

    ]}),
          Product: new FormControl(null,{validators:[Validators.required]}) ,
})
//#endregion
}
