import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // 👈 required for Angular Material
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PrintconfigsService } from 'src/app/Services/PrintConfigration/printconfigs.service';
import { SelectedProductFromSelectBox } from 'src/app/ViewModels/product-vm';
import { ProductPrintConfigVM } from 'src/app/ViewModels/ProductPrintConfigVM';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-print-config-for-product-popup',
  templateUrl: './add-print-config-for-product-popup.component.html',
  styleUrls: ['./add-print-config-for-product-popup.component.css']
})
export class AddPrintConfigForProductPopupComponent {
  //#region services and subscriber
   private printConfigServiceUnSubscriber= new Subscription();
   private _printConfigServiceSubScriber =inject(PrintconfigsService);
  //#endregion
  //#region  constructor
constructor(
    public dialogRef: MatDialogRef<AddPrintConfigForProductPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedProduct :SelectedProductFromSelectBox,printConfigForSelectedProduct:ProductPrintConfigVM[]},
    private fb: FormBuilder,  private router: Router,
  ) {}
  //#endregion

  //#region Variables
  AddConfigForm!: FormGroup;
  //#endregion

  //#region hooks
  ngOnInit(): void
  {
    this.intializeForm();
  }
ngOnDestroy(): void
        {
            this.printConfigServiceUnSubscriber?.unsubscribe();
 }
  //#endregion

  //#region Dialog Actions
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.AddConfigForm.invalid) {
    this.AddConfigForm.markAllAsTouched();
    return;
  }

  const formValue = this.AddConfigForm.value;
const req: ProductPrintConfigVM = {
  ...formValue,
  productName:this.data.selectedProduct.productName,
  printedFace: Number(formValue.printedFace),

  font: Number(formValue.font),
  cpi: Number(formValue.cpi),
  offSetX: Number(formValue.offSetX),
  offSetY: Number(formValue.offSetY),
  image: formValue.image
};



  this.printConfigServiceUnSubscriber.add(this._printConfigServiceSubScriber.AddPRintConfigForSpecificProduct(req).subscribe({
    next:()=>{
  Swal.fire({
      icon: 'success',
      title: 'Done!',
      text: 'The operation completed successfully.',
      confirmButtonText: 'OK'
    });
    },error:(err)=>{
      console.log(err.message);

        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: err.message,

                          });
    }
  }))
   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/Edit-Print-Config']);
        });
    this.dialogRef.close({ saved: true });

  }

  //#endregion

  //#region methods
  intializeForm()
  {
    if(this.data.printConfigForSelectedProduct.length==0)
    {
        this.AddConfigForm=this.fb.group({
          printedFace:[null,Validators.required],
          font:[null,Validators.required],
          cpi:[null,Validators.required],
          offSetX:[null,Validators.required],
          offSetY:[null,Validators.required],
          image: [null, Validators.required]
        });
    }
    else if(this.data.printConfigForSelectedProduct.length==1)
    {
        if(this.data.printConfigForSelectedProduct[0].printedFace==0)
        {
             this.AddConfigForm=this.fb.group({
          printedFace:[1,Validators.required],
          font:[null,Validators.required],
          cpi:[null,Validators.required],
          offSetX:[null,Validators.required],
          offSetY:[null,Validators.required],
          image: [null, Validators.required]
        });
        }
        else
        {
           this.AddConfigForm=this.fb.group({
          printedFace:[0,Validators.required],
          font:[null,Validators.required],
          cpi:[null,Validators.required],
          offSetX:[null,Validators.required],
          offSetY:[null,Validators.required],
          image: [null, Validators.required]
        });

        }
    }

  }
  onFileSelected(event: any) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    let base64 = (reader.result as string).split(',')[1];
    this.AddConfigForm.patchValue({
      image: base64
    });
  };
  reader.readAsDataURL(file);
}


  //#endregion
}
