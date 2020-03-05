import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PlantSelectionComponent } from './plant-selection/plant-selection.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { DashboardTableComponent } from './dashboard/dashboard-table/dashboard-table.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DashboardGraphComponent } from './dashboard/dashboard-graph/dashboard-graph.component';
import { CookieService } from "ngx-cookie-service";


const routeLists: Routes = [
  {path: "", component: LoginComponent},
  {path: "plantSelection/:user", component: PlantSelectionComponent},
  {path: "dashboard/:user/:plantName", component: DashboardComponent},
  {path: "**", component: LoginComponent}
 ]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlantSelectionComponent,
    DashboardComponent,
    DashboardTableComponent,
    DashboardGraphComponent   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routeLists),
    HttpClientModule,
    HttpModule,
    NgbModule.forRoot(),
    MyDatePickerModule,
    NgxMyDatePickerModule.forRoot()
   ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
