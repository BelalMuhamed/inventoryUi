import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardsService } from 'src/app/Services/Cards/cards.service';
import { TransactionService } from 'src/app/Services/TransactionServices/transaction.service';
import { CardTransactionDto, CardTransactionFilteration } from 'src/app/ViewModels/card-vm';
import { ProductTransactionDto, TransactionVm } from 'src/app/ViewModels/ItransactionVm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transaction-deatils',
  templateUrl: './transaction-deatils.component.html',
  styleUrls: ['./transaction-deatils.component.css']
})
export class TransactionDeatilsComponent {
id!: number;
CurrentTransaction!:TransactionVm;
blueCards: { [productId: number]: CardTransactionDto[] } = {};

  cardFilteration !:CardTransactionFilteration;
transactionProducts:ProductTransactionDto[]=[]
private transactionService = inject(TransactionService);
private transactionSubscription = new Subscription();
  expandedCards: { [productId: number]: CardTransactionDto[]|null } = {};

   private CardService = inject(CardsService);
  private CardSubscription = new Subscription();
constructor(private route: ActivatedRoute) {}
  ngOnInit(): void
{
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetCuurentTransaction();
    this.GetCurrentTransactionProducts();
}
  ngOnDestroy() : void
  {
    this.transactionSubscription?.unsubscribe();
    this.CardSubscription?.unsubscribe();
  }
  GetCuurentTransaction()
  {
    this.transactionSubscription.add(this.transactionService.getTransactionById(this.id).subscribe({
      next:(res)=>{
        this.CurrentTransaction=res;

      },
      error:(err)=>{
        console.log(err);

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

getTransactionProductStatusText(status: number): string {
  switch (status) {
    case 0: return 'Completed';
    case 1: return 'Shortage';
    case 2: return 'Excess';
    case 3: return 'In Progress';
    default: return 'Unknown';
  }
}

getTransactionProductStatusClass(status: number): string {
  switch (status) {
    case 0: return 'bg-success text-white'; // Completed
    case 1: return 'bg-danger text-white';  // Shortage
    case 2: return 'bg-warning text-dark';  // Excess
    case 3: return 'bg-info text-white';    // In Progress
    default: return 'bg-secondary text-white';
  }
}
// toggleCards(productId: number, cardLastSixDigits: string | null) {
//   if (this.expandedCards[productId]) {
//     this.expandedCards[productId] = null;
//   } else {
//     if (!cardLastSixDigits) {
//       this.expandedCards[productId] = [];
//       return;
//     }

//     const cards: CardTransactionDto[] = cardLastSixDigits
//       .split('|')
//       .map(c => {
//         const statusChar = c.slice(-1); // r أو n
//         const numberPart = c.slice(0, -1); // الرقم بدون الحرف
//         return {
//           maskedPan: '**********' + numberPart, // 10 نجوم قبل الرقم
//           cardTransactionStatus: statusChar === 'r' ? 0 : 1 // 0 = received, 1 = not received
//         } as CardTransactionDto;
//       });

//     this.expandedCards[productId] = cards;
//   }
// }
// toggleCards(productId: number, cardLastSixDigits: string | null) {

//   // لو مفتوحة اقفلها
//   if (this.expandedCards[productId]) {
//     this.expandedCards[productId] = null;
//     return;
//   }

//   // ✅ لو الترانزاكشن Status = 3 → نجيب الكروت من الـ API ونلونها أزرق
//   if (this.CurrentTransaction.transactionStatus === 3) {

//     if (!this.blueCards[productId]) {
//       this.loadBlueCardsForProduct(productId);
//     }

//     // بعد التحميل نعرضها
//     setTimeout(() => {
//       this.expandedCards[productId] = this.blueCards[productId] ?? [];
//     }, 200);

//     return;
//   }

//   // ✅ غير ذلك → تابع النظام القديم (cardLastSixDigits)
//   if (!cardLastSixDigits) {
//     this.expandedCards[productId] = [];
//     return;
//   }

//   const cards: CardTransactionDto[] = cardLastSixDigits
//     .split('|')
//     .map(c => {
//       const statusChar = c.slice(-1);
//       const numberPart = c.slice(0, -1);
//       return {
//         maskedPan: '**********' + numberPart,
//         cardTransactionStatus: statusChar === 'r' ? 0 : 1
//       } as CardTransactionDto;
//     });

//   this.expandedCards[productId] = cards;
// }
toggleCards(productId: number, cardLastSixDigits: string | null) {

  if (this.expandedCards[productId]) {
    this.expandedCards[productId] = null;
    return;
  }

  // ✅ لو الترانزاكشن Status = 3
  if (this.CurrentTransaction.transactionStatus === 3) {

    // لو الكروت محمّلة مسبقاً → اعرضها فوراً
    if (this.blueCards[productId]) {
      this.expandedCards[productId] = this.blueCards[productId];
      return;
    }

    // ✅ لو مش محمّلة → حمّلها وهتعرض تلقائي داخل الـ subscribe
    this.loadBlueCardsForProduct(productId);
    return;
  }

  // ✅ النظام القديم
  if (!cardLastSixDigits) {
    this.expandedCards[productId] = [];
    return;
  }

  const cards: CardTransactionDto[] = cardLastSixDigits
  .split('|')
  .map((c) => {
    const statusChar = c.slice(-1);
    const numberPart = c.slice(0, -1);
    return {
      id: null,
      maskedPan: '**********' + numberPart,
      branchName: null,
      status: null,
      batchId: null,
      branchId: null,
      transactionId: this.id,
      productId: productId,
      cardTransactionStatus: statusChar === 'r' ? 0 : 1
    } as CardTransactionDto;
  });


  this.expandedCards[productId] = cards;
}


getReceivedCount(cardLastSixDigits: string | null): number {
  if (!cardLastSixDigits) return 0;

  return cardLastSixDigits
    .split('|')
    .filter(c => c.endsWith('r')) // فقط الكروت المستلمة
    .length;
}
// loadBlueCardsForProduct(productId: number) {

//   const filter: CardTransactionFilteration = {
//     transactionId: this.id,
//     productId: productId,
//     branchName: null
//   };

//   this.CardSubscription.add(
//     this.CardService.getCardsFoTransaction(filter).subscribe({
//       next: (res) => {
//         this.blueCards[productId] = res;
//         console.log(res);

//       },
//       error: (err) => {
//         Swal.fire("Error", "Failed to load cards", "error");
//       }
//     })
//   );
// }
loadBlueCardsForProduct(productId: number) {

  const filter: CardTransactionFilteration = {
    transactionId: this.id,
    productId: productId,
    branchName: null,
    page:null,
    pageSize:null,
    maskedPan:null
  };

  this.CardSubscription.add(
    this.CardService.getCardsFoTransaction(filter).subscribe({
      next: (res) => {
        this.blueCards[productId] = res.data;

        // ✅ اعرض الكروت بمجرد وصولها
        this.expandedCards[productId] = res.data;
      },
      error: (err) => {
        Swal.fire("Error", "Failed to load cards", "error");
      }
    })
  );
}


}
