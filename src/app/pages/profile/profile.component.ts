import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { UserResponse } from '../../core/models/user.models';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div class="h-32 bg-gradient-to-r from-[#ffe600] to-[#fff159]"></div>
        <div class="px-6 pb-6 relative">
          <div class="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-4xl text-slate-500 font-bold shadow-md">
            {{ user?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="ml-40 pt-2">
            <h1 class="text-2xl font-bold text-slate-800">{{ user?.username }}</h1>
            <p class="text-slate-500 text-sm">{{ user?.email }}</p>
            <div class="mt-2 flex gap-2">
               <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold" *ngIf="user?.role === 'ROLE_SUPERUSER'">Administrador</span>
               <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Nivel 6 - Mercado Puntos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- User Details Card -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-bold text-slate-800 mb-4">Datos personales</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs text-slate-500 uppercase font-bold mb-1">Nombre de usuario</label>
            <p class="text-slate-800 font-medium bg-slate-50 p-3 rounded border border-slate-100">{{ user?.username }}</p>
          </div>
          <div>
             <label class="block text-xs text-slate-500 uppercase font-bold mb-1">Email</label>
             <p class="text-slate-800 font-medium bg-slate-50 p-3 rounded border border-slate-100">{{ user?.email }}</p>
          </div>
          <div>
             <label class="block text-xs text-slate-500 uppercase font-bold mb-1">ID de Usuario</label>
             <p class="text-slate-800 font-medium bg-slate-50 p-3 rounded border border-slate-100">#{{ user?.id }}</p>
          </div>
          <div>
             <label class="block text-xs text-slate-500 uppercase font-bold mb-1">Estado</label>
             <p class="text-emerald-600 font-bold bg-emerald-50 p-3 rounded border border-emerald-100">Activo</p>
          </div>
        </div>
      </div>

    </div>
  `,
    styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
  `]
})
export class ProfileComponent implements OnInit {
    user: UserResponse | null = null;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getMe().subscribe({
            next: (data) => this.user = data,
            error: (err) => console.error('Error fetching profile', err)
        });
    }
}
