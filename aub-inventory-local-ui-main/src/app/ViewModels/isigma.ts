import { BranchVm } from "./branch-vm";
import { PrintConfiguration } from "./imachine-configs";
import { Product } from "./product-vm";

export interface isigmaInfo
{
 Ip:string;
 model:string;
LockState:string;
serialNumber:string;
status:string;
FeederStatus:string;

}

export interface PrintRequestForSigma
{
  PrinterName:string|null;
  CardHolderName :string;
  product :Product|undefined|null;
  UserName:string|null;
  branch:BranchVm;

}

