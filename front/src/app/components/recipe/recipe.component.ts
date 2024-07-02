import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { Environment } from '../../environments/environment';
import { Pagination } from '../../models/pagination.model';

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
  pagination: Pagination = {
    currentPage: 1,
    pageSize: 3,
    totalItems: 0,
    totalPages: 0
  }

  token: string = ""
  url = Environment.imagesUrl;
  owned = false;

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
          console.log(resp)
          this.recipe = resp.recipe
          this.recipe.averageRating = resp.averageRating
          this.pagination = resp.commentPagination
          console.log(this.recipe)
        }
      }
    )
  }
}

