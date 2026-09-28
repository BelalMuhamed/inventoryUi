import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { CardsService } from 'src/app/Services/Cards/cards.service';
import { ProductService } from 'src/app/Services/Product/product.service';
import { StockService } from 'src/app/Services/Stock/stock.service';
import { TransactionService } from 'src/app/Services/TransactionServices/transaction.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { MakeTransactionDto, ProductTransactionDto } from 'src/app/ViewModels/ItransactionVm';
import { BranchReadVM } from 'src/app/ViewModels/branch-read-vm';
import { CardTransactionDto, CardTransactionFilteration } from 'src/app/ViewModels/card-vm';
import { ProductVM } from 'src/app/ViewModels/product-vm';
import { StockReadVM } from 'src/app/ViewModels/stock-read-vm';
import { TransferPutVM } from 'src/app/ViewModels/transfer-put-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit{
  branchesStock:StockReadVM[] = [];
  selectedProducts: ProductTransactionDto[] = [];
 cardFilteration !:CardTransactionFilteration;
userName:string|null=null;
  productsVM:ProductVM[] = [];
  branchesVM:BranchReadVM[] = [];
  form!:FormGroup;
  sourceBranch: string = '';
targetBranch: string = '';
  expandedCards: { [productId: number]: CardTransactionDto[]|null } = {};
  selectedCards: CardTransactionDto[] = [];
   private CardService = inject(CardsService);
    private CardSubscription = new Subscription();
     private TransactionService = inject(TransactionService);
    private TransactionSubscription = new Subscription();
    GetCards(SelectedProduct: ProductTransactionDto) {

  // ✅ If already expanded → collapse & clear selected cards for this product
  if (this.expandedCards[SelectedProduct.productId]) {
    this.expandedCards[SelectedProduct.productId] = null;

    // ✅ Remove selected cards belonging to this product
    this.selectedCards = this.selectedCards.filter(
      c => c.productId !== SelectedProduct.productId
    );

    return;
  }

  this.cardFilteration = {
    productId: SelectedProduct.productId,
    branchName: this.sourceBranch,
    transactionId:null,
    page:null,
    pageSize:null,
    maskedPan:null
  };

  this.CardSubscription.add(
    this.CardService.getCardsForRequest(this.cardFilteration).subscribe({
      next: (res) => {
        this.expandedCards[SelectedProduct.productId] = res;
      }
    })
  );
}
getSelectedCount(productId: number): number {
  return this.selectedCards.filter(c => c.productId === productId).length;
}

checkSource(event: any) {
  this.sourceBranch = event.target.value;

  // تنظيف أي بيانات موجودة قبل
  this.selectedProducts = [];

  if (!this.sourceBranch) return;

  // العثور على الـ branch المحدد
  const branchStock = this.branchesStock.find(b => b.branchName === this.sourceBranch);
  if (!branchStock) return;

  // إنشاء list من ProductTransactionDto بس للمنتجات اللي cardAmount > 0
  this.selectedProducts = branchStock.productsWithAmount
    .filter(p => p.cardAmount > 0) // <-- هنا الفلترة
    .map(p => ({
      transactionId: null,
      productId: p.productId,
      quantity: null,
      productName: p.productName,
      productTransactionStatus: 0,
      cardLastSixDigits: null
    }));

  console.log(this.selectedProducts); // للتأكد
}
checkTarget(event: any) {
  if (!this.sourceBranch) {
    Swal.fire({
      icon: "warning",
      title: "Select Source First",
      text: "Please select a source branch before selecting the target branch.",
    });
    event.target.value = '';
    return;
  }

  this.targetBranch = event.target.value;

  if (this.targetBranch === this.sourceBranch) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You can't transfer to the same branch!",
    });
    this.targetBranch = '';
    event.target.value = '';
  }
}


  constructor(private stockService:StockService,private productService:ProductService,private branchSerive:BranchService, private fb:FormBuilder,public loaderService:LoaderService) {
  }
  ngOnInit(): void {
    this.userName=localStorage.getItem('username');
    this.getBranchesStock();
    this.getBranches();

  }





  getBranches(){
    this.branchSerive.getAllBranches().subscribe({
      next:(data) => {
        this.branchesVM = data;
      },
      complete:() => {

      },
      error:(error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    })
  }

  getBranchesStock(){
    this.stockService.Get().subscribe({
      next:(data) => {
        console.log(data);
        this.branchesStock = data;
      },
      complete:() => {

      },
      error:(error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    })
  }

  toggleCardSelection(card: CardTransactionDto, event: any) {
  if (event.target.checked) {
    this.selectedCards.push(card);
  } else {
    this.selectedCards = this.selectedCards.filter(c => c.id !== card.id);
  }
}
areAllSelectedForProduct(productId: number): boolean {
  const productCards = this.expandedCards[productId] ?? [];
  if (!productCards.length) return false;
  return productCards.every(card => this.selectedCards.some(c => c.id === card.id));
}

// Toggle "Select All" for a product
toggleSelectAllForProduct(productId: number, event: any) {
  const productCards = this.expandedCards[productId] ?? [];
  if (event.target.checked) {
    // Add all cards of this product
    productCards.forEach(card => {
      if (!this.selectedCards.some(c => c.id === card.id)) {
        this.selectedCards.push(card);
      }
    });
  } else {
    // Remove all cards of this product
    this.selectedCards = this.selectedCards.filter(c => c.productId !== productId);
  }
}
isCardSelected(card: CardTransactionDto): boolean {
  return this.selectedCards.some(c => c.id === card.id);
}
// Select a specific number of cards for a product
selectCardCountForProduct(productId: number, count: number) {
  const productCards = this.expandedCards[productId] ?? [];
  if (!productCards.length) return;

  // Validate count
  if (count > productCards.length) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Count',
      text: `You cannot select more than ${productCards.length} cards.`,
    });
    return;
  }

  // Remove previous selections for this product
  this.selectedCards = this.selectedCards.filter(c => c.productId !== productId);

  // Add first N cards
  this.selectedCards.push(...productCards.slice(0, count));
}



SubmitTransaction() {
  if (!this.sourceBranch || !this.targetBranch) {
    Swal.fire({
      icon: 'warning',
      title: 'Branches Missing',
      text: 'Please select both source and target branches before submitting.',
    });
    return;
  }

  if (this.selectedCards.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'No Cards Selected',
      text: 'Please select at least one card.',
    });
    return;
  }

  // Only include products that have selected cards
  const productIdsWithSelectedCards = [...new Set(this.selectedCards.map(c => c.productId))];

  const filteredProducts = this.selectedProducts.filter(p =>
    productIdsWithSelectedCards.includes(p.productId)
  );

  // Map ProductTransactionDto for backend
  const transactionProducts: ProductTransactionDto[] = filteredProducts.map(p => ({
    transactionId: null,
    productId: p.productId,
    productName: p.productName,
    quantity: this.selectedCards
      .filter(c => c.productId === p.productId).length,
    productTransactionStatus: 3,
    cardLastSixDigits: null
  }));

  // Map CardTransactionDto for backend
  const transactionCards: CardTransactionDto[] = this.selectedCards.map(c => ({
  id: c.id,
  maskedPan: c.maskedPan,
  branchName: null,
  status: 4, // assuming 4 = "pending/transfer"
  branchId: null,
  transactionId: null,
  cardTransactionStatus: 0, // default
  batchId:null,        // <-- add this
  productId: c.productId    // <-- add this
}));


  // Build payload for backend
  const payload: MakeTransactionDto = {
    transaction: {
      id: 0,
      source: this.sourceBranch,
      destination: this.targetBranch,
      requestDate: new Date().toISOString(),
      recivedDate: new Date().toISOString(),
      acceptDeclinedDate: null,
      transactionStatus: 3, // Transfer
      askingTransactionUser: this.userName || 'Unknown',
      recivedUser: null,
      acceptRequestUser: this.userName || 'Unknown'
    },
    transactionProducts: transactionProducts,
    transactionCards: transactionCards
  };

this.AddNewTransaction(payload);
}
AddNewTransaction(dto:MakeTransactionDto)
{
  console.log(dto);

  this.TransactionSubscription.add(this.TransactionService.addNewTransaction(dto).subscribe({
    next:(res)=>{
 Swal.fire({
        icon: 'success',
        title: 'Transaction Submitted',
        text: 'Transaction successfully added!',
      });
      // Clear selection
      this.selectedCards = [];
      this.selectedProducts = [];
      this.sourceBranch = '';
      this.targetBranch = '';
      this.getBranchesStock();
    this.getBranches();
    },
    error:(err)=>{
 Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error?.message || 'Something went wrong while submitting the transaction.',
      });
        this.selectedCards = [];
      this.selectedProducts = [];
      this.sourceBranch = '';
      this.targetBranch = '';
      this.getBranchesStock();
    this.getBranches();
    }
  }))
}
}
