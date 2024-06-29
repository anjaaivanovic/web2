import { Recipe } from "./recipe.model";
import { User } from "./user.model";

export interface Comment {
    _id: string,
    user: User,
    recipe: Recipe,
    text: string,
    parent: Comment|null,
    children: Comment[]
}