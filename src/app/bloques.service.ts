import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BloquesService {

  private apiUrl = 'http://localhost/servi.php';  // URL donde se encuentra el script PHP
   constructor(private http: HttpClient) { }

  obtenerBloques(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
