import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialRoutingModule } from './material-routing.module';
import { ViewBillProductComponent } from './dialog/view-bill-product/view-bill-product.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { CategoryComponent } from './dialog/category/category.component';
import { ManagementProductComponent } from './management-product/management-product.component';
import { ProductComponent } from './dialog/product/product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';


@NgModule({
  declarations: [
    ViewBillProductComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    ManageCategoryComponent,
    CategoryComponent,
    ManagementProductComponent,
    ProductComponent,
    ManageOrderComponent
  ],
  imports: [
    CommonModule,
    MaterialRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    SharedModule

  ],
  providers: []
})
export class MaterialModule { }
