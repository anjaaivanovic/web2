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

  token: string = ""
  url = Environment.imagesUrl;
  owned = false;
  saved = false;
  rating = 0;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.recipe._id = params["id"];
    });
    this.loadRecipe();
  }

  loadRecipe(){
    this.recipeService.getRecipe(this.recipe._id, this.pagination.currentPage).subscribe(
      {
        next: (resp) => {
          this.recipe = resp.recipe
          this.recipe.averageRating = resp.averageRating
          this.pagination = resp.commentPagination
          var token = localStorage.getItem("token")
          if (token) {
            if (this.authService.getDecodedAccessToken(token)._id == this.recipe.owner?._id) {
              this.owned = true;
            }
          }
          this.checkSaved()
        }
      }
    )
  }

  deleteRecipe(id: string){
    this.recipeService.deleteRecipe(id).subscribe({
      next: (resp) => {
        if (resp) {
          var token = localStorage.getItem("token")
          if (token) this.router.navigate([`/profile/${this.authService.getDecodedAccessToken(token)._id}`])
        } 
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  saveRecipe(id: string){
    var token = <string>localStorage.getItem("token")
    var user = this.authService.getDecodedAccessToken(token)._id
    this.savedRecipeService.saveRecipe(id, user).subscribe({
      next: (resp) => {
        if (resp.success) window.location.reload()
        else console.log("nije")
    },
    error: (err) => {
      console.log(err)
    }
  });
  }

  unsaveRecipe(id: string){
    var token = <string>localStorage.getItem("token")
    var user = this.authService.getDecodedAccessToken(token)._id
    this.savedRecipeService.unsaveRecipe(id, user).subscribe({
      next: (resp) => {
        if (resp.success) window.location.reload()
        else console.log("nije")
    },
    error: (err) => {
      console.log(err)
    }
  });
  }
  openModal() {
    this.modalService.showModal();
  }

  editRecipe(){
  }

  comment(){
    var comm: PostComment = {
      recipe: this.recipe._id,
      text: this.text,
      user: this.authService.getDecodedAccessToken(<string>localStorage.getItem("token"))._id
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
    console.log(page)
    this.pagination.currentPage = page;
    this.loadRecipe();
  }

  checkSaved(){
    this.savedRecipeService.checkSaved(this.authService.getDecodedAccessToken(<string>localStorage.getItem("token"))._id, this.recipe._id).subscribe({
      next: (resp) => {
        console.log(resp)
        this.saved = resp.saved;
        console.log(this.saved)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  rate(){
    var r: PostRating = {
      rating: this.rating,
      recipe: this.recipe._id,
      user: this.authService.getDecodedAccessToken(<string>localStorage.getItem("token"))._id
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
}