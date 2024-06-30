import { Pagination } from "./pagination.model";
import { Recipe } from "./recipe.model";

export interface RecipeResponse {
    recipes: {
      data: Recipe[];
      pagination: Pagination;
    };
  }
  