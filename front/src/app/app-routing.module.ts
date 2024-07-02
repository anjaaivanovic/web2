import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { loggedOutGuard } from './guards/logged-out.guard';

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "profile/:id",
    component: ProfileComponent
  },
  {
    path: "recipe/:id",
    component: RecipeComponent
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [loggedOutGuard]
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [loggedOutGuard]
  },
  {
    path: "",
    redirectTo: "home",
     pathMatch: 'full'
  },
  {
    path: "**",
    redirectTo: "home"
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
