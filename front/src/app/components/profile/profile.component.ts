import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { Recipe } from '../../models/recipe.model';
import { Pagination } from '../../models/pagination.model';
import { RecipeService } from '../../services/recipe.service';
import { SavedRecipeService } from '../../services/saved-recipe.service';
import { AuthService } from '../../services/auth.service';
import { Environment } from '../../environments/environment';
import { ModalService } from '../../services/modal.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor (private profileService: ProfileService, private recipeService: RecipeService, private savedRecipeService: SavedRecipeService, private authService: AuthService, private modalService: ModalService, private route: ActivatedRoute) {}
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
    currentPage: 1,
    totalPages: 0,
    pageSize: 0,
    totalItems: 0
  }
  postedPagination: Pagination = {
    currentPage: 1,
    totalPages: 0,
    pageSize: 0,
    totalItems: 0
  }
  token: string | null  = null
  recipe: Recipe = {
    _id: "",
    averageRating: 0,
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
  }

  categories: Category[] = []
  specificUser: string|null = null
  search = ""
  prepTime : number | undefined = undefined
  cookTime : number | undefined = undefined
  servingSize : number | undefined = undefined
  sort = "title"
  order = "asc"

  displaySaved = false
  url = Environment.imagesUrl
  recipeModalId = "addRecipeModal";
  
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.user._id = params["id"];
    });

    this.token = localStorage.getItem("token")
    if (this.token){
      var id = this.authService.getDecodedAccessToken(this.token)
      if (id._id == this.user._id){
        this.displaySaved = true;
      } 
    } 
    this.loadPostedRecipes();
    this.loadSavedRecipes();
    this.loadProfile();
  }

  loadSavedRecipes() {
    if (!this.displaySaved) return;
    this.savedRecipeService.savedRecipes(this.user._id).subscribe(
      {
        next: (resp) => {
          this.savedRecipes = resp.recipes.data
          this.savedPagination = resp.recipes.pagination
        }
      }
    )
  }

  loadPostedRecipes() {
    this.recipeService.allRecipes(
      this.user._id,
      this.postedPagination.currentPage,
      this.categories.filter(x => x.selected).map(x => x._id),
      this.search,
      this.prepTime,
      this.cookTime,
      this.servingSize,
      this.sort,
      this.order,
      null
    ).subscribe(
      {
        next: (resp) => {
          this.postedRecipes = resp.recipes.data
          this.postedPagination = resp.recipes.pagination
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
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  openModal(id: string) {
    this.modalService.showModal(id);
  }

  totalPagesArray(pagination: Pagination): number[] {
    return Array(pagination.totalPages).fill(0).map((x, i) => i + 1);
  }

  gotoPagePosted(page: number): void {
    this.postedPagination.currentPage = page;
    this.loadPostedRecipes();
  }

  gotoPageSaved(page: number): void {
    this.savedPagination.currentPage = page;
    this.loadSavedRecipes();
  }
}
