import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, AfterViewInit{

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
  
  userForm!: FormGroup;
  photoURL: string | ArrayBuffer | null = null;

  @ViewChild('editUserModal') myModal!: ElementRef;

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

    this.userForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      image: new FormControl(null),
      password: new FormControl(null, Validators.required),
      repeatPassword: new FormControl(null, Validators.required),
    });

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
          this.formInit();
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

  formInit(){
      this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      image: this.user.image
    })

    if (this.user.image) this.photoURL = this.url + "/" + this.user.image;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userForm.patchValue({
        image: file
      });

      const reader = new FileReader();
      reader.onload = () => {
        this.photoURL = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  editUser(){
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const formData = new FormData();
      formData.append('firstName', formValue.firstName);
      formData.append('lastName', formValue.lastName);
      formData.append('_id', this.user._id);
      formData.append('password', formValue.password)
      
      if (formValue.image) {
        formData.append('image', formValue.image);
      }

      this.profileService.editProfile(formData).subscribe({
        next: (resp) => {
          if (resp) {
            window.location.reload();
          }
        },
        error: (err) => {
          alert(err.error.err)
        }
      });
    }
  }

  areEqual(): boolean
  {
    const formValue = this.userForm.value;
    
    if (formValue.password && formValue.repeatPassword && formValue.password === formValue.repeatPassword){
      return true;
    }

    return false;
  }


  ngAfterViewInit(): void {
    const modalElement = this.myModal.nativeElement;
    modalElement.addEventListener('hidden.bs.modal', () => {
      this.onModalDismiss();
    });
  }

  onModalDismiss(): void {
    this.formInit();
  }
}
