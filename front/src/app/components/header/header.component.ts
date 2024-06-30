import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) {}
  token:string | null = localStorage.getItem("token")

  logout(): void {
    localStorage.removeItem("token")
    this.router.navigate(["home"])
  }
}
