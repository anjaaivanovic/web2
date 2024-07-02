import { Pagination } from "./pagination.model";
import { Recipe } from "./recipe.model";

export interface SingleRecipeResponse {
    recipe: Recipe,
    averageRating: number,
    commentPagination: Pagination
}