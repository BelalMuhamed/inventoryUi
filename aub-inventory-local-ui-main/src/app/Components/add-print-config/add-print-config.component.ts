import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { PrintconfigsService } from 'src/app/Services/PrintConfigration/printconfigs.service';
import { ProductService } from 'src/app/Services/Product/product.service';
import { PrintConfigRespDto } from 'src/app/ViewModels/IPrintConfigDtos';
import { Product } from 'src/app/ViewModels/product-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-print-config',
  templateUrl: './add-print-config.component.html',
  styleUrls: ['./add-print-config.component.css']
})
export class AddPrintConfigComponent {
 private productUnSubscription = new Subscription();
  private productService = inject(ProductService);

fonts:string[]=[];
  previewImage: string | null = null;
fontStyles: string[] = [];

addPrintConfigForm!: FormGroup;
ProductsWithoutPrintConfig:Product[]=[];
 private printConfigSubscription = new Subscription();
  private printConfigService = inject(PrintconfigsService);
   RIBBON_TYPES: string[] = this.printConfigService.RIBBON_TYPES;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.GetProductsThatHavenotPrintConfig();
    this.getServerFonts();
    this.getFontStyles();
  }



  initializeForm(): void {
    this.addPrintConfigForm = this.fb.group({
      productName: ['', Validators.required],
      printedFace: ['', Validators.required],   // e.g. 0 = front
      fontFamily: ['', Validators.required],
      fontSize: [12, [Validators.required, Validators.min(1)]],
      printColor: ['', Validators.required],
      riponType: [''],
      x: ['', Validators.required],
      y: ['', Validators.required],
      image: [null,Validators.required], // Uint8Array or base64
      printWay: ['', Validators.required],
      backGroundColor:['',Validators.required],
      fontStyle:['',Validators.required]
          // e.g. 0 = landscape
    });
  }

  GetProductsThatHavenotPrintConfig()
  {
    this.productUnSubscription.add(this.productService.getProductsWithoutPrintConfig().subscribe({
      next:(res)=>{
      this.ProductsWithoutPrintConfig=res

      },
      error:(err)=>{
           Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load poducts check your server connection!',
                    confirmButtonColor: '#d33'
                  });
      }
    }))
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
    const base64String = (reader.result as string).split(',')[1];
    const byteArray = this.base64ToByteArray(base64String);

    this.previewImage = reader.result as string;
    this.addPrintConfigForm.patchValue({ image: byteArray });

    fileInput.value = '';
  };

  reader.readAsDataURL(file);
}
getFontStyles() {
  this.printConfigService.GetFontStyles().subscribe({
    next: (res: string[]) => {
      this.fontStyles = res;
    },
    error: (err) => console.error(err)
  });
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
private byteArrayToBase64(byteArray: Uint8Array): string {
  let binary = '';
  const len = byteArray.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }
  return btoa(binary);
}
onSubmit(): void {
  if (this.addPrintConfigForm.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'please check your input data ',
      confirmButtonColor: '#f39c12'
    });
    return;
  }

  const formValue = this.addPrintConfigForm.value;
 if (formValue.image instanceof Uint8Array) {
    formValue.image = this.byteArrayToBase64(formValue.image);
  }
  this.printConfigService.addNewPrintConfig(formValue).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'saved Done',
        confirmButtonColor: '#3085d6'
      });
      this.addPrintConfigForm.reset();
      this.previewImage = null;
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'cannot save ' ,
        text: err.message,
        confirmButtonColor: '#d33'
      });
    }
  });
}

}
