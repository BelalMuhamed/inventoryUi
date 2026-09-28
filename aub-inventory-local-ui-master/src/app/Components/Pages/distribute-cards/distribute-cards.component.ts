import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { delay } from 'rxjs';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { ProductService } from 'src/app/Services/Product/product.service';
import { StockService } from 'src/app/Services/Stock/stock.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { BranchReadVM } from 'src/app/ViewModels/branch-read-vm';
import { ProductVM } from 'src/app/ViewModels/product-vm';
import { ProductWithCardAmountAddVM } from 'src/app/ViewModels/product-with-card-amount-add-vm';
import { StockAddVM } from 'src/app/ViewModels/stock-add-vm';
import { StockReadVM } from 'src/app/ViewModels/stock-read-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-distribute-cards',
  templateUrl: './distribute-cards.component.html',
  styleUrls: ['./distribute-cards.component.css']
})
export class DistributeCardsComponent implements OnInit {
  /* Fields */
  stocks: StockReadVM[] = [];
  cardCenterStock!: StockReadVM;
  selectedBranchStock!: StockReadVM;
  form!: FormGroup;
  branches: BranchReadVM[] = [];
  products: ProductVM[] = [];
  isProductExists: boolean = true;
  isEmpty:boolean = false;
  isNotSelected:boolean = false;
  /* Methods */
  constructor(private stockService: StockService, private branchService: BranchService, private productService: ProductService, private fb: FormBuilder,public loaderService:LoaderService) {
  }

  ngOnInit(): void {
    /* Load Branches */
    this.GetProducts();
    this.initForm();
    this.GetBranchStock("Card Center");
    this.GetBranches();
    this.isNotSelected = true;
  }

  GetProducts() {
    this.productService.Get().subscribe({
      next: (data) => {
        this.products = data;
        this.itemsArray.clear(); // Clear previous items
        this.products.forEach(item => {
          this.itemsArray.push(this.createItemFormGroup(item.id));
        });
      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.error.message,
        });

      },
      complete: () => {

      }
    })
  }


  GetBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (data) => 
      {
        this.branches = data.filter(b => b.branchName !== "Card Center");
      },
      error: (error) => 
      {
        console.log(error);
      },
      complete: () =>
      { 

      }
    });
  }

  GetBranchStock(branchName: string) {
    this.stockService.GetBranchStock(branchName).subscribe({
      next: (data) => {
        if (branchName === "Card Center") {
          this.cardCenterStock = data;
        } else {
          this.selectedBranchStock = data;
          this.isProductExists = true;
          if(this.selectedBranchStock?.productsWithAmount?.length == 0){
            this.isEmpty = true;
            this.isNotSelected = false;
          } else {
            this.isEmpty = false;
            this.isNotSelected = false;
          }
        }
      },
      error: (error) => {
        debugger;
        this.selectedBranchStock = {} as StockReadVM;
        this.isEmpty = true;
        this.isNotSelected = false;
      },
      complete: () => {

      }
    });
  }

  branchStockChange(event: any) {
    if (event.target.value === "Select Branch") 
    {
      this.selectedBranchStock = {} as StockReadVM; 
      this.isNotSelected = true;
      this.isEmpty = false;
      return;
    };
    this.GetBranchStock(event.target.value);
  }


  // ************************************************Form Logic Start******************************************************* //
  initForm() {
    this.form = this.fb.group({
      branchName: ['Select Branch', Validators.required],
      productNamesWithCardAmount: this.fb.array([])
    });
  }


  createItemFormGroup(id: number): FormGroup {
    return this.fb.group({
      productId: [id],
      cardAmount: ['']
    });
  }

  get itemsArray() {
    return this.form.get('productNamesWithCardAmount') as FormArray;
  }

  onTransferSubmit() {
    if (this.form.get('branchName')?.value == "Select Branch") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Choose branch",
        });
        return;
    }


    //Check fields
    const isvalid:Boolean = this.checkProductAmounts();
    if(!isvalid){
      return;
    }
    const productNamesWithCardAmount: StockAddVM = this.form.value;
    if (this.form.value.productNamesWithCardAmount) {
      const productNamesWithCardAmountFiltered: StockAddVM = {
        id: productNamesWithCardAmount.id,
        branchName: productNamesWithCardAmount.branchName,
        productNamesWithCardAmount: this.form.value.productNamesWithCardAmount.filter((item: ProductWithCardAmountAddVM) => item.cardAmount !== "")
      };
      console.log(productNamesWithCardAmountFiltered);
      this.stockService.AddStock(productNamesWithCardAmountFiltered).subscribe({
        next: (data) => {
          console.log(data);
          this.GetBranchStock("Card Center");
          this.GetBranchStock(productNamesWithCardAmountFiltered.branchName);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Stock Added Successfully.",
            showConfirmButton: false,
            timer: 1500
          });

        },
        complete: () => {
                Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500
      });
        },
        error: (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.error.message,
          });
        }
      })
      // Now you can use productNamesWithCardAmount safely
    } else {
      // USER DIDN'T PUT ANY VALUES IN CARD AMOUNTS!
    }

  }
  // ************************************************Form Logic End******************************************************* //
  checkProductAmounts(): Boolean{
    for (let i = 0; i < this.form.value.productNamesWithCardAmount.length; i++) {
      if(this.form.value.productNamesWithCardAmount[i].cardAmount < 0)
      {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You can't transfer negative amount.",
          });
        return false;
      }
    }
    return true;
  }
}
