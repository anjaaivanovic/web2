import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeResponse } from '../models/recipeResponse.model';
import { Observable } from 'rxjs';
import { Environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavedRecipeService {
  private url = Environment.url + "/savedRecipe";
  constructor(private httpClient: HttpClient) { }

  savedRecipes(id: string): Observable<RecipeResponse>{
    return this.httpClient.get<RecipeResponse>(`${this.url}/${id}`);
  }
}
