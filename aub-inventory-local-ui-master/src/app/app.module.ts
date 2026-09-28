import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AUBBankComponent } from './Components/Pages/aub-bank/aub-bank.component';
import { AUBProductBranchComponent } from './Components/Pages/aub-bank/aub-product-branch/aub-product-branch.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrintComponent } from './Components/Pages/print/print.component';
import { ConfigrationComponent } from './Components/Pages/configration/configration.component';
import { NavbarComponent } from './Components/Pages/navbar/navbar.component';
import { BranchComponent } from './Components/Pages/configration/branch/branch.component';
import { ProductComponent } from './Components/Pages/configration/product/product.component';
import { LoadCardsComponent } from './Components/Pages/load-cards/load-cards.component';
import { RequestCardComponent } from './Components/Pages/request-card/request-card.component';
import { DistributeCardsComponent } from './Components/Pages/distribute-cards/distribute-cards.component';
import { DestroyCardComponent } from './Components/Pages/destroy-card/destroy-card.component';
import { ReportComponent } from './Components/Pages/report/report.component';
import { LoginComponent } from './Components/Pages/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from  '@angular/common/http';
import { TransferComponent } from './Components/Pages/transfer/transfer.component';
import { GroupNamesComponent } from './Components/Pages/configration/group-names/group-names.component';
import { AuthenticationInterceptor } from './Interceptors/authentication.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import { CardsReportComponent } from './Components/Pages/report/cards-report/cards-report.component';
import { TransactionsReportComponent } from './Components/Pages/report/transactions-report/transactions-report.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NotFoundComponent } from './Components/Pages/not-found/not-found.component';
import { UnauthorizedComponent } from './Components/Pages/unauthorized/unauthorized.component';
import { UpcomingRequestsComponent } from './Components/Pages/upcoming-requests/upcoming-requests.component'
import { BranchRequestsComponent } from './Components/Pages/branch-requests/branch-requests.component';
import { BranchTransactionsComponent } from './Components/Pages/branch-transactions/branch-transactions.component';
import { ApproveRequestModalComponent } from './Components/Pages/upcoming-requests/approve-request-modal/approve-request-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StockReportComponent } from './Components/Pages/report/stock-report/stock-report.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoaderService } from './Services/loader/loader.service';
import { InterceptorService } from './Services/loader/interceptor.service';
import { ApprovedTransactionsComponent } from './Components/Pages/approved-transactions/approved-transactions.component';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { FooterComponent } from './Components/Pages/footer/footer.component';
import { PerformanceComponent } from './Components/Pages/report/performance/performance.component';
import { UserComponent } from './Components/Pages/user/user.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { EditUserComponent } from './Components/Pages/user/edit-user/edit-user.component';
import { MatCardModule } from '@angular/material/card';
import { AddUserComponent } from './Components/Pages/user/add-user/add-user.component';
import { ExportImportComponent } from './Components/Event/Export/export-event-file.component';
import { UndoExportedEventFileComponent } from './Components/Event/Undo/undo-exported-event-file.component';
import { StockOfBranchComponent } from './Components/Pages/stock-of-branch/stock-of-branch.component';
import { EventHomeComponent } from './Components/Event/event-home/event-home.component';
import { EventImportFileComponent } from './Components/Event/event-import-file/event-import-file.component';
import { MachineConfigsComponent } from './Components/Pages/machine-configs/machine-configs.component';
import { SearchPipe } from './pipes/search.pipe';
import { AddMachineComponent } from './Components/Pages/add-machine/add-machine.component';
import { EditMachineConfigComponent } from './Components/Pages/edit-machine-config/edit-machine-config.component';
import { MachineDetailsComponent } from './Components/Pages/machine-details/machine-details.component';
import { PrintCardHolderNameComponent } from './Components/Pages/print-card-holder-name/print-card-holder-name.component';
import { MachineConfigurationMenuComponent } from './Components/Pages/machine-configuration-menu/machine-configuration-menu.component';
import { AssignMachineToUserComponent } from './Components/Pages/assign-machine-to-user/assign-machine-to-user.component';
import { EditUserMachineComponent } from './Components/Pages/edit-user-machine/edit-user-machine.component';
import { MatSelectModule } from '@angular/material/select';
import { AddMachineToUserComponent } from './Components/Pages/add-machine-to-user/add-machine-to-user.component';
import { AddMachineToUserPopupComponent } from './Components/Pages/add-machine-to-user-popup/add-machine-to-user-popup.component';
import { UserMenuComponent } from './Components/Pages/user-menu/user-menu.component';
import { EditPrintConfigComponent } from './Components/Pages/edit-print-config/edit-print-config.component';
import { PrintCardHolderNameFromSigmaComponent } from './Components/Pages/print-card-holder-name-from-sigma/print-card-holder-name-from-sigma.component';
import { provideNgxMask } from 'ngx-mask';
import { NgChartsModule } from 'ng2-charts';
import { CCDashBoardComponent } from './Components/Pages/ccdash-board/ccdash-board.component';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { AddPrintConfigForProductPopupComponent } from './Components/Pages/add-print-config-for-product-popup/add-print-config-for-product-popup.component';
import { EditPrintConfigPopupForSpecificProductComponent } from './Components/edit-print-config-popup-for-specific-product/edit-print-config-popup-for-specific-product.component';
Chart.register(ChartDataLabels);


@NgModule({
  declarations: [
    AppComponent,
    AUBBankComponent,
    AUBProductBranchComponent,
    PrintComponent,
    ConfigrationComponent,
    NavbarComponent,
    BranchComponent,
    ProductComponent,
    LoadCardsComponent,
    RequestCardComponent,
    DistributeCardsComponent,
    DestroyCardComponent,
    ReportComponent,
    LoginComponent,
    TransferComponent,
    GroupNamesComponent,
    CardsReportComponent,
    TransactionsReportComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    UpcomingRequestsComponent,
    BranchRequestsComponent,
    BranchTransactionsComponent,
    ApproveRequestModalComponent,
    CardsReportComponent,
    ReportComponent,
    TransactionsReportComponent,
    StockReportComponent,
    ApprovedTransactionsComponent,
    FooterComponent,
    PerformanceComponent,
    UserComponent,
    EditUserComponent,
    AddUserComponent,
    ExportImportComponent,
    UndoExportedEventFileComponent,
    StockOfBranchComponent,
    EventHomeComponent,
    EventImportFileComponent,
    MachineConfigsComponent,
    SearchPipe,
    AddMachineComponent,
    EditMachineConfigComponent,
    MachineDetailsComponent,
    PrintCardHolderNameComponent,
    MachineConfigurationMenuComponent,
    AssignMachineToUserComponent,
    EditUserMachineComponent,
    AddMachineToUserComponent,
    AddMachineToUserPopupComponent,
    UserMenuComponent,
    EditPrintConfigComponent,
    PrintCardHolderNameFromSigmaComponent,
    CCDashBoardComponent,
    AddPrintConfigForProductPopupComponent,
    EditPrintConfigPopupForSpecificProductComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    NgChartsModule,
    NgbModule,
    MatIconModule,

  ],
  providers: [provideNgxMask(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    DatePipe,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:InterceptorService,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
