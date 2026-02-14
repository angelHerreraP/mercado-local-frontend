import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { UserResponse } from '../../core/models/user.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold mb-2">User Management</h2>
          <p class="text-slate-300">Control access levels and manage system users.</p>
        </div>
        <div class="hidden md:block text-5xl opacity-20">
          🛡️
        </div>
      </div>

      <!-- Users Table Container -->
      <div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        
        <!-- Toolbar -->
        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <span class="font-bold text-slate-700 text-sm uppercase tracking-wide">Registered Users ({{ users.length }})</span>
          <div class="flex gap-2">
            <!-- Placeholder for search/filter if needed -->
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th class="px-6 py-4">User</th>
                <th class="px-6 py-4">Role</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let user of users" class="hover:bg-slate-50 transition-colors group">
                
                <!-- User Info -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-800">{{ user.username }}</p>
                      <p class="text-xs text-slate-400">{{ user.email }}</p>
                    </div>
                  </div>
                </td>

                <!-- Role Badge -->
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        [ngClass]="user.role === 'ROLE_SUPERUSER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                    <span class="w-1.5 h-1.5 rounded-full" 
                          [ngClass]="user.role === 'ROLE_SUPERUSER' ? 'bg-purple-500' : 'bg-blue-500'"></span>
                    {{ user.role === 'ROLE_SUPERUSER' ? 'Administrator' : 'Standard User' }}
                  </span>
                </td>

                <!-- Status (Mock) -->
                <td class="px-6 py-4">
                   <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Active</span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    <button *ngIf="user.role !== 'ROLE_SUPERUSER'" 
                            (click)="changeRole(user, 'ROLE_SUPERUSER')" 
                            class="text-xs font-bold bg-slate-800 text-white hover:bg-purple-600 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                      Promote to Admin
                    </button>

                    <button *ngIf="user.role !== 'ROLE_USER'" 
                            (click)="changeRole(user, 'ROLE_USER')" 
                            class="text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                      Demote to User
                    </button>

                  </div>
                </td>

              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
           <div *ngIf="users.length === 0" class="p-8 text-center text-slate-400">
             No users found.
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
export class AdminComponent implements OnInit {
  users: UserResponse[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error loading users', err)
    });
  }

  changeRole(user: UserResponse, newRole: string) {
    // Elegant confirm (native for now, could be a modal)
    if (confirm(`Are you sure you want to change ${user.username}'s role to ${newRole === 'ROLE_SUPERUSER' ? 'Administrator' : 'Standard User'}?`)) {
      this.userService.updateRole(user.id, newRole).subscribe({
        next: (updatedUser) => {
          user.role = newRole; // Optimistic update or use response
        },
        error: (err) => console.error('Error updating role', err)
      });
    }
  }
}
