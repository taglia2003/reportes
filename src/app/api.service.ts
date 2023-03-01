import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  getDetenciones(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.baseURL}detenciones.json`);
  }


}
