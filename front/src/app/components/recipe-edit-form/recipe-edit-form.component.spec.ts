import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeEditFormComponent } from './recipe-edit-form.component';

describe('RecipeEditFormComponent', () => {
  let component: RecipeEditFormComponent;
  let fixture: ComponentFixture<RecipeEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeEditFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
