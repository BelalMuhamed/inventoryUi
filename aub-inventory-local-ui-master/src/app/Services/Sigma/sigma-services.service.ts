import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrintRequestForSigma } from 'src/app/ViewModels/isigma';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class SigmaServicesService {

    constructor(private http:HttpClient) { }
    MachineServiceLink=environment.MachineServiceLink;


     GetSigmaInfo( printerName:string|null):Observable<any>
    {

      return this.http.get(this.MachineServiceLink+`MachineData/SigmaInfo/${printerName}`);
    }
    restart(PrinterName :string|null):Observable<any>
    {
        return this.http.post(this.MachineServiceLink+"PrinterState/restart-Printer", JSON.stringify(PrinterName), {
    headers: { 'Content-Type': 'application/json' },responseType:'text'
  });
    }
      PrintFromSigma(_Req:PrintRequestForSigma ):Observable<any>
    {
      return this.http.post(this.MachineServiceLink+`Print/Print-Card-Holder-Name`,_Req);
    }
}
