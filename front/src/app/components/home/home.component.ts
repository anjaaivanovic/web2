import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { Pagination } from '../../models/pagination.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private recipeService: RecipeService, private router: Router){}
  recipes: Recipe[] = []
  pagination: Pagination = {
    currentPage: 0,
    totalPages: 0,
    pageSize: 0,
    totalItems: 0
  }
  token: string | null = localStorage.getItem("token")

  ngOnInit(): void {
    this.recipeService.allRecipes().subscribe(
      {
        next: (resp) => {
          this.recipes = resp.recipes.data
          this.pagination = resp.recipes.pagination
          console.log(this.recipes)
          console.log(this.pagination)
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }
}
