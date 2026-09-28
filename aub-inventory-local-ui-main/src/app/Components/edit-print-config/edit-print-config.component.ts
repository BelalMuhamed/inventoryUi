import { PrintconfigsService } from './../../Services/PrintConfigration/printconfigs.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Services/Product/product.service';
import { PrintConfigRespDto } from 'src/app/ViewModels/IPrintConfigDtos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-print-config',
  templateUrl: './edit-print-config.component.html',
  styleUrls: ['./edit-print-config.component.css']
})
export class EditPrintConfigComponent {
    constructor(private fb: FormBuilder,private route: ActivatedRoute) {}
addPrintConfigForm!: FormGroup;
fontStyles: string[] = [];

 private printConfigSubscription = new Subscription();
   private printConfigService = inject(PrintconfigsService);
   SelectedProduct!:PrintConfigRespDto
    RIBBON_TYPES: string[] = this.printConfigService.RIBBON_TYPES;


fonts:string[]=[];
  previewImage: string | null = null;

ngOnInit()
{
   this.initializeForm();
   this.getServerFonts();
   this.getFontStyles();
  const productName = this.route.snapshot.paramMap.get('productName')!;
    if(productName)
    {
      this.GetPrintConfigForProduct(productName)

    }
}
 ngOnDestroy(): void {
    this.printConfigSubscription?.unsubscribe();


  }
patchFormValues(product: PrintConfigRespDto): void {
  const base64Image = product.image
    ? `data:image/png;base64,${product.image}`
    : null;

  this.previewImage = base64Image; // for preview
  this.addPrintConfigForm.patchValue({

    printedFace: product.printedFace ?? '',
    fontFamily: product.fontFamily || '',
    fontSize: product.fontSize || 12,
    printColor: product.printColor || '',
    riponType: product.riponType || '',
    x: product.x ?? '',
    y: product.y ?? '',
    image: product.image || '',
    printWay: product.printWay ?? '',
    backGroundColor: product.backGroundColor || '',
    fontStyle:product.fontStyle || ''

  });
}

     initializeForm(): void {
       this.addPrintConfigForm = this.fb.group({

         printedFace: ['', Validators.required],   // e.g. 0 = front
         fontFamily: ['', Validators.required],
         fontSize: [12, [Validators.required, Validators.min(1)]],
         printColor: ['', Validators.required],
         riponType: [''],
         x: ['', Validators.required],
         y: ['', Validators.required],
         image: [null,Validators.required], // Uint8Array or base64
         printWay: ['', Validators.required],      // e.g. 0 = landscape
        backGroundColor: ['', Validators.required],
        fontStyle:['',Validators.required]

       });
     }



       getServerFonts()
       {
           this.printConfigSubscription.add(this.printConfigService.GetFonts().subscribe({
             next:(res)=>{
                 this.fonts=res;


             },error:(err)=>{
                Swal.fire({
                           icon: 'error',
                           title: 'Oops...',
                           text: 'Failed to load fonts check your server connection!',
                           confirmButtonColor: '#d33'
                         });
             }
           }))
       }
     onImageSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (!fileInput.files || fileInput.files.length === 0) return;

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const fullBase64 = reader.result as string; // e.g. "data:image/png;base64,AAAA...."
    const pureBase64 = fullBase64.split(',')[1]; // remove prefix

    // ✅ For preview in the UI
    this.previewImage = fullBase64;

    // ✅ For backend (pure base64 string only)
    this.addPrintConfigForm.patchValue({ image: pureBase64 });

    fileInput.value = '';
  };

  reader.readAsDataURL(file);
}


     private base64ToByteArray(base64: string): Uint8Array {
       const binaryString = window.atob(base64);
       const len = binaryString.length;
       const bytes = new Uint8Array(len);
       for (let i = 0; i < len; i++) {
         bytes[i] = binaryString.charCodeAt(i);
       }
       return bytes;
     }

onUpdate(): void {
  if (this.addPrintConfigForm.invalid) {
    this.addPrintConfigForm.markAllAsTouched();
    return;
  }

  // Get values from form (excluding productName)
  const formValues = this.addPrintConfigForm.value;


  // Merge with productName (you already have it from selected product)
  const updatedConfig: PrintConfigRespDto = {
    ...formValues,
    productName: this.SelectedProduct.productName
  };


  this.printConfigService.updatePrintConfig(this.SelectedProduct.productName, updatedConfig)
    .subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Print configuration updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err?.error?.message || 'Something went wrong. Please try again.'
        });
      }
    });
}
GetPrintConfigForProduct(productName:string)
{
this.printConfigService.getPrintConfigByProductName(productName).subscribe({
  next:(res)=>{
    this.SelectedProduct= res
    if(this.SelectedProduct)
    {
       this.patchFormValues(this.SelectedProduct)
    }
  },error:(err)=>{
        Swal.fire({
                           icon: 'error',
                           title: 'Oops...',
                           text: 'Failed to load Config For this Product check your server connection!',
                           confirmButtonColor: '#d33'
                         });
  }
})
}
getFontStyles() {
  this.printConfigService.GetFontStyles().subscribe({
    next: (res: string[]) => {
      this.fontStyles = res;
    },
    error: (err) => console.error(err)
  });
}
}
