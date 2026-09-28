import { ChipResetClass } from './../Model/command.Classes/commandClasses';
import { BranchVm } from './branch-vm';
import { Product, ProductVM } from "./product-vm";

export interface IMachineConfigs {
  ip:         string;
  feederId:   number;
  hooperId:   number;
  rejectedId: number;
  port:       string;
  tipTemp:    number;
  tipPres:    number;
  tipCons:    number;
  tipTime:    number;
  model:      string;
  name:       string;
  sn:         string;
  branchName: string;
  MStatus:number|null;
}


export interface IAddedMachineConfigs {
  ip:         string;
  feederId:   number;
  hooperId:   number;
  rejectedId: number;
  port:       string;
  tipTemp:    number;
  tipPres:    number;
  tipCons:    number;
  tipTime:    number;
  model:      string;
  name:       string;
  sn:         string;
  branchId:   number;
}


export interface IUpdatedMachineConfigs {
  ip:         string;
  feederId:   number;
  hooperId:   number;
  rejectedId: number;
  port:       string;

  model:      string;
  name:       string;
  sn:         string;
}
export interface PrintConfiguration {
  printedItem: number|null|undefined;
  font: number|null|undefined;
  cpi: number|null|undefined;
  offSetX: number|null|undefined;
  offSetY: number|null|undefined;
}

export interface PrintCardRequest {
  cardHolderName: string;
  productId: number;
  username: string;
  branchid: number;
  machineConfigs: IMachineConfigs;
  printConfigs: PrintConfiguration;
}


export interface ResponseFromMachine {
  Answer:                string;
  Machine_Configuration: MachineConfigurationFromMachine;
  Machine_Status:        MachineStatusFromMachine;
}

export interface MachineConfigurationFromMachine {
  machine_model:     string;
  machine_name:      string;
  machine_sn:        string;
  number_of_feeders: string;
  card_exit:         string;
  card_reject:       string;
  card_counter:      string;
}

export interface MachineStatusFromMachine {
  machine_status:           string;
  card_inside:              string;
  cover_open:               string;
  error_message:            string;
  feeder_0_card_presence:   string;
  feeder_1_card_presence:   string;
  tipper_status:            string;
  tipper_temperature:       string;
  tipper_near_end:          string;
  tipper_end_ribbon:        string;
  rear_infiller_near_end:   string;
  rear_infiller_end_ribbon: string;
  top_infiller_near_end:    string;
  top_infiller_end_ribbon:  string;
}

export interface GetMachineInfoFromMachineReques
{
  Ip:string;
  Port:string;
}
export interface EjectCardReq
{
  Ip:string;
  Port:string;
  HooperId:number;
}
export interface LoadCardReq
{
  Ip:string;
  Port:string;
  FeederId:number;
}


// export interface PrintRequest
// {
//    ip:string;
//   port:string;
//   feederId:number;
//   hooperId:number;
//   cardHolderName :string;
//   product :Product|undefined|null;
//   printConfiguration:PrintConfiguration|null;
//   userName:string|null;
//   branch:BranchVm|null;
//   token:string|null;

// }

export interface PrintRequest
{
    cardHolderName: string;
  machineIp: string;
  userName: string;
  productName: string|undefined|null;
  token: string|null;
  branchName: string|null;
  printedFace: number;

}
