export interface PostRecipe {
    title: string;
    owner: string;
    description: string;
    image?: string;
    ingredients: string[];
    steps: string[];
    categories: string[];
    prepTime: number;
    cookTime: number;
    servingSize: number;
    averageRating: number;
}
  