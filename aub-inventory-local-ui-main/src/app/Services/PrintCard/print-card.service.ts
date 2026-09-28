import { EjectCardReq, GetMachineInfoFromMachineReques, LoadCardReq, PrintRequest } from './../../ViewModels/imachine-configs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { Observable } from 'rxjs';
import { IMachineConfigs, PrintCardRequest } from 'src/app/ViewModels/imachine-configs';
import { PFULLSTATUS } from 'src/app/ViewModels/IPrinter';
import { PrintConfigForSpecificFaceReq, ProductPrintConfigVM } from 'src/app/ViewModels/ProductPrintConfigVM';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class PrintCardService {

  constructor(private http:HttpClient) { }
   baseLink = environment.baseLink;
   MachineServiceLink=environment.MachineServiceLink;

    GetPrinterInfo():Observable<PFULLSTATUS>
   {
    return this.http.get<PFULLSTATUS>(`${this.MachineServiceLink}Evolis/get-printer-info`)
   }
  ResetPrinter():Observable<any>
   {
    return this.http.get<any>(`${this.MachineServiceLink}Evolis/reset-printer`)
   }
    printCard(dto: PrintRequest): Observable<any> {
    return this.http.post(`${this.MachineServiceLink}Evolis/print-card-holder-name`, dto);
  }
}
