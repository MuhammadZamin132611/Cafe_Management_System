import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;
  constructor(private http: HttpClient) { }

  generateReport = (data: any) => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.url + "/bill/generateReport/", data, { headers })
  }

  getPDF = (data: any): Observable<Blob> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.url + "/bill/getPdf", data, { responseType: 'blob' })
  }

  getBills = () => {
    return this.http.get(this.url + "/bill/getBills/");
  }

  delete = (id: any) => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.url}"/bill/delete/"${id},`
    return this.http.delete(url, { headers })
  }
}
