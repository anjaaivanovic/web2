import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { Environment } from '../../environments/environment';
import { Pagination } from '../../models/pagination.model';
import { AuthService } from '../../services/auth.service';
import { SavedRecipeService } from '../../services/saved-recipe.service';
import { ModalService } from '../../services/modal.service';
import { CommentService } from '../../services/comment.service';
import { PostComment } from '../../models/postComment.model';
import { PostRating } from '../../models/postRating.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})
export class RecipeComponent {
  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private authService: AuthService, private router: Router, private savedRecipeService: SavedRecipeService, private modalService: ModalService, private commentService: CommentService) {}
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

  text = ""

  token: string | null = ""
  url = Environment.imagesUrl;
  owned = false;
  saved = false;
  rated = false;
  rating = 0;
  editModalId = "editRecipeModal";

  ngOnInit(): void {
    this.loadRecipe();
  }

  loadRecipe(){
    this.route.params.subscribe((params) => {
      this.recipe._id = params["id"];
    });
    this.recipeService.getRecipe(this.recipe._id, this.pagination.currentPage).subscribe(
      {
        next: (resp) => {
          if (resp)
          {
            this.recipe = resp.recipe
            this.recipe.averageRating = resp.averageRating
            this.pagination = resp.commentPagination
            this.token = localStorage.getItem("token")
            if (this.token) {
              if (this.authService.getDecodedAccessToken(this.token)._id == this.recipe.owner?._id) {
                this.owned = true;
              }
            }
            this.checkSaved();
            this.checkRated();
          }
          else{
            this.token = localStorage.getItem("token")
            if (this.token) this.router.navigate([`profile/${this.authService.getDecodedAccessToken(this.token)._id}`]);
            else this.router.navigate(["home"])
          } 
        },
        error: (err) => {
          if (this.token) this.router.navigate([`profile/${this.authService.getDecodedAccessToken(this.token)._id}`]);
        }
      }
    )
  }

  deleteRecipe(id: string){
    this.recipeService.deleteRecipe(id).subscribe({
      next: (resp) => {
        if (resp) {
          window.location.reload();
        } 
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  saveRecipe(id: string){
    var user = this.authService.getDecodedAccessToken(<string>this.token)._id
    this.savedRecipeService.saveRecipe(id, user).subscribe({
      next: (resp) => {
        if (resp.success) window.location.reload()
    },
    error: (err) => {
      console.log(err)
    }
  });
  }

  unsaveRecipe(id: string){
    var user = this.authService.getDecodedAccessToken(<string>this.token)._id
    this.savedRecipeService.unsaveRecipe(id, user).subscribe({
      next: (resp) => {
        if (resp.success) window.location.reload()
    },
    error: (err) => {
      console.log(err)
    }
  });
  }
  
  openModal(id: string) {
    this.modalService.showModal(id);
  }

  comment(){
    var comm: PostComment = {
      recipe: this.recipe._id,
      text: this.text,
      user: this.authService.getDecodedAccessToken(<string>this.token)._id
    }
    this.commentService.postComment(comm).subscribe({
      next: (resp) => {
        if (resp) window.location.reload();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  totalPagesArray(pagination: Pagination): number[] {
    return Array(pagination.totalPages).fill(0).map((x, i) => i + 1);
  }

  gotoPage(page: number): void {
    this.pagination.currentPage = page;
    this.loadRecipe();
  }

  checkSaved(){
    this.savedRecipeService.checkSaved(this.recipe._id).subscribe({
      next: (resp) => {
        this.saved = resp.saved;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  stars: boolean[] = Array(5).fill(false);

  updateStars(rating: number) {
    this.rating = rating;
  }

  rate(){
    var r: PostRating = {
      rating: this.rating,
      recipe: this.recipe._id,
      user: this.authService.getDecodedAccessToken(<string>this.token)._id
    }
    this.recipeService.rateRecipe(r).subscribe({
      next: (resp) => {
        if (resp) window.location.reload()
      },
    error: (err) => {
      console.log(err)
    }
    })
  }

  checkRated(){
    this.recipeService.checkRated(this.recipe._id).subscribe({
      next: (resp) => {
        this.rated = resp.rated;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}