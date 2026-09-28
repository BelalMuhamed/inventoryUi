import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { IAddedMachineConfigs, IMachineConfigs, IUpdatedMachineConfigs } from 'src/app/ViewModels/imachine-configs';
import { environment } from 'src/environments/environment.production';


@Injectable({
  providedIn: 'root'
})
export class MachinesConfigsService {

  constructor(private http :HttpClient) { }
    baseLink = environment.baseLink;
GetAllMachines():Observable<any>{
    return this.http.get(this.baseLink + 'MachineConfigrations/GetMachinesConfigs');
  }
  AddMachine(machine:IAddedMachineConfigs):Observable<any>
  {
    return this.http.post(this.baseLink + 'MachineConfigrations/machines/Add',machine,{
  responseType: 'text'
});
  }
UpdateMachineConfig(updatedMachine:IUpdatedMachineConfigs,ip :string|null):Observable<any>
{
  return this.http.put(this.baseLink+'MachineConfigrations/machine/edit/'+ip,updatedMachine,{
  responseType: 'text'
});
}
GetByIp(ip : string|null):Observable<any>
{
  return this.http.get(this.baseLink +'MachineConfigrations/machines/details/'+ip);
}
Delete(ip :string) :Observable<any>
{
  return this.http.delete(this.baseLink+'MachineConfigrations/MachinesConfigs/Delete/'+ip,{
  responseType: 'text'
});
}

GetByBranchName(branchName:string):Observable<any>
{
   return this.http.get(this.baseLink + 'MachineConfigrations/machinesAt', {
  params: { branchName: branchName ?? '' }
});
}

ToggleStatus(ip :string):Observable<any>
{
  return this.http.put(this.baseLink+'MachineConfigrations?ip=' + ip, null,{
  responseType: 'text'
});
}
}
