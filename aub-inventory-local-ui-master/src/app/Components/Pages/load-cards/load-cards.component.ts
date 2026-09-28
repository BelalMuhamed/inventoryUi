import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private batchService:BatchService,public loaderService:LoaderService, private router: Router) {

  }

//   onFileSelected(event:any) {

//     const file:File = event.target.files[0];

//     if (file) {

//         this.fileName = file.name;
//         const formData = new FormData();

//         formData.append("file", file);

//         this.batchService.uploadFile(formData).subscribe({
//           next:(data:any) => {
//             Swal.fire({
//               position: "center",
//               icon: "success",
//               title: data.message,
//               showConfirmButton: false,
//               timer: 2000
//             });
//           },
//           error:(error) => {
//             console.log(error)
//             Swal.fire({
//               icon: "error",
//               title: "Oops...",
//               text: error.error.message,
//             });
//           },
//           complete:() => {
//           }
//         });
//     }
// }
isUploading = false;
@ViewChild('fileInput') fileInput!: ElementRef;

onFileSelected(event: any) {
  if (this.isUploading) return;

  const file: File = event.target.files[0];
  if (!file) return;

  this.isUploading = true;

  const formData = new FormData();
  formData.append("file", file);

  this.batchService.uploadFile(formData).subscribe({
    next: async (data: any) => {
      const result = await Swal.fire({
        icon: "success",
        title: data.message,
        confirmButtonText: "OK"
      });

      if (result.isConfirmed) {
        this.reloadComponent();
      }
    },
    error: async (error) => {
      const result = await Swal.fire({
        icon: "error",
        text: error.error.message,
        confirmButtonText: "OK"
      });

      if (result.isConfirmed) {
        this.reloadComponent();
      }
    },
    complete: () => {
      this.isUploading = false;

      // reset input
      this.fileInput.nativeElement.value = null;
      event.target.value = null;
    }
  });
}
reloadComponent() {
  const currentUrl = this.router.url;

  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigateByUrl(currentUrl);
  });
}
}

