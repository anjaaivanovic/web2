import { Injectable } from '@angular/core';
import { Environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../models/categoryResponse.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = Environment.url + "/category";
  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<CategoryResponse> {
    return this.httpClient.get<CategoryResponse>(`${this.url}/all`);
  }
}
