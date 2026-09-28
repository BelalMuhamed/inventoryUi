import { Component } from '@angular/core';
import { BatchService } from 'src/app/Services/Batch/batch.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-cards',
  templateUrl: './load-cards.component.html',
  styleUrls: ['./load-cards.component.css']
})
export class LoadCardsComponent {
  fileName:string = "";

  constructor(private batchService:BatchService,public loaderService:LoaderService) {
    
  }

  onFileSelected(event:any) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;
        const formData = new FormData();

        formData.append("file", file);

        this.batchService.uploadFile(formData).subscribe({
          next:(data:any) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: data.message,
              showConfirmButton: false,
              timer: 2000
            });
          },
          error:(error) => {
            console.log(error)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.error.message,
            });
          },
          complete:() => {
          }
        });
    }
}
}

