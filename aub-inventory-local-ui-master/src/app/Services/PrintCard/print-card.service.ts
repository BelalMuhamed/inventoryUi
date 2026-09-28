import { EjectCardReq, GetMachineInfoFromMachineReques, LoadCardReq, PrintRequest } from './../../ViewModels/imachine-configs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { IMachineConfigs, PrintCardRequest } from 'src/app/ViewModels/imachine-configs';
import { PrintConfigForSpecificFaceReq, ProductPrintConfigVM } from 'src/app/ViewModels/ProductPrintConfigVM';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class PrintCardService {

  constructor(private http:HttpClient) { }
   baseLink = environment.baseLink;
   MachineServiceLink=environment.MachineServiceLink;





GetMachineInfoFromMachien(req:GetMachineInfoFromMachineReques): Observable<any>
{
  return this.http.post(this.MachineServiceLink+'machine/get-machine-info',req);
}

ResetMachine(req:GetMachineInfoFromMachineReques): Observable<any>
{
  return this.http.post(this.MachineServiceLink+'machine/reset-machine',req);
}

EjectCard(req :EjectCardReq): Observable<any>
{
  return this.http.post(this.MachineServiceLink+'machine/Eject-card',req);

}
PrintCardHolderName(req:PrintRequest):Observable<any>
{
  return this.http.post(this.MachineServiceLink+'machine/Print-Card-Holder-Name',req)
}


}
