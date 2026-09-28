import { CardData } from './../../Model/LAN/machine-connection-class';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BranchProductsDto, BranchRequestDto } from 'src/app/Model/BranchRequest/IBranchRequest';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { CardsService } from 'src/app/Services/Cards/cards.service';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import { StockService } from 'src/app/Services/Stock/stock.service';
import { TransactionService } from 'src/app/Services/TransactionServices/transaction.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { CardTransactionDto, CardTransactionFilteration } from 'src/app/ViewModels/card-vm';
import { MakeTransactionDto, ProductTransactionDto, TransactionVm } from 'src/app/ViewModels/ItransactionVm';
import { StockReadVM } from 'src/app/ViewModels/stock-read-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recived-transaction-copmonent',
  templateUrl: './recived-transaction-copmonent.component.html',
  styleUrls: ['./recived-transaction-copmonent.component.css']
})
export class RecivedTransactionCopmonentComponent {
 id!: number;
 DestenationBranchdata!:BranchVm;

  cardFilteration !:CardTransactionFilteration;
  selectedCards: CardTransactionDto[] = [];
expandedCards: {
  [productId: number]: {
    data: CardTransactionDto[],
    page: number,
    pageSize: number,
    totalCount: number
  } | null
} = {};
searchText: { [productId: number]: string } = {};

   private CardService = inject(CardsService);
  private CardSubscription = new Subscription();
  private BranchService = inject(BranchService);
  private BranchSubscription = new Subscription();
  private transactionService = inject(TransactionService);
  private transactionSubscription = new Subscription();
  private router = inject(Router);
  transactionProducts:ProductTransactionDto[]=[]
  userName:string|null=null;
   transactionDetails!:TransactionVm;
   CardsTransactionFilteration!:CardTransactionFilteration;
allCardsMap: { [productId: number]: CardTransactionDto[] } = {};
selectedCardsMap: { [productId: number]: Set<number> } = {};

  constructor(private route: ActivatedRoute)
  {
     this.id = Number(this.route.snapshot.paramMap.get('id'));

     this.userName=localStorage.getItem('username');

  }


  ngOnInit(): void {
    this.GetCurrentTransaction();
    this.GetCurrentTransactionProducts();

  }
  ngOnDestroy(){
 this.transactionSubscription?.unsubscribe();
 this.CardSubscription?.unsubscribe();
 this.BranchSubscription?.unsubscribe();
  }

 GetCurrentTransaction()
 {
  this.transactionSubscription.add(this.transactionService.getTransactionById(this.id).subscribe({
    next:(res)=>{
      this.transactionDetails=res
      this.GetBranchDataByName(res.destination)
    },error:(err)=>{
         Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "can't load the Transaction Information ,please try again !",
              });
    }

  }))
 }
 GetCurrentTransactionProducts()
 {
  this.transactionService.GetTransactionProducts(this.id).subscribe({
    next:(res)=>{
      this.transactionProducts=res;
      console.log(res);

    },error:(err)=>{
       Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.message,
              });
    }
  })
 }
getSelectedCount(productId: number): number {
  return this.selectedCards.filter(c => c.productId === productId).length;
}
GetCards(SelectedProduct: ProductTransactionDto, page = 1, fromPagination = false) {

  // collapse logic
  if (!fromPagination && this.expandedCards[SelectedProduct.productId]) {
    this.expandedCards[SelectedProduct.productId] = null;
    return;
  }

  const searchVal = this.searchText[SelectedProduct.productId] || "";

  this.cardFilteration = {
    productId: SelectedProduct.productId,
    branchName: null,
    transactionId: this.id,
    page: page,
    pageSize: 10,
    maskedPan: searchVal
  };

  this.CardSubscription.add(
    this.CardService.getCardsFoTransaction(this.cardFilteration)
      .subscribe({
        next: (res) => {

          // Expand UI container
          this.expandedCards[SelectedProduct.productId] = {
            data: res.data,
            page: res.pageNumber,
            pageSize: res.pageSize,
            totalCount: res.totalCount
          };

          // ---------------------------------------
          // 🔥 Append loaded pages to the ALL-CARDS map
          // ---------------------------------------
          if (!this.allCardsMap[SelectedProduct.productId]) {
            this.allCardsMap[SelectedProduct.productId] = [];
          }

          // Avoid duplicates
          res.data.forEach(card => {
            if (!this.allCardsMap[SelectedProduct.productId]
               .some(c => c.id === card.id)) {
              this.allCardsMap[SelectedProduct.productId].push(card);
            }
          });

          // ---------------------------------------
          // 🔥 Restore pre-selected cards
          // ---------------------------------------
        const selected = this.selectedCardsMap[SelectedProduct.productId] ?? new Set();

const expanded = this.expandedCards[SelectedProduct.productId];
if (expanded) {
  expanded.data = res.data.map(c => ({
    ...c,
    isSelected: c.id !== null ? selected.has(c.id) : false
  }));
}

          if (expanded) {
  expanded.data = res.data.map(c => ({
    ...c,
    isSelected: c.id !== null ? selected.has(c.id) : false
  }));
}


        }
      })
  );
}


changePage(productId: number, step: number) {
  const current = this.expandedCards[productId];
  if (!current) return;

  const newPage = current.page + step;

  const product = this.transactionProducts.find(p => p.productId === productId);
  if (!product) return;

  this.GetCards(product, newPage, true);  // ← tells GetCards it's pagination
}


GetBranchDataByName(branchName:string|null)
{
  this.BranchSubscription.add(this.BranchService.getByBranchName(branchName).subscribe({
    next:(res)=>{
      this.DestenationBranchdata=res

    },
    error:(err)=>{
      console.log(err);

    }
  }))

}

toggleCardSelection(productId: number, card: CardTransactionDto,  event: Event) {
  const checked = (event.target as HTMLInputElement).checked;

  if (!this.selectedCardsMap[productId]) {
    this.selectedCardsMap[productId] = new Set();
  }

  if (checked) {
    this.selectedCardsMap[productId].add(card.id!);
  } else {
    this.selectedCardsMap[productId].delete(card.id!);
  }
}


// submitTransaction() {
//   if (!this.transactionDetails || !this.transactionProducts.length) {
//     Swal.fire({
//       icon: "error",
//       title: "Invalid Data",
//       text: "Transaction data not completed."
//     });
//     return;
//   }

//   if (!this.DestenationBranchdata) {
//     Swal.fire({
//       icon: "error",
//       title: "Wait!",
//       text: "Branch data is still loading..."
//     });
//     return;
//   }

//   // 🔹 Map all cards across products
//   let mappedCards: CardTransactionDto[] = [];

//   for (const productId in this.allCardsMap) {
//     const selectedSet: Set<number> = this.selectedCardsMap[productId] ?? new Set();

//     const cards = this.allCardsMap[productId].map(card => ({
//       ...card,
//       cardTransactionStatus: selectedSet.has(card.id!) ? 1 : 2, // 1 = accepted, 2 = returned
//       status: 0,
//       transactionId: this.id,
//       branchId: selectedSet.has(card.id!) ? this.DestenationBranchdata.id : card.branchId,
//       branchName: selectedSet.has(card.id!) ? this.DestenationBranchdata.branchName : card.branchName
//     }));

//     mappedCards.push(...cards);
//   }

//   // 🔹 Build payload
//   const requestBody: MakeTransactionDto = {
//     transaction: {
//       ...this.transactionDetails,
//       recivedDate: new Date().toISOString(),
//       recivedUser: this.userName
//     },
//     transactionProducts: this.transactionProducts,
//     transactionCards: mappedCards
//   };

//   console.log("Final Payload Sent:", requestBody);

//   // 🔹 Call service and handle response
//   this.transactionService.receiveTransaction(requestBody).subscribe({
//     next: () => {
//       Swal.fire({
//         icon: "success",
//         title: "Transaction Received",
//         text: "Operation completed successfully ✅"
//       });
//       this.router.navigate(['/approvedTransactions']);
//     },
//     error: (err) => {
//       Swal.fire({
//         icon: "error",
//         title: "Oops!",
//         text: err.error?.message || "Error while processing transaction."
//       });
//     }
//   });
// }
submitTransaction() {
  if (!this.transactionDetails || !this.transactionProducts.length) {
    Swal.fire({
      icon: "error",
      title: "Invalid Data",
      text: "Transaction data not completed."
    });
    return;
  }

  if (!this.DestenationBranchdata) {
    Swal.fire({
      icon: "error",
      title: "Wait!",
      text: "Branch data is still loading..."
    });
    return;
  }

  // 🔹 Map only selected cards
  let mappedCards: CardTransactionDto[] = [];

  for (const productId in this.selectedCardsMap) {
    const selectedSet: Set<number> = this.selectedCardsMap[productId];
    const allCardsForProduct = this.allCardsMap[productId] ?? [];

    allCardsForProduct.forEach(card => {
      if (selectedSet.has(card.id!)) {
        mappedCards.push({
          ...card,
          cardTransactionStatus: 1, // 1 = received
          status: 0,
          transactionId: this.id,
          branchId: this.DestenationBranchdata.id,
          branchName: this.DestenationBranchdata.branchName
        });
      }
    });
  }

  // 🔹 Build payload
  const requestBody: MakeTransactionDto = {
    transaction: {
      ...this.transactionDetails,
      recivedDate: new Date().toISOString(),
      recivedUser: this.userName
    },
    transactionProducts: this.transactionProducts,
    transactionCards: mappedCards // ← only selected cards
  };

  console.log("Final Payload Sent:", requestBody);

  // 🔹 Call service and handle response
  this.transactionService.receiveTransaction(requestBody).subscribe({
    next: () => {
      Swal.fire({
        icon: "success",
        title: "Transaction Received",
        text: "Operation completed successfully ✅"
      });
      this.router.navigate(['/approvedTransactions']);
    },
    error: (err) => {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: err.error?.message || "Error while processing transaction."
      });
    }
  });
}


isCardSelected(productId: number, card: CardTransactionDto): boolean {
  const selectedSet = this.selectedCardsMap[productId] ?? new Set();
  return card.id !== null && selectedSet.has(card.id);
}



}
