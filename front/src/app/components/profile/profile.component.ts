import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { Recipe } from '../../models/recipe.model';
import { Pagination } from '../../models/pagination.model';
import { RecipeService } from '../../services/recipe.service';
import { SavedRecipeService } from '../../services/saved-recipe.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor (private profileService: ProfileService, private recipeService: RecipeService, private savedRecipeService: SavedRecipeService,private router: Router, private route: ActivatedRoute) {}
  user: User = {
    _id: "",
    averageRating: 0,
    email: "",
    firstName: "",
    hash: "",
    image: "",
    lastName: "",
    role: "",
    salt: "",
    totalRecipeCount: 0
  }
  savedRecipes: Recipe[] = []
  postedRecipes: Recipe[] = []
  savedPagination: Pagination = {
    currentPage: 0,
    totalPages: 0,
    pageSize: 0,
    totalItems: 0
  }
  postedPagination: Pagination = {
    currentPage: 0,
    totalPages: 0,
    pageSize: 0,
    totalItems: 0
  }
  token: string = ""

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params["id"]);
      this.user._id = params["id"];
    });

    if (this.token.length > 0) this.loadSavedRecipes();
    this.loadPostedRecipes();
    this.loadProfile();
  }

  loadSavedRecipes() {
    this.savedRecipeService.savedRecipes(this.user._id).subscribe(
      {
        next: (resp) => {
          this.savedRecipes = resp.recipes.data
          this.savedPagination = resp.recipes.pagination
          console.log(this.savedRecipes)
          console.log(this.savedPagination)
        }
      }
    )
  }

  loadPostedRecipes() {
    this.recipeService.allRecipes(this.user._id).subscribe(
      {
        next: (resp) => {
          this.postedRecipes = resp.recipes.data
          this.postedPagination = resp.recipes.pagination
          console.log(this.postedRecipes)
          console.log(this.postedPagination)
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  loadProfile() {
    this.profileService.getProfile(this.user._id).subscribe(
      {
        next: (resp) => {
          this.user = resp
          console.log(this.user)
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

}
