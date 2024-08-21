import { Component, Input, SimpleChanges } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { PostRecipe } from '../../models/postRecipe.model';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent {
  isVisible = false;

  recipeForm!: FormGroup

  categories: Category[] = [];
  id = ""
  modalId = "addRecipeModal"
  
  photoURL: string | ArrayBuffer | null = null;

  constructor(
    private modalService: ModalService,
    private categoryService: CategoryService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.modalService.getModalVisibility(this.modalId).subscribe((isVisible: boolean) => {
      this.isVisible = isVisible;
    });
  }

  ngOnInit() {
    this.recipeForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      image: new FormControl(null),
      prepTime: new FormControl(null, Validators.required),
      cookTime: new FormControl(null, Validators.required),
      servingSize: new FormControl(null, Validators.required),
      ingredients: new FormArray([], Validators.required),
      instructions: new FormArray([], Validators.required),
      category: new FormControl(null, Validators.required),
    });
    var token = localStorage.getItem("token");
    if (token) this.id = this.authService.getDecodedAccessToken(token)._id;

    this.addIngredient();
    this.addStep();

    this.categoryService.getCategories().subscribe({
        next: (resp) => {
          this.categories = resp.categories.map((category: Category) => ({
            ...category,
            isSelected: false
          }));
        },
        error: (error) => {
          console.log(error)
        }
    });
  }

  get ingredientControls(){
    return (<FormArray>this.recipeForm.get("ingredients")).controls
  }

  get instructionControls(){
    return (<FormArray>this.recipeForm.get("instructions")).controls
  }

  addIngredient() {
   const control = new FormControl(null, Validators.required);
   (<FormArray>this.recipeForm.get('ingredients')).push(control);
  }

  removeIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  addStep() {
    const control = new FormControl(null, Validators.required);
   (<FormArray>this.recipeForm.get('instructions')).push(control);
  }

  removeStep(index: number) {
   (<FormArray>this.recipeForm.get('instructions')).removeAt(index);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.recipeForm.patchValue({
        image: file
      });

      const reader = new FileReader();
      reader.onload = () => {
        this.photoURL = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitRecipe() {
    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;
      
      const formData = new FormData();
      formData.append('categories', formValue.category);
      formData.append('cookTime', formValue.cookTime);
      formData.append('prepTime', formValue.prepTime);
      formData.append('description', formValue.description);
      formData.append('ingredients', JSON.stringify(formValue.ingredients));
      formData.append('owner', this.id);
      formData.append('servingSize', formValue.servingSize);
      formData.append('steps', JSON.stringify(formValue.instructions));
      formData.append('title', formValue.title);

      if (formValue.image) {
        formData.append('image', formValue.image);
      }

      this.recipeService.newRecipe(formData).subscribe( {
        next: (resp) => {
          if (resp){
            window.location.reload();
            this.closeModal();
          }
        }
      });
    }
  }

  closeModal() {
    this.modalService.hideModal(this.modalId);
  }
}
