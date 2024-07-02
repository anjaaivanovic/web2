export interface EditRecipe {
    _id: string;
    title: string;
    owner: string;
    description: string;
    image?: File;
    ingredients: string[];
    steps: string[];
    categories: string[];
    prepTime: number;
    cookTime: number;
    servingSize: number;
    averageRating: number;
}
  