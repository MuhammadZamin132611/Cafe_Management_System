import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  add = (data: any) => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.url + "/product/add", data, { headers });
  }

  update = (data: any) => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.patch(this.url + "/product/update", data, { headers });
  }

  getProduct = () => {
    return this.http.get(this.url + "/product/get");
  }

  updateStatus = (data: any) => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.patch(this.url + "/product/updateStatus", data, { headers });
  }

  delete = (id: any) => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.url}/product/delete/${id}`;
    return this.http.delete(url, { headers });
  }
  
  getProductByCategory = (id: any) => {
    return this.http.get(this.url + "/product/getByCategory/" + id);
  }

  getById = (id: any) => {
    return this.http.get(this.url + "/product/getById/" + id);
  }
}
