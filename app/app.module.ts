import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ButtonModule}  from 'primeng/button';
import { LoginComponent } from './Components/LoginComponent/login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './Components/registration/registration/registration.component';
import { WarehouseComponent } from './Components/Admin/warehouse/warehouse.component';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield'; 
import { InputIconModule } from 'primeng/inputicon'; 
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { AuthInterceptorService } from './service/auth-interceptor.service';
import { DialogModule } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { RemovedProductsComponent } from './Components/Removed_Products/removed-products/removed-products.component';
import { ProductsManagementComponent } from './Components/ProductsManagement/products-management/products-management.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { SpeedDialModule } from 'primeng/speeddial';
import { FloatLabelModule } from 'primeng/floatlabel';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    WarehouseComponent,
    RemovedProductsComponent,
    ProductsManagementComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    DropdownModule,
    CommonModule,
    PanelModule,
  PanelMenuModule,
    InputNumberModule,
    DialogModule,
    SpeedDialModule,
    FloatLabelModule,
  
  ],
  providers: [
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
