import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}
  login: Login = {
    email: "",
    password: ""
  }

  tryLogin(){
    this.authService.login(this.login).subscribe({
      next: (resp) => {
        localStorage.setItem("token", resp.token);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
