import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {}
  token:string | null = null
  id: string | null = null
  image: string | null = null
  firstName: string | null = null
  url = Environment.imagesUrl

  ngOnInit() {
    this.token = localStorage.getItem("token")
    if (this.token){
      var decodedToken = this.authService.getDecodedAccessToken(this.token)
      this.id = decodedToken._id
      this.image = this.url + "/" + decodedToken.image
      this.firstName = decodedToken.name
    }
  }

  navigateToProfile(): void {
    const currentId = this.route.snapshot.paramMap.get('id');

    if (currentId !== this.id) {
      this.router.navigate(['/profile', this.id]);
    }
  }

  logout(): void {
    localStorage.removeItem("token")
    if (this.router.url === '/home') {
      this.router.navigate(['/home']).then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigate(['/home']);
    }
  }
}
