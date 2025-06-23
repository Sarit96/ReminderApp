import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';

export const routes: Routes = [
    { path: '', redirectTo: 'signup', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
];
