import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  form;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: any) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword && confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
    }
    
    return null;
  }

  onSubmit() {
    this.error = null;
    if (this.form.valid) {
      const { confirmPassword, ...userData } = this.form.value as { name: string; email: string; password: string; confirmPassword: string };
      this.auth.signup(userData).subscribe({
        next: () => {
          alert('Signup successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err: { message: string; }) => {
          this.error = err.message || 'Signup failed';
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
