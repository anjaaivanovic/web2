import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url = Environment.url + "/auth"
  constructor(private httpClient: HttpClient) { }

  getProfile(userId: string): Observable<User>{
    return this.httpClient.get<User>(`${this.url}/${userId}`);
  }
}
