import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.error = null;
    if (this.form.valid) {
      const formValue = this.form.value as { email: string; password: string };
      this.auth.login(formValue).subscribe({
        next: () => {
          alert('Login successful!');
          this.router.navigate(['/home']);
        },
        error: (err: { message: string }) => {
          this.error = err.message || 'Login failed';
        },
      });
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
