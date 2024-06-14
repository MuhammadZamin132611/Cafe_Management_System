import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constant';
import { ViewBillProductComponent } from '../dialog/view-bill-product/view-bill-product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumn: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource: any;
  responsiveMessage: any;

  constructor(
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();

  }

  tableData = () => {
    this.billService.getBills().subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
      }, error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.messgae) {
          this.responsiveMessage = error.error?.messgae;
        }
        else {
          this.responsiveMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responsiveMessage, GlobalConstants.error);
      }
    });
  }

  applyFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  haldelViewAction = (values: any) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values
    };
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewBillProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }


  downloadReportAction = (values: any) => {
    // this.ngxService.start();
    var data = {
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.total,
      productDetails: values.productDetails
    }

    this.billService.getPDF(data).subscribe({
      next: (res: any) => {
        // this.ngxService.stop; 
        saveAs(res, values.uuid + '.pdf')
      }
    })
  }

  handelDeleteAction = (values: any) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name + ' bill',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe({
      next: (res: any) => {
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
      }
    });
  }

  deleteProduct = (id: any) => {
    this.billService.delete(id).subscribe({
      next: (res: any) => {
        console.log("delete", res)
        this.ngxService.stop();
        this.tableData();
        this.responsiveMessage = res?.message;
        this.snackbarService.openSnackBar(this.responsiveMessage, 'success');
      }, error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.messgae) {
          this.responsiveMessage = error.error?.messgae;
        }
        else {
          this.responsiveMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responsiveMessage, GlobalConstants.error);
      }
    });
  }


}
