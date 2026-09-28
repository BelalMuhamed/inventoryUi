import { AddPrintConfigForProductPopupComponent } from './../add-print-config-for-product-popup/add-print-config-for-product-popup.component';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PrintconfigsService } from 'src/app/Services/PrintConfigration/printconfigs.service';
import { ProductService } from 'src/app/Services/Product/product.service';
import { PrintConfiguration } from 'src/app/ViewModels/imachine-configs';
import { Product, SelectedProductFromSelectBox } from 'src/app/ViewModels/product-vm';
import { ProductPrintConfigVM } from 'src/app/ViewModels/ProductPrintConfigVM';
import Swal from 'sweetalert2';
import { EditPrintConfigPopupForSpecificProductComponent } from '../../edit-print-config-popup-for-specific-product/edit-print-config-popup-for-specific-product.component';

@Component({
  selector: 'app-edit-print-config',
  templateUrl: './edit-print-config.component.html',
  styleUrls: ['./edit-print-config.component.css']
})
export class EditPrintConfigComponent
{
constructor(private dialog: MatDialog, private router: Router) {}
    //#region Table Data
    displayedColumns: string[] = [ 'printedFace', 'font','cpi','offSetX','offSetY','image','actions'];
    //#endregion

    //#region variables
      products !:Product[];
      printConfigForSelectedProduct:any[]=[]
      selectedProduct :SelectedProductFromSelectBox|null=null;
    //#endregion

     //#region subscription
        private productServiceUnSubscriber= new Subscription();
        private _productServiceSubScriber =inject(ProductService);
        private PrintConfigServiceUnSubscriber=new Subscription();
        private _PrintConfigServiceSubScriber=inject(PrintconfigsService);
     //#endregion

     //#region hooks
        ngOnInit(): void
        {
          this.LoadProductsData()
        }
        ngOnDestroy(): void
        {
            this.productServiceUnSubscriber?.unsubscribe();
        }
     //#endregion

     //#region Methods
        LoadProductsData()
        {
          this.productServiceUnSubscriber.add(
              this._productServiceSubScriber.getProducts().subscribe({
                next:(res)=>{
                  this.products=res;

                },
                error:(err)=>{
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: err.message,

                    });
                }
              })
          )
        }
        onProductChange(event: any)
        {
          const selectedId = Number((event.target as HTMLSelectElement).value);
          const SelectProductName =String(event.target.options[event.target.selectedIndex].text);
          if (this.selectedProduct === null) {
              this.selectedProduct = {
                id: selectedId,
                productName: SelectProductName
              };
            }
            else
            {
              this.selectedProduct.id=selectedId;
                  this.selectedProduct.productName=SelectProductName;
            }
            this.GetPrintConfigForSelectedProduct(this.selectedProduct.productName);

        }
        GetPrintConfigForSelectedProduct(SelectedProductName:string)
        {
          this.PrintConfigServiceUnSubscriber.add(this._PrintConfigServiceSubScriber.GetPrintConfigrationForSpecificProduct(SelectedProductName).subscribe(
            {
              next:(res)=>
              {
               this.printConfigForSelectedProduct = res ?? [];
               console.log(this.printConfigForSelectedProduct);


              },error:(err)=>{
                Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: err.message,

                    });
              }
            }
          ))
        }
        openDialog()
        {
           this.dialog.open(AddPrintConfigForProductPopupComponent, {
            width: 'auto',
            maxWidth: '80vw',
            height: 'auto',
            maxHeight: '80vh',
            data: {
              selectedProduct: this.selectedProduct,
              printConfigForSelectedProduct: this.printConfigForSelectedProduct
            }
          });
        }
        OpenEditDialog(SelectedPrintConfig:ProductPrintConfigVM){


          this.dialog.open(EditPrintConfigPopupForSpecificProductComponent,
             {
            width: 'auto',
            maxWidth: '80vw',
            height: 'auto',
            maxHeight: '80vh',
            data: {
              selectedProduct: SelectedPrintConfig
            }
          }
          )
        }

DeletePrintConfig(SelectedPrintConfig: ProductPrintConfigVM) {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you really want to delete configuration for ${SelectedPrintConfig.productName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.PrintConfigServiceUnSubscriber.add(
        this._PrintConfigServiceSubScriber.DeletePrintConfig(SelectedPrintConfig).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Done!',
              text: 'The config was deleted successfully.',
              confirmButtonText: 'OK'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.error?.message || 'Delete failed!',
              confirmButtonText: 'OK'
            });
          }
        })
      );
    }
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/Edit-Print-Config']);
        });
  });
}

     //#endregion
}
