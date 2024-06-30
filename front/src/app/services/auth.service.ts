import { Injectable } from '@angular/core';
import { Environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = Environment.url;
  constructor(private httpClient: HttpClient) { }

  login(user: Login): Observable<string>
  {
    return this.httpClient.post<string>(`${this.url}/login`, user, {responseType: 'text' as 'json'})
  }

  register(user: User): Observable<string>{
    return this.httpClient.post<string>(`${this.url}/register`, user)
  }

}
