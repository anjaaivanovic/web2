import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router, private authService: AuthService) {}
  token:string | null = null
  id: string | null = null

  ngOnInit() {
    this.token = localStorage.getItem("token")
    if (this.token){
      this.id = this.authService.getDecodedAccessToken(this.token)._id
    }
  }

  logout(): void {
    localStorage.removeItem("token")
    this.router.navigate(["home"])
  }
}
