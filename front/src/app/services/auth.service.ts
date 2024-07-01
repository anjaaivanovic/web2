import { Injectable } from '@angular/core';
import { Environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/login.model';
import { Register } from '../models/register.model';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = Environment.url + "/auth";
  constructor(private httpClient: HttpClient) { }

  login(user: Login): Observable<Token>
  {
    return this.httpClient.post<Token>(`${this.url}/login`, user)
  }

  register(user: Register): Observable<string>{
    return this.httpClient.post<string>(`${this.url}/register`, user)
  }
}