import { Component, Input } from '@angular/core';
import { Environment } from '../../environments/environment';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
  @Input() category: any;
  url = Environment.imagesUrl

  toggleSelection() {
    this.category.selected = !this.category.selected;
  }
}
