import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  editProfile(updatedUser: FormData): Observable<boolean>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    return this.httpClient.put<boolean>(`${this.url}`, updatedUser, {headers: headers});
  }
}
