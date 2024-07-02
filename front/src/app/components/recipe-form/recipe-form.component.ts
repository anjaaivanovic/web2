import { Component, Input } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { PostRecipe } from '../../models/postRecipe.model';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent {
  @Input() recipe: any;
  isVisible = false;

  recipeForm!: FormGroup

  categories: Category[] = [];
  id = ""

  constructor(private fb: FormBuilder, private modalService: ModalService, private categoryService: CategoryService, private recipeService: RecipeService, private authService: AuthService) {
    this.modalService.modalVisibility.subscribe((isVisible: boolean) => {
      this.isVisible = isVisible;
    });
  }

  ngOnInit() {
    this.recipeForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      photo: new FormControl(null),
      prepTime: new FormControl(null, Validators.required),
      cookTime: new FormControl(null, Validators.required),
      servingSize: new FormControl(null, Validators.required),
      ingredients: new FormArray([]),
      instructions: new FormArray([]),
      category: new FormControl(null, Validators.required)
    });
    var token = localStorage.getItem("token");
    if (token) this.id = this.authService.getDecodedAccessToken(token)._id;

    this.addIngredient();
    this.addStep();
    this.addIngredient();
    this.addStep();

    this.categoryService.getCategories().subscribe({
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
        photo: file
      });
    }
  }

  submitRecipe() {
    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;
      console.log(formValue.ingredients)
      console.log(formValue.instructions)
      const newRecipe: PostRecipe = {
        categories: formValue.category,
        averageRating: formValue.averageRating,
        cookTime: formValue.cookTime,
        prepTime: formValue.prepTime,
        description: formValue.description,
        ingredients: formValue.ingredients,
        owner: this.id,
        servingSize: formValue.servingSize,
        steps: formValue.instructions,
        title: formValue.title,
        image: formValue.image
      }
      this.recipeService.newRecipe(newRecipe).subscribe(response => {
        console.log('Recipe saved', response);
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.modalService.hideModal();
  }
}
