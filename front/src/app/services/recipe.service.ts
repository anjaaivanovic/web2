import { Injectable } from '@angular/core';
import { Environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeResponse } from '../models/recipeResponse.model';
import { Recipe } from '../models/recipe.model';
import { SingleRecipeResponse } from '../models/singleRecipeResponse.model';
import { PostRecipe } from '../models/postRecipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private url = Environment.url + "/recipe";
  constructor(private httpClient: HttpClient) { }

  allRecipes(userId: string | null = null, page: number = 1, categories: string[] = [], search: string = '', prepTime?: number,
              cookTime?: number, servingSize?: number, sort: string = 'title', order: string = 'asc'
  ): Observable<RecipeResponse>{
    let params = new HttpParams()
      .set('page', page.toString())
      .set('sort', sort)
      .set('order', order);
    
    if (userId) params = params.set('userId', userId.toString())
    if (categories.length > 0) params = params.set('categories', categories.join(','));
    if (search) params = params.set('search', search);
    if (prepTime) params = params.set('prepTime', prepTime.toString());
    if (cookTime) params = params.set('cookTime', cookTime.toString());
    if (servingSize) params = params.set('servingSize', servingSize.toString());

    return this.httpClient.get<RecipeResponse>(`${this.url}/all`, { params });
  }

  getRecipe(recipeId: string): Observable<SingleRecipeResponse> {
    var params = new HttpParams().set('id', recipeId)
    return this.httpClient.get<SingleRecipeResponse>(`${this.url}`, {params})
  }

  newRecipe(recipe: PostRecipe){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    return this.httpClient.post(`${this.url}`, recipe, {headers});
  }

  deleteRecipe(id: string){
    var params = new HttpParams().set('id', id)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    return this.httpClient.delete(`${this.url}`, {params, headers});
  }
}
