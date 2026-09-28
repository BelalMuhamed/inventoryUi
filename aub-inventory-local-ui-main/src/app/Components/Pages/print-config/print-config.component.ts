import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PrintconfigsService } from 'src/app/Services/PrintConfigration/printconfigs.service';
import { ProductService } from 'src/app/Services/Product/product.service';
import { ColumnDef } from 'src/app/ViewModels/ImatTablesColumn';
import { AllReqFilterations, PrintConfigRespDto } from 'src/app/ViewModels/IPrintConfigDtos';
import { ProductVM } from 'src/app/ViewModels/product-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-print-config',
  templateUrl: './print-config.component.html',
  styleUrls: ['./print-config.component.css'],
  })
export class PrintConfigComponent
{
  // #region Variables
  isLoading = false;
  totalCount = 0;
  AllProducts : ProductVM[]=[];
  req: AllReqFilterations = {
    pageIndex: 1,
    pageSize: 5,
    productName: ''
  };

  // #endregion

  // #region Table setup
  columns: ColumnDef[] = [
    { key: 'productName', label: 'Product Name' },
    { key: 'printedFace', label: 'Printed Face', type: 'printedFace' },
    { key: 'fontFamily', label: 'Font Family' },
    { key: 'fontSize', label: 'Font Size', type: 'number' },
    { key: 'printColor', label: 'Print Color' },
    { key: 'riponType', label: 'Ribbon Type' },
    { key: 'x', label: 'Position X', type: 'number' },
    { key: 'y', label: 'Position Y', type: 'number' },
    { key: 'printWay', label: 'Print Orientation', type: 'printWay' },
    { key: 'image', label: 'Design Image', type: 'image' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  displayedColumnKeys = this.columns.map(c => c.key);
  dataSource = new MatTableDataSource<PrintConfigRespDto>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // #endregion

  // #region Services
  private printConfigSubscription = new Subscription();
  private printConfigService = inject(PrintconfigsService);
   private productUnSubscription = new Subscription();
  private productService = inject(ProductService);
  // #endregion

  // #region Constructor & Hooks
  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.loadConfigs();
    this.LoadAllProducts();
  }

  ngOnDestroy(): void {
    this.printConfigSubscription?.unsubscribe();
    this.productUnSubscription?.unsubscribe();
  }
  // #endregion

  // #region Methods
  loadConfigs(): void {
    this.isLoading = true;
    this.printConfigSubscription.add(
      this.printConfigService.GetAllPrintConfig(this.req).subscribe({
        next: (res) => {
          this.dataSource.data = res.data;
          this.totalCount = res.totalCount;
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load print configurations!',
            confirmButtonColor: '#d33'
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      })
    );
  }

  onPageChange(event: PageEvent): void {
    this.req.pageIndex = event.pageIndex + 1;
    this.req.pageSize = event.pageSize;
    this.loadConfigs();
  }
  trackByKey(index: number, col: any): string {
  return col.key;
}
LoadAllProducts()
{
  this.productUnSubscription.add(this.productService.Get().subscribe({
    next:(res)=>{
      this.AllProducts=res;

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
onProductSelected(event: Event) {
  const selectedValue = (event.target as HTMLSelectElement).value;
  this.req.productName=selectedValue;
  this.loadConfigs();
}
deleteProduct(productName: string): void {

this.printConfigService.DeleteProductPrintConfig(productName).subscribe({
  next:()=>{
    this.LoadAllProducts();
    this.loadConfigs();
 Swal.fire({
    title: 'Deleted!',
    text: `${productName} has been deleted successfully.`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  });

  },error:()=>{
    Swal.fire({
    title: 'Deleted Failed!',
    text: `please check your connection !`,
    icon: 'error',
    timer: 2000,
    showConfirmButton: false
  });
  }
})



}
confirmDelete(element: any): void {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you really want to delete "${element.productName}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteProduct(element.productName);
    }
  });
}
editProductConfig(element: any): void {
    const productName = element.productName;
    this.router.navigate(['/edit-print-config', productName]);
  }

  // #endregion
}
