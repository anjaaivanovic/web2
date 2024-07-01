import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Register } from '../../models/register.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router) {}
  register: Register = {
    email: "",
    firstName: "",
    lastName: "",
    password: ""
  }

  tryRegister(){
    this.authService.register(this.register).subscribe({
      next: (resp) => {
        if (resp) this.router.navigate(['login'])
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
