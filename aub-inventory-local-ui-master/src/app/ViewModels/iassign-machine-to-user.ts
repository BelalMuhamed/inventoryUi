export interface IassignMachineToUser {
  userName:  string;
  machineIp: string;
  machineName:string;
  BranchName:string|null
}

export interface IassignMachineToUserRequest {
  userName:  string;
  machineIp: string;
}
