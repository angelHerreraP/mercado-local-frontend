import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div class="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        <!-- Left Side: Branding / Image -->
        <div class="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 p-10 text-white flex flex-col justify-center items-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-20">
             <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
             </svg>
          </div>
          <h1 class="text-4xl font-extrabold mb-4 relative z-10 tracking-tight">AWS Final Project</h1>
          <p class="text-blue-100 text-center relative z-10 font-light">
            Manage your inventory, sales, and users with a premium experience.
          </p>
        </div>

        <!-- Right Side: Login Form -->
        <div class="w-full md:w-1/2 p-8 md:p-12">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p class="text-gray-500 text-sm mt-2">Please sign in to your account</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 tracking-wide">Username</label>
              <input 
                type="text" 
                formControlName="username"
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none"
                placeholder="Enter your username"
              >
              <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="text-red-500 text-xs mt-1">
                Username is required
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="text-sm font-medium text-gray-700 tracking-wide">Password</label>
              </div>
              <input 
                type="password" 
                formControlName="password"
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none"
                placeholder="••••••••"
              >
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-red-500 text-xs mt-1">
                Password is required
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember_me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="remember_me" class="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div class="text-sm">
                <a href="#" class="font-medium text-blue-600 hover:text-blue-500 hover:underline">Forgot password?</a>
              </div>
            </div>

            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading"
              class="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading" class="animate-pulse">Signing in...</span>
            </button>
            
            <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm relative" role="alert">
                <p>{{ errorMessage }}</p>
            </div>
          </form> 

          <div class="mt-8 text-center text-gray-600 text-sm">
            Don't have an account? 
            <a routerLink="/register" class="text-blue-600 hover:text-blue-500 font-semibold hover:underline">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl('/');
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Login error', err);
          this.errorMessage = 'Invalid username or password';
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
