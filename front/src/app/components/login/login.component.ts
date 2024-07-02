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
  errorMsg: string = ""

  tryLogin(){
    this.authService.login(this.login).subscribe({
      next: (resp) => {
        this.errorMsg = "";
        localStorage.setItem("token", resp.token);
        this.router.navigate(['home']);
      },
      error: (err) => {
        console.log("odje")
        this.errorMsg = "Wrong credentials!"
        console.log(err)
      }
    })
  }
}
