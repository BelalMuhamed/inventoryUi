import { Component, Input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IUserModel } from 'src/app/Model/Users/iuser-model';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { EventImportFileService } from 'src/app/Services/EventImportFile/event-import-file.service';
import { ExportEventFileService } from 'src/app/Services/Export/export-file.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-import-file',
  templateUrl: './event-import-file.component.html',
  styleUrls: ['./event-import-file.component.css']
})
export class EventImportFileComponent {

  constructor(private exportFileService:ExportEventFileService,private authService: AuthService, private importFileService: EventImportFileService) { }


  onFileSelected(event: any) {

    console.log(event);
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      console.log(file);

      formData.append("file", file);

      this.importFileService.uploadFile(formData).subscribe({
        next: (data: any) => { },
        error: (err) => {
          console.log(err);
          const error = err.error;
          if (error?.file != null) {
            this.enterCredentialsAlert(error.message, error.file);
            return;
          }
          if(error?.noRecordsFile !=null){
            this.NoRecordsFileDialog(error?.line);
          }
          Swal.fire({
            icon: "error",
            title: "Something Went Wrong",
            text: error.message || error,
          });
        },
        complete: () => {
          Swal.fire({
            icon: "success",
            timer: 2000,
            showConfirmButton:false,
            title: "Cards Setteled Successfully"
          })
        }
      });
    }
    event.target.value = '';
  }

  enterCredentialsAlert(message: string, file: any) {
    return Swal.fire({
      title: message,
      text: 'Please provide Card Center Admin Username and Password.',
      icon: 'error',
      html: `
        <input id="swal-input-username" class="swal2-input" placeholder="Username" type="text">
        <input id="swal-input-password" class="swal2-input" placeholder="Password" type="password">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      preConfirm: () => {
        const username = (<HTMLInputElement>document.getElementById('swal-input-username')).value;
        const password = (<HTMLInputElement>document.getElementById('swal-input-password')).value;;

        if (!username || !password) {
          Swal.showValidationMessage('Please enter both username and password.');
          return false; // Prevent closing the alert
        }

        return { username, password }; // Pass the input values to the result
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { username, password } = result.value;
        //Call Auth API
        const isSuccess:Boolean = await this.authenticateUser(username,password);
        if(isSuccess)
          this.forceSettleCards(file);
      }
    });
  }
  async authenticateUser(username: string, password: string): Promise<Boolean> {
    try {
      const data: any = await firstValueFrom(this.authService.validateCardCenterAdmin(username, password));
      return true;
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.message || err.error,
      })
      return false;
    }
  }
  forceSettleCards(file: any) {
    const fileConverted = this.ConvertFileContent(file);
    const formData = new FormData();
    formData.append('file', fileConverted);

    this.importFileService.forceSettleCards(formData).subscribe({
      next: (data: any) => { },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong',
          text: err.error.message || err.error,
        })
      },
      complete: () => {
        Swal.fire({
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          title: "Cards Setteled Successfully"
        })
      }
    })
  }
  NoRecordsFileDialog(firstLine:string){
    return Swal.fire({
      title: "Are you sure?",
      text: "This file has no records, Do you want to remove hold amount for this file",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove hold"
    }).then((result) => {
      if (result.isConfirmed) {
        const [branchName,fileId] = firstLine.split("|");
        this.exportFileService.undoFile(fileId,branchName).subscribe({
          next:(data:any)=>{},
          error:(err)=>{
            Swal.fire({
              icon: 'error',
              title: 'Something Went Wrong',
              text: err.error.message || err.error,
            })
          },
          complete:()=>{
            Swal.fire({
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
              title: "Remove Hold is Done Successfully"
            })
          }
        })
      }
    });
  }
  ConvertFileContent(file: any): File {
    const base64String = file.fileContent;
    const fileName = file.fileName;

    // Decode the base64 string (remove prefix if present)
    const base64Data = base64String.split(',')[1] || base64String;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const fileConverted = new File([blob], fileName, { type: 'application/octet-stream' });
    return fileConverted;
  }
}

