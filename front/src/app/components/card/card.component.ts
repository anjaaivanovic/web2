import { Component, Input } from '@angular/core';
import { Environment } from '../../environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() recipe: any;
  url = Environment.imagesUrl
}