import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BranchProductsDto, BranchRequestDto } from 'src/app/Model/BranchRequest/IBranchRequest';
import { CardsService } from 'src/app/Services/Cards/cards.service';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import { StockService } from 'src/app/Services/Stock/stock.service';
import { TransactionService } from 'src/app/Services/TransactionServices/transaction.service';
import { CardTransactionDto, CardTransactionFilteration } from 'src/app/ViewModels/card-vm';
import { MakeTransactionDto,  ProductTransactionDto, TransactionVm } from 'src/app/ViewModels/ItransactionVm';
import { StockReadVM } from 'src/app/ViewModels/stock-read-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-handle-up-coming-requests',
  templateUrl: './handle-up-coming-requests.component.html',
  styleUrls: ['./handle-up-coming-requests.component.css']
})
export class HandleUpComingRequestsComponent {
  id!: number;
  branchName!:string|null;
  expandedCards: { [productId: number]: CardTransactionDto[]|null } = {};
  selectedCards: CardTransactionDto[] = [];
isViewMode: boolean = false; // default: edit mode

  cardFilteration !:CardTransactionFilteration;
  private StockCardService = inject(StockService);
  private StockCardSubscription = new Subscription();
  private RequestCardService = inject(RequestCardsService);
  private RequestCardSubscription = new Subscription();
   private CardService = inject(CardsService);
  private CardSubscription = new Subscription();
  private transactionService = inject(TransactionService);
  private transactionSubscription = new Subscription();
  private router = inject(Router);

  userName:string|null=null;
   cardCenterStock!: StockReadVM;
   RequestProducts:BranchProductsDto[]=[];
   request!:BranchRequestDto;
  constructor(private route: ActivatedRoute)
  {
     this.id = Number(this.route.snapshot.paramMap.get('id'));
     this.branchName=localStorage.getItem('branchName');
     this.userName=localStorage.getItem('username');

  }

  ngOnInit(): void {
    this.GetBranchStock();
    this.GetRequestDetails();
    this.GetCurrentReuest();

  }
  ngOnDestroy(){
  this.StockCardSubscription?.unsubscribe();
  this.CardSubscription?.unsubscribe();
  this.transactionSubscription?.unsubscribe();
  }
  GetBranchStock()
  {
    this.StockCardSubscription.add(this.StockCardService.GetBranchStock(this.branchName).subscribe({
      next:(res)=>{
        this.cardCenterStock=res;

      },
      error:(err)=>{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "can't load the crad center stock ,please try again !",
        });
      }
    }))
  }
  GetRequestDetails()
  {
    this.RequestCardSubscription.add(this.RequestCardService.getProductsInRequest(this.id).subscribe({
      next:(res)=>{
          this.RequestProducts= res;

      },
      error:(err)=>{
         Swal.fire({
            icon: 'error',
            title: 'error!',
            text: 'connection error please try again !',
            confirmButtonColor: '#aa0d1dff'
          });
      }
    }))
  }
  GetCards(SelectedProduct: BranchProductsDto) {

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
    branchName: this.branchName ?? "",
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

  GetCurrentReuest()
  {
    this.RequestCardService.getRequestById(this.id).subscribe({
      next:(res)=>{
        this.request=res
      this.isViewMode = this.request?.transactionStatus !== 2;


      },
      error:(err)=>{
          Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text:  `Something went wrong cann't load request data ! `,
});

      }
    })
  }
getSelectedCount(productId: number): number {
  return this.selectedCards.filter(c => c.productId === productId).length;
}

  toggleCardSelection(card: CardTransactionDto, event: any) {
  if (event.target.checked) {
    this.selectedCards.push(card);
  } else {
    this.selectedCards = this.selectedCards.filter(c => c.id !== card.id);
  }
}

SubmitTransaction() {

  if (this.selectedCards.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'No Cards Selected',
      text: 'Please select at least one card.',
    });
    return;
  }

  // ✅ Get only products that have selected cards
  const productIdsWithSelectedCards = [
    ...new Set(this.selectedCards.map(c => c.productId))
  ];

  // ✅ Filter request products → only include ones that have selected cards
  const filteredProducts = this.RequestProducts.filter(p =>
    productIdsWithSelectedCards.includes(p.productId)
  );

  // ✅ Build ProductTransactionDto[]
  const products: ProductTransactionDto[] = filteredProducts.map(p => ({
    transactionId: null,
    productId: p.productId,
    productName:null,
    quantity: p.askedQuantity,
    productTransactionStatus: 3,
    cardLastSixDigits:null
  }));

  // ✅ Build CardTransactionDto[]
  const cards: CardTransactionDto[] = this.selectedCards.map(card => ({
    ...card,
    transactionId: null,
    status:4,
    cardTransactionStatus: 0
  }));

  // ✅ Build TransactionVm
  const transaction: TransactionVm = {
    id: 0,
    source: this.branchName,
    destination:this.request.destination ,
    requestDate: this.request.requestDate,
    recivedDate: null,
    acceptDeclinedDate: new Date().toISOString(),
    transactionStatus: 3,
    askingTransactionUser: this.request.askingTransactionUser,
    recivedUser:null ,
    acceptRequestUser: this.userName
  };

  // ✅ Final payload for API
  const payload: MakeTransactionDto = {
    transaction,
    transactionProducts: products,
    transactionCards: cards
  };
  this.transactionSubscription.add(this.transactionService.addNewTransaction(payload).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Transaction added successfully.',
      });
      this.onRejectRequest(this.request);
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.error?.message || 'Something went wrong!',
      });
    }
  }))

}
 onRejectRequest(item: BranchRequestDto) {
  const RejectedTransaction :BranchRequestDto={


  id: item.id,
  destination: item.destination,
  requestDate: item.requestDate,
  acceptDeclinedDate: (new Date()).toISOString(),
  transactionStatus: 0,
  askingTransactionUser: item.askingTransactionUser,
  acceptRequestUser:localStorage.getItem("username")

  }

      this.RequestCardService.updateTransaction(item.id,RejectedTransaction).subscribe({
        next:()=>{
          Swal.fire({
              icon: 'success',
              title: 'success!',
              text: 'The request status updated successfully.',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
  this.router.navigate(['/upcomingRequests']);
});

        },
        error:(err)=>{

          Swal.fire({
               icon: 'error',
               title: 'Error',
               text: err?.message || 'Failed to update request status  byt transaction added !'
             });

        }
      })

  }
  // Check if all cards for a product are selected
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

}


