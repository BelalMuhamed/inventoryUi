import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class ExportEventFileService {
  private baseLink:string = environment.baseLink;

  constructor(private http:HttpClient) { }

  exportEventFile(exportedEventFile:any) :  Observable<HttpResponse<Blob>>
  {
    return this.http.post(this.baseLink + 'Export/ExportEventFile' , exportedEventFile, {observe: 'response',responseType: 'blob'});
  }

  getExportFilesForBranch(branchName:string) : Observable<any> {
    return this.http.get(this.baseLink + 'Export/GetExportFilesForBranch?branchName=' + branchName);
  }

  undoFile(uniqueName:string,branchName:string){
    return this.http.delete(this.baseLink + 'Export/UndoExportFile?branchName=' + branchName + '&uniqueName=' + uniqueName);
  }
}
