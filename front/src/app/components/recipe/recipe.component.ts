import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})
export class RecipeComponent {
  constructor(private recipeService: RecipeService, private route: ActivatedRoute) {}
  recipe: Recipe = {
    _id: "",
    categories: [],
    comments: [],
    cookTime: 0,
    description: "",
    ingredients: [],
    owner: null,
    prepTime: 0,
    servingSize: 0,
    steps: [],
    title: "",
    averageRating: 0
  }
  token: string = ""

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params["id"]);
      this.recipe._id = params["id"];
    });

    this.loadRecipe();
  }

  loadRecipe(){
    this.recipeService.getRecipe(this.recipe._id).subscribe(
      {
        next: (resp) => {
          this.recipe = resp
          console.log(this.recipe)
        }
      }
    )
  }
}

