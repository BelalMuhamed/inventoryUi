import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BranchProductsDto } from 'src/app/Model/BranchRequest/IBranchRequest';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch-repuest-details-popup',
  templateUrl: './branch-repuest-details-popup.component.html',
  styleUrls: ['./branch-repuest-details-popup.component.css']
})
export class BranchRepuestDetailsPopupComponent {
  productsDetailsPerRequest:BranchProductsDto[]=[];
constructor(private requestCardService:RequestCardsService,
    public dialogRef: MatDialogRef<BranchRepuestDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.requestCardService.getProductsInRequest(data.id).subscribe({
    next:(res)=>{
        this.productsDetailsPerRequest=res;
        console.log(res);


    }      ,
    error:(err)=>{
       Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load Request Details check your server connection!',
        confirmButtonColor: '#d33'
        });
    }
    })
  }
  getStatusName(status: number): string {
  switch (status) {
    case 0: return 'Accepted';
    case 1: return 'Declined';
    case 2: return 'Pending';
    default: return 'Unknown';
  }
}

}
