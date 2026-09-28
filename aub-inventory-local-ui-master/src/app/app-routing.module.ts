import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigrationComponent } from './Components/Pages/configration/configration.component';
import { BranchComponent } from './Components/Pages/configration/branch/branch.component';
import { GroupNamesComponent } from './Components/Pages/configration/group-names/group-names.component';
import { LoadCardsComponent } from './Components/Pages/load-cards/load-cards.component';
import { RequestCardComponent } from './Components/Pages/request-card/request-card.component';
import { DistributeCardsComponent } from './Components/Pages/distribute-cards/distribute-cards.component';
import { ReportComponent } from './Components/Pages/report/report.component';
import { DestroyCardComponent } from './Components/Pages/destroy-card/destroy-card.component';
import { LoginComponent } from './Components/Pages/login/login.component';
import { TransferComponent } from './Components/Pages/transfer/transfer.component';
import { authGuard } from './Gaurds/auth.guard';
import { isSignedInGuard } from './Gaurds/is-signed-in.guard';
import { NotFoundComponent } from './Components/Pages/not-found/not-found.component';
import { UnauthorizedComponent } from './Components/Pages/unauthorized/unauthorized.component';
import { roleGuard } from './Gaurds/role.guard';
import { isBranchAdminGuard } from './Gaurds/is-branch-admin.guard';
import { isCCAdminGuard } from './Gaurds/is-ccadmin.guard';
import { isITAdminGuard } from './Gaurds/is-itadmin.guard';
import { BranchRequestsComponent } from './Components/Pages/branch-requests/branch-requests.component';
import { UpcomingRequestsComponent } from './Components/Pages/upcoming-requests/upcoming-requests.component';
import { BranchTransactionsComponent } from './Components/Pages/branch-transactions/branch-transactions.component';
import { ApprovedTransactionsComponent } from './Components/Pages/approved-transactions/approved-transactions.component';
import { ProductComponent } from './Components/Pages/configration/product/product.component';
import { UserComponent } from './Components/Pages/user/user.component';
import { ExportImportComponent } from './Components/Event/Export/export-event-file.component';
import { UndoExportedEventFileComponent } from './Components/Event/Undo/undo-exported-event-file.component';
import { StockOfBranchComponent } from './Components/Pages/stock-of-branch/stock-of-branch.component';
import { EventHomeComponent } from './Components/Event/event-home/event-home.component';
import { EventImportFileComponent } from './Components/Event/event-import-file/event-import-file.component';
import { MachineConfigsComponent } from './Components/Pages/machine-configs/machine-configs.component';
import { AddMachineComponent } from './Components/Pages/add-machine/add-machine.component';
import { EditMachineConfigComponent } from './Components/Pages/edit-machine-config/edit-machine-config.component';
import { MachineDetailsComponent } from './Components/Pages/machine-details/machine-details.component';
import { PrintCardHolderNameComponent } from './Components/Pages/print-card-holder-name/print-card-holder-name.component';
import { isUserGuard } from './Gaurds/is-user.guard';
import { MachineConfigurationMenuComponent } from './Components/Pages/machine-configuration-menu/machine-configuration-menu.component';
import { AssignMachineToUserComponent } from './Components/Pages/assign-machine-to-user/assign-machine-to-user.component';
import { AddMachineToUserComponent } from './Components/Pages/add-machine-to-user/add-machine-to-user.component';
import { UserMenuComponent } from './Components/Pages/user-menu/user-menu.component';
import { EditPrintConfigComponent } from './Components/Pages/edit-print-config/edit-print-config.component';
import { isLogedGuard } from './Gaurds/is-loged.guard';
import { PrintCardHolderNameFromSigmaComponent } from './Components/Pages/print-card-holder-name-from-sigma/print-card-holder-name-from-sigma.component';
import { PieChartComponent } from '@swimlane/ngx-charts';
import { CCDashBoardComponent } from './Components/Pages/ccdash-board/ccdash-board.component';

const routes: Routes = [
  { path:'' , component:LoginComponent , pathMatch:'full' , canActivate:[isLogedGuard] },//isSignedInGuard
  // { path:'AUB-Bank' , component:AUBBankComponent  , canActivate:[authGuard] },
  // { path:'add-product-branch' , component:AUBProductBranchComponent  , canActivate:[authGuard] },
  // { path:'print' , component:PrintComponent  , canActivate:[authGuard] },
  { path:'configration' , component:ConfigrationComponent  , canActivate:[authGuard,isITAdminGuard] },
  { path:'Branch' , component:BranchComponent  , canActivate:[authGuard,isITAdminGuard] },
  // { path:'Product' , component:ProductComponent  , canActivate:[authGuard] },
  { path:'Group' , component:GroupNamesComponent  , canActivate:[authGuard,isITAdminGuard] },
  { path:'Products' , component:ProductComponent  , canActivate:[authGuard,isITAdminGuard] },
  { path:'load' , component:LoadCardsComponent  , canActivate:[authGuard,isCCAdminGuard] },
  { path:'request' , component:RequestCardComponent  , canActivate:[authGuard,isBranchAdminGuard] },
  { path:'distribute' , component:DistributeCardsComponent  , canActivate:[authGuard,isCCAdminGuard] },
  { path:'report' , component:ReportComponent  , canActivate:[authGuard,roleGuard] },
  { path:'destroy' , component:DestroyCardComponent  , canActivate:[authGuard,isBranchAdminGuard] },
  { path:'transfer' , component:TransferComponent  , canActivate:[authGuard,isCCAdminGuard] },
  { path:'login' , component:LoginComponent,canActivate:[isLogedGuard]},
  { path:'access-denied' , component:UnauthorizedComponent },
  { path:'upcomingRequests' , component:UpcomingRequestsComponent, canActivate:[authGuard,isCCAdminGuard] },
  { path:'branchRequests' , component:BranchRequestsComponent , canActivate:[authGuard,isBranchAdminGuard]},
  { path:'branchTransactions' , component:BranchTransactionsComponent ,  canActivate:[authGuard,isBranchAdminGuard]},
  { path:'approvedTransactions' , component:ApprovedTransactionsComponent ,  canActivate:[authGuard,isCCAdminGuard]},
  {path: 'ManageUsers',component:UserComponent,canActivate:[authGuard,isITAdminGuard]},
  {path: 'Export',component:ExportImportComponent},
  {path: 'Undo-Exported-File',component:UndoExportedEventFileComponent},
  // {path: 'Stock-Of-Branch',component:StockOfBranchComponent},
  // {path: 'event',component:EventHomeComponent},
  {path: 'Import',component:EventImportFileComponent, canActivate:[authGuard,isBranchAdminGuard] },
  {path: 'machines',component:MachineConfigsComponent, canActivate:[authGuard,isITAdminGuard]},
  {path: 'add-machine-config',component:AddMachineComponent, canActivate:[authGuard,isITAdminGuard]},
  {path: 'edit-machine-config/:ip',component:EditMachineConfigComponent, canActivate:[authGuard,isITAdminGuard]},
  {path: 'machine-config-details/:ip',component:MachineDetailsComponent, canActivate:[authGuard,isITAdminGuard]},
  {path: 'machine-config-menu',component:MachineConfigurationMenuComponent, canActivate:[authGuard,isITAdminGuard]},
  {path: 'assigned-machine-to-user',component:AssignMachineToUserComponent, canActivate:[authGuard,isITAdminGuard]},
  {path: 'add-machine-to-user',component:AddMachineToUserComponent, canActivate:[authGuard,isITAdminGuard]},
  {path: 'Edit-Print-Config',component:EditPrintConfigComponent, canActivate:[authGuard,isITAdminGuard]},
  {path: 'User-Menu',component:UserMenuComponent,canActivate:[authGuard,isUserGuard]},
  {path: 'print-card-holder-name-sigma',component:PrintCardHolderNameFromSigmaComponent, canActivate:[authGuard,isUserGuard]},

  {path: 'print-card-holder-name/:userName',component:PrintCardHolderNameComponent, canActivate:[authGuard,isUserGuard]},
  {path: 'DashBoard',component:CCDashBoardComponent, canActivate:[authGuard,roleGuard]},

  { path:'**' , component:NotFoundComponent  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
