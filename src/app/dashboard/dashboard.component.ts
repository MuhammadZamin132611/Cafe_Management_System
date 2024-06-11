import { AfterViewInit, Component } from '@angular/core';
import { DashbordService } from '../services/dashbord.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  responseMessage: any
  data: any

  constructor(private dashboardService: DashbordService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {
    this.ngxService.start();
    this.dashboard();
  }

  
  dashboard = () => {
    this.dashboardService.getDetails().subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.data = res;
      }, error: (error: any) => {
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    })
  }

  ngAfterViewInit(): void {

  }
}
