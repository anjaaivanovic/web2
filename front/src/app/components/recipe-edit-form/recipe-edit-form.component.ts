import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { ModalService } from '../../services/modal.service';
import { CategoryService } from '../../services/category.service';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { Environment } from '../../environments/environment';

@Component({
  selector: 'app-recipe-edit-form',
  templateUrl: './recipe-edit-form.component.html',
  styleUrls: ['./recipe-edit-form.component.css']
})
export class RecipeEditFormComponent implements OnInit {
  @Input() recipe: any;
  isVisible = false;
  recipeForm!: FormGroup;
  categories: Category[] = [];
  id = "";
  modalId = "editRecipeModal";

  photoURL: string | ArrayBuffer | null = null;
  url = Environment.imagesUrl

  constructor(
    private modalService: ModalService,
    private categoryService: CategoryService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {
    this.modalService.getModalVisibility(this.modalId).subscribe((isVisible: boolean) => {
      this.isVisible = isVisible;
      if (this.isVisible) {
        this.loadRecipeData();
      }
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
      ingredients: new FormArray([]),
      instructions: new FormArray([]),
      category: new FormControl(null, Validators.required),
    });

    const token = localStorage.getItem("token");
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
        console.log(error);
      }
    });
  }

  get ingredientControls() {
    return (this.recipeForm.get("ingredients") as FormArray).controls;
  }

  get instructionControls() {
    return (this.recipeForm.get("instructions") as FormArray).controls;
  }

  addIngredient() {
    const control = new FormControl(null, Validators.required);
    (this.recipeForm.get('ingredients') as FormArray).push(control);
  }

  removeIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  addStep() {
    const control = new FormControl(null, Validators.required);
    (this.recipeForm.get('instructions') as FormArray).push(control);
  }

  removeStep(index: number) {
    (this.recipeForm.get('instructions') as FormArray).removeAt(index);
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
      formData.append('_id', this.recipe._id);

      if (formValue.image) {
        formData.append('image', formValue.image);
      }
      
      this.recipeService.editRecipe(this.recipe._id, formData).subscribe({
        next: (resp) => {
          if (resp) {
            window.location.reload();
            this.closeModal();
          }
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  }

  loadRecipeData() {
    if (!this.recipeForm) return;
    this.recipeForm.patchValue({
      title: this.recipe.title,
      description: this.recipe.description,
      prepTime: this.recipe.prepTime,
      cookTime: this.recipe.cookTime,
      servingSize: this.recipe.servingSize,
      category: this.recipe.categories[0]._id,
      image: this.recipe.image
    });

    this.setFormArray('ingredients', this.recipe.ingredients);
    this.setFormArray('instructions', this.recipe.steps);

    if (this.recipe.image) this.photoURL = this.url + "/" + this.recipe.image;
  }

  private setFormArray(arrayName: string, items: string[]) {
    const formArray = this.recipeForm.get(arrayName) as FormArray;
    formArray.clear();
    if (items) {
      items.forEach(item => formArray.push(new FormControl(item, Validators.required)));
    }
  }

  closeModal() {
    this.modalService.hideModal(this.modalId);
  }
}
