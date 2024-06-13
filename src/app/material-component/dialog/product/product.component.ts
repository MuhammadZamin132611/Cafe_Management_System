import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constant';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = "Add";
  responaseMessage: any;
  categorys: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,

  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategorys();
  }

  getCategorys = () => {
    this.categoryService.getCategory().subscribe({
      next: (res: any) => {
        this.categorys = res
      }, error: (error: any) => {
        if (error.error?.message) {
          this.responaseMessage = error.error?.message;
        } else {
          this.responaseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responaseMessage, GlobalConstants.error);
      }
    })
  }

  handelSubmit = () => {
    if (this.dialogAction === "Edit") {
      this.edit();
    }
    else {
      this.add();
    }
  }

  add = () => {
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };
    this.productService.add(data).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responaseMessage = res.message;
        this.snackbarService.openSnackBar(this.responaseMessage, "success");
      }, error: (error: any) => {
        if (error.error?.message) {
          this.responaseMessage = error.error?.message;
        } else {
          this.responaseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responaseMessage, GlobalConstants.error);
      }
    });
  }

  edit = () => {
    var formData = this.productForm.value;
    var data = {
      id:this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };
    this.productService.update(data).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responaseMessage = res.message;
        this.snackbarService.openSnackBar(this.responaseMessage, "success");
      }, error: (error: any) => {
        if (error.error?.message) {
          this.responaseMessage = error.error?.message;
        } else {
          this.responaseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responaseMessage, GlobalConstants.error);
      }
    });
  }
}
