import { Recipe } from "./recipe.model"
import { User } from "./user.model"

export interface Rating {
    _id: string,
    recipe: Recipe,
    user: User,
    rating: Number
}