import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from '../app/Components/LoginComponent/login/login.component';
import { RegistrationComponent } from './Components/registration/registration/registration.component';
import { WarehouseComponent } from './Components/Admin/warehouse/warehouse.component';

import { RemovedProductsComponent } from './Components/Removed_Products/removed-products/removed-products.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegistrationComponent},
  {path:'removedproduct', component:RemovedProductsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
