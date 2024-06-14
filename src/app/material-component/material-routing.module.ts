import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManagementProductComponent } from './management-product/management-product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';

const routes: Routes = [
  {
    path: 'category',
    component: ManageCategoryComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin']
    }
  },
  {
    path: 'product',
    component: ManagementProductComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin']
    }
  },
  {
    path: 'order',
    component: ManageOrderComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user']
    }
  },
  {
    path: 'bill',
    component: ViewBillComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user']
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule { }
