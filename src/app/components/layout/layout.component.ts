import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-100 font-sans flex flex-col">
      
      <!-- MercadoLibre Style Header -->
      <header class="bg-[#ffe600] p-3 shadow-md z-50">
        <div class="container mx-auto max-w-6xl px-4">
          
          <!-- Top Row: Logo + Search + Menu -->
          <div class="flex items-center gap-6 h-12">
            
            <!-- Logo -->
            <a routerLink="/" class="flex-shrink-0">
               <span class="font-extrabold text-[#2d3277] text-2xl tracking-tighter">MercadoLocal<span class="text-xl font-normal">Mx</span></span>
            </a>

            <!-- Search Bar -->
            <div class="flex-1 relative hidden md:block">
              <input type="text" placeholder="Buscar productos, marcas y más..." 
                class="w-full py-2.5 px-4 rounded shadow-sm border-none focus:outline-none placeholder-gray-300 text-gray-700">
              <button class="absolute right-0 top-0 h-full px-3 text-slate-400 border-l border-slate-100">
                🔍
              </button>
            </div>

            <!-- Promotion / Ad (Hidden on mobile) -->
            <div class="hidden lg:block text-slate-700 text-sm w-48 text-right">
              <span class="block">Nivel 6</span>
              <span class="text-xs">Disney+ y Star+ incluidos</span>
            </div>
            
            <!-- Hamburger (Mobile) -->
             <button (click)="isSidebarOpen = !isSidebarOpen" class="md:hidden text-slate-700">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
             </button>

          </div>

          <!-- Bottom Row: Navigation -->
          <div class="flex items-end justify-between mt-2 pt-1">
             
             <!-- Location (Mock) -->
             <div class="hidden md:flex items-center gap-1 text-slate-700 text-sm hover:border-slate-200 border border-transparent rounded px-2 py-1 transition cursor-pointer">
               <span class="text-lg">📍</span>
               <div class="flex flex-col leading-none">
                 <span class="text-[10px] text-slate-500">Ingresa tu</span>
                 <span class="text-xs font-semibold">Ubicación</span>
               </div>
             </div>

             <!-- Nav Links -->
             <nav class="hidden md:flex gap-4 text-sm text-slate-600/90 items-center">
               <a routerLink="/products" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 cursor-pointer">Categorías</a>
               <a routerLink="/sales" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 cursor-pointer">Ofertas</a>
               <a routerLink="/history" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 cursor-pointer">Historial</a>
               <a routerLink="/products" class="hover:text-slate-900 cursor-pointer">Supermercado</a>
               <a routerLink="/products" class="hover:text-slate-900 cursor-pointer">Moda</a>
               <a routerLink="/products" class="hover:text-slate-900 cursor-pointer">Vender</a>
               <a routerLink="/products" class="hover:text-slate-900 cursor-pointer">Ayuda</a>
             </nav>

             <!-- User Menu -->
             <div class="hidden md:flex gap-4 text-sm text-slate-700 items-center">
               
               <div class="relative group cursor-pointer flex items-center gap-1">
                  <div class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {{ getUserInitial() }}
                  </div>
                  <span>{{ getUsername() }}</span>
                  <span class="text-[10px] transform group-hover:rotate-180 transition">▼</span>
                  
                  <!-- Dropdown -->
                  <div class="absolute right-0 top-full mt-1 w-48 bg-white shadow-xl rounded-lg hidden group-hover:block border border-slate-100 overflow-hidden">
                    <div class="p-3 bg-slate-50 border-b border-slate-100">
                      <p class="font-bold text-slate-800">Hola {{ getUsername() }}</p>
                      <p class="text-xs text-slate-500">Nivel 1 - Mercado Puntos</p>
                    </div>
                    <a routerLink="/profile" class="block px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition">Mi Perfil</a>
                    <a routerLink="/dashboard" class="block px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition">Compras</a>
                    <a *ngIf="isAdmin()" routerLink="/admin" class="block px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition">Administración</a>
                    <div class="border-t border-slate-100 my-1"></div>
                    <button (click)="logout()" class="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition">Salir</button>
                  </div>
               </div>

               <a routerLink="/dashboard" class="hover:text-slate-900 cursor-pointer">Mis compras</a>
               <a routerLink="/dashboard" class="hover:text-slate-900 cursor-pointer">Favoritos</a>
               <a routerLink="/sales" class="hover:text-slate-900 cursor-pointer">🔔</a>
               <a routerLink="/sales" class="hover:text-slate-900 cursor-pointer">🛒</a>
             </div>
          </div>

        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 container mx-auto max-w-6xl px-4 py-6">
        <!-- Mobile Sidebar Overlay -->
        <div *ngIf="isSidebarOpen" (click)="isSidebarOpen = false" class="fixed inset-0 bg-black/50 z-50 md:hidden"></div>
        
        <!-- Mobile Sidebar -->
        <div class="fixed inset-y-0 left-0 bg-white w-64 z-50 transform transition-transform duration-300 md:hidden shadow-2xl"
             [class.-translate-x-full]="!isSidebarOpen">
           <div class="h-24 bg-[#ffe600] px-4 flex flex-col justify-center">
             <div class="flex items-center gap-3">
               <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-lg">
                 {{ getUserInitial() }}
               </div>
               <div>
                 <p class="font-bold text-slate-800 text-sm">Hola {{ getUsername() }}</p>
                 <p class="text-xs text-slate-600">Nivel 1 - Mercado Puntos</p>
               </div>
             </div>
           </div>
           <nav class="p-4 space-y-4">
             <a routerLink="/" (click)="isSidebarOpen=false" class="block text-slate-700 font-medium">Inicio</a>
             <a routerLink="/products" (click)="isSidebarOpen=false" class="block text-slate-700 font-medium">Buscar Productos</a>
             <a routerLink="/sales" (click)="isSidebarOpen=false" class="block text-slate-700 font-medium">Mis Ofertas</a>
             <a routerLink="/dashboard" (click)="isSidebarOpen=false" class="block text-slate-700 font-medium">Historial de Compras</a>
             <div *ngIf="isAdmin()" class="pt-4 border-t border-slate-100">
               <a routerLink="/admin" (click)="isSidebarOpen=false" class="block text-blue-600 font-bold">Panel Admin</a>
             </div>
             <button (click)="logout()" class="w-full text-left text-red-500 font-medium pt-4 mt-auto">Cerrar Sesión</button>
           </nav>
        </div>

        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-400">
         <div class="container mx-auto">
           <p class="mb-2">Copyright © 1999-2026 MercadoLocal Mx S.R.L.</p>
           <p>Calle Falsa 123, Piso 4, CP 12345, CDMX, México</p>
         </div>
      </footer>

    </div>
  `,
  styles: []
})
export class LayoutComponent {
  isSidebarOpen = false;

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isSidebarOpen = false;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUsername(): string {
    return this.authService.getUsername();
  }

  getUserInitial(): string {
    return this.getUsername().charAt(0).toUpperCase();
  }
}
