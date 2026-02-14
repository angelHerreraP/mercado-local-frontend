import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div class="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
        
        <!-- Right Side: Branding / Image -->
        <div class="w-full md:w-1/2 bg-gradient-to-br from-indigo-900 to-purple-800 p-10 text-white flex flex-col justify-center items-center relative overflow-hidden">
           <div class="absolute inset-0 opacity-20">
             <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <circle cx="50" cy="50" r="40" stroke="white" stroke-width="2" fill="none" />
               <path d="M0 100 L 100 0" stroke="white" stroke-width="1" />
             </svg>
          </div>
          <h1 class="text-4xl font-extrabold mb-4 relative z-10 tracking-tight">Join Us Today</h1>
          <p class="text-indigo-200 text-center relative z-10 font-light">
            Create an account to start managing your business efficiently.
          </p>
        </div>

        <!-- Left Side: Register Form -->
        <div class="w-full md:w-1/2 p-8 md:p-12">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800">Create Account</h2>
            <p class="text-gray-500 text-sm mt-2">Fill in your details to get started</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 tracking-wide">Username</label>
              <input 
                type="text" 
                formControlName="username"
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition duration-200 outline-none"
                placeholder="Choose a username"
              >
              <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="text-red-500 text-xs mt-1">
                Username is required
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 tracking-wide">Email</label>
              <input 
                type="email" 
                formControlName="email"
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition duration-200 outline-none"
                placeholder="you@example.com"
              >
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-red-500 text-xs mt-1">
                Valid email is required
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 tracking-wide">Password</label>
              <input 
                type="password" 
                formControlName="password"
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition duration-200 outline-none"
                placeholder="••••••••"
              >
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-red-500 text-xs mt-1">
                Password is required (min 6 chars)
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 tracking-wide">Full Name</label>
              <input 
                type="text" 
                formControlName="fullName"
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition duration-200 outline-none"
                placeholder="John Doe"
              >
               <!-- FullName is optional in original DTO? Checking... assuming optional or text field -->
            </div>

            <button 
              type="submit" 
              [disabled]="registerForm.invalid || isLoading"
              class="w-full flex justify-center bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Register</span>
              <span *ngIf="isLoading" class="animate-pulse">Creating account...</span>
            </button>
            
            <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm relative" role="alert">
                <p>{{ errorMessage }}</p>
            </div>
          </form> 

          <div class="mt-8 text-center text-gray-600 text-sm">
            Already have an account? 
            <a routerLink="/login" class="text-purple-600 hover:text-purple-500 font-semibold hover:underline">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Registration error', err);
          this.errorMessage = 'Registration failed. Try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
