import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constant';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  resmponseMessage: any;

  constructor(private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.manageOrderForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    })
    this.getCategorys();
  }

  getCategorys = () => {
    this.categoryService.getCategory().subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.categorys = res;
      }, error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.resmponseMessage = error.error?.message;
        }
        else {
          this.resmponseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.resmponseMessage, GlobalConstants.error);
      }
    });
  }

  getProductsByCategory = (value: any) => {
    this.productService.getProductByCategory(value.id).subscribe({
      next: (res: any) => {
        console.log(res);
        
        this.products = res;
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue(0);
      }, error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.resmponseMessage = error.error?.message;
        }
        else {
          this.resmponseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.resmponseMessage, GlobalConstants.error);
      }
    });
  }

  getProductDetails = (value: any) => {
    this.productService.getById(value.id).subscribe({
      next: (res: any) => {
        this.price = res.price;
        this.manageOrderForm.controls['price'].setValue(res.price);
        this.manageOrderForm.controls['quantity'].setValue('1');
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
      }, error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.resmponseMessage = error.error?.message;
        }
        else {
          this.resmponseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.resmponseMessage, GlobalConstants.error);
      }
    })
  }

  setQuantity = (value: any) => {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
    else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
  }

  validateProductAdd = () => {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <= 0) {
      return true;
    }
    else {
      return false;
    }
  }

  validateSubmit = () => {
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null ||
      !(this.manageOrderForm.controls['contactNumber'].valid) ||
      !(this.manageOrderForm.controls['email'].valid)) {
      return true;
    }
    else {
      return false;
    }
  }


  add() {
    var formatData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: { id: number; }) => e.id == formatData.product.id);
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formatData.total;
      this.dataSource.push({
        id: formatData.product.id,
        name: formatData.product.name,
        category: formatData.category.name,
        quantity: formatData.quantity,
        price: formatData.price,
        total: formatData.total,
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success");
    }
    else {
      this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  handelDeleteAction = (value: any, element: any) => {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction() {
    this.ngxService.start();
    var formatData = this.manageOrderForm.value;
    var data = {
      name: formatData.name,
      email: formatData.email,
      contactNumber: formatData.contactNumber,
      paymentMethod: formatData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.downloadFile(res?.uuid);
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      }, error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.resmponseMessage = error.error?.message;
        }
        else {
          this.resmponseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.resmponseMessage, GlobalConstants.error);
      }
    })
  }

  downloadFile = (fileName: any) => {
    var data = {
      uuid: fileName
    }
    this.billService.getPDF(data).subscribe({
      next: (res: any) => {
        saveAs(res, fileName + '.pdf');
        this.ngxService.stop();
      }
    })
  }
}
