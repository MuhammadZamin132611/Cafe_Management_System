import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashbordService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDetails() {
    return this.http.get(this.url + '/dashboard/details');
  }
}
