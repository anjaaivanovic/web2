import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../environments/environment';
import { PostComment } from '../models/postComment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }
  url = Environment.url + "/comment"

  postComment(comment: PostComment){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    return this.httpClient.post(`${this.url}`, comment, {headers})
  }
}
