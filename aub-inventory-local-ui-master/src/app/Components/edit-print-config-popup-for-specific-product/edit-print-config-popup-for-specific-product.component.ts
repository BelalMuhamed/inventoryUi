import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PrintconfigsService } from 'src/app/Services/PrintConfigration/printconfigs.service';
import { ProductPrintConfigVM } from 'src/app/ViewModels/ProductPrintConfigVM';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-print-config-popup-for-specific-product',
  templateUrl: './edit-print-config-popup-for-specific-product.component.html',
  styleUrls: ['./edit-print-config-popup-for-specific-product.component.css']
})
export class EditPrintConfigPopupForSpecificProductComponent {
   private printConfigServiceUnSubscriber= new Subscription();
   private _printConfigServiceSubScriber =inject(PrintconfigsService);
  constructor(
    public dialogRef: MatDialogRef<EditPrintConfigPopupForSpecificProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ,private fb: FormBuilder, private router: Router) {}

  closePopup() {
    this.dialogRef.close('Data returned from popup');
  }
    configForm!: FormGroup;


    ngOnInit(): void {


    this.configForm = this.fb.group({
      font: [null, Validators.required],
      cpi: [null, Validators.required],
      offSetX: [null, Validators.required],
      offSetY: [null, Validators.required],
      image: [null, Validators.required]
    });

    this.configForm.patchValue(this.data.selectedProduct);


  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
        const req :ProductPrintConfigVM=
        {
          productName: this.data.selectedProduct.productName,
          printedFace: this.data.selectedProduct.printedFace,
          font: this.configForm.value.font,
          cpi: this.configForm.value.cpi,
          offSetX: this.configForm.value.offSetX,
          offSetY:this.configForm.value.offSetY,
          image: this.configForm.value.image
        }
        this.printConfigServiceUnSubscriber.add(this._printConfigServiceSubScriber.UpdatePrintConfigForSpecificProduct(req).subscribe({
          next:(res)=>
          {
              Swal.fire({
      icon: 'success',
      title: 'Done!',
      text: 'The config updated successfully.',
      confirmButtonText: 'OK'
    });
          },error:(err)=>{
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

    return;
  }
  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      this.configForm.patchValue({ image: base64 });
    };
    reader.readAsDataURL(file);
  }
}
ngOnDestroy(): void {
  this.printConfigServiceUnSubscriber?.unsubscribe();
}
}
