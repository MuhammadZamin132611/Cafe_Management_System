import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl
  constructor(private http: HttpClient) { }

  add = (data: any) => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.url + "/category/add", data, { headers });
  }

  update = (data: any) => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.patch(this.url + "/category/update", data, { headers });
  }

  getCategory=()=>{
    return this.http.get(this.url+"/category/get");
  }
}
