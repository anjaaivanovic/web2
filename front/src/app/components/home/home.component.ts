import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { Pagination } from '../../models/pagination.model';
import { Router } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private recipeService: RecipeService, private categoryService: CategoryService, private router: Router){}
  recipes: Recipe[] = []
  pagination: Pagination = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 0,
    totalItems: 0
  }
  token: string | null = localStorage.getItem("token")
  categories: Category[] = []
  specificUser: string|null = null
  search = ""
  prepTime : number | undefined = undefined
  cookTime : number | undefined = undefined
  servingSize : number | undefined = undefined
  sort = "title"
  order = "asc"

  ngOnInit(): void {
    this.loadRecipes();
    this.loadCategories();
  }

  loadRecipes() {
    this.recipeService.allRecipes(
        this.specificUser,
        this.pagination.currentPage,
        this.categories.filter(x => x.selected).map(x => x._id),
        this.search,
        this.prepTime,
        this.cookTime,
        this.servingSize,
        this.sort,
        this.order
      ).subscribe(
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

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      {
        next: (resp) => {
          this.categories = resp.categories.map((category: Category) => ({
            ...category,
            isSelected: false
          }));
          console.log(this.categories)
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  toggleCategorySelection(category: Category) {
    category.selected = !category.selected;
    this.loadRecipes();
  }

  totalPagesArray(): number[] {
    return Array(this.pagination.totalPages).fill(0).map((x, i) => i + 1);
  }

  gotoPage(page: number): void {
    console.log('Navigating to page:', page);
    this.pagination.currentPage = page;
    this.loadRecipes();
  }
  
}
