import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportEventFileService } from 'src/app/Services/Export/export-file.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-undo-exported-event-file',
  templateUrl: './undo-exported-event-file.component.html',
  styleUrls: ['./undo-exported-event-file.component.css']
})
export class UndoExportedEventFileComponent implements OnInit {
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['file name', 'branch name', 'event date', 'Action'];
  eventFiles: any;
  selectedBranch: string = '';
  constructor(private exportFileService: ExportEventFileService) {
    this.selectedBranch = localStorage.getItem('branchName')!;
  }
  ngOnInit(): void {
    this.getExportFilesForBranch();
  }

  getExportFilesForBranch() {

    this.exportFileService.getExportFilesForBranch(this.selectedBranch).subscribe({
      next: (data) => {
        this.eventFiles = data;
      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Something went wrong!,${error.message}`,
        });
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<any>(this.eventFiles);
        this.paginator.pageSize = 10;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  undoEventFile(fileName: string, branchName: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, undo the file!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.exportFileService.undoFile(fileName, branchName).subscribe({
          next: (data) => {
          },
          error: (error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Something went wrong!,${error.message}`,
            });
          },
          complete: () => {
            this.getExportFilesForBranch();
            Swal.fire({
              title: "Undo Completed!",
              text: "Your file has been undid.",
              icon: "success"
            });
          }
        });

      }
    });


  }

}
