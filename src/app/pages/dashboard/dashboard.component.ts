import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div class="absolute right-0 top-0 h-full w-1/2 bg-white opacity-5 transform skew-x-12"></div>
        <div class="relative z-10">
          <h1 class="text-3xl font-bold mb-2">Welcome back, {{ username }}! 👋</h1>
          <p class="text-blue-100">Here's what's happening with your store today.</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Total Sales -->
        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
              💰
            </div>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 class="text-slate-500 text-sm font-medium">Total Sales</h3>
          <p class="text-2xl font-bold text-slate-800">$24,500</p>
        </div>

        <!-- Total Products -->
        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
           <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              📦
            </div>
            <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <h3 class="text-slate-500 text-sm font-medium">Total Products</h3>
          <p class="text-2xl font-bold text-slate-800">1,240</p>
        </div>

        <!-- New Orders -->
        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
           <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
              🛒
            </div>
            <span class="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">+5 today</span>
          </div>
          <h3 class="text-slate-500 text-sm font-medium">New Orders</h3>
          <p class="text-2xl font-bold text-slate-800">45</p>
        </div>

        <!-- Users -->
        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
           <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
              👥
            </div>
          </div>
          <h3 class="text-slate-500 text-sm font-medium">Total Users</h3>
          <p class="text-2xl font-bold text-slate-800">892</p>
        </div>

      </div>

      <!-- Recent Activity Section (Placeholder) -->
      <h2 class="text-xl font-bold text-slate-800 mt-8 mb-4">Recent Activity</h2>
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 text-center text-slate-500">
          <p>No recent activity to display.</p>
        </div>
      </div>
    
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
  `]
})
export class DashboardComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.username = this.authService.getUsername();
  }
}
