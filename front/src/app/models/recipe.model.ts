import { Category } from "./category.model";
import { Comment } from "./comment.model";
import { User } from "./user.model";

export interface Recipe {
    _id: string,
    title: string;
    owner: User;
    description: string;
    image?: string;
    ingredients: string[];
    steps: string[];
    comments: Comment[];
    categories: Category[];
    prepTime: number;
    cookTime: number;
    servingSize: number;
}
  