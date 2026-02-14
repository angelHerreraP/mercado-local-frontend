import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../services/sales/sales.service';
import { SaleResponse } from '../../core/models/sales.models';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-slate-800">Mis compras</h1>
        <div class="relative">
          <input type="text" placeholder="Buscar en mis compras" class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64">
          <span class="absolute left-3 top-2.5 text-slate-400">🔍</span>
        </div>
      </div>

      <!-- Purchase List -->
      <div class="space-y-4">
        
        <div *ngFor="let sale of sales" class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
          
          <!-- Card Header -->
          <div class="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center text-sm">
             <div class="text-slate-500">
               {{ sale.timestamp | date:'longDate' }}
             </div>
             <div class="font-bold text-slate-700">
               Total: \${{ sale.total }}
             </div>
          </div>

          <!-- Card Body -->
          <div class="p-6">
            <div *ngFor="let product of sale.products" class="flex items-center gap-4 mb-4 last:mb-0">
               <div class="w-16 h-16 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-2xl">
                 📦
               </div>
               <div class="flex-1">
                 <h3 class="font-medium text-slate-800 hover:text-blue-600 cursor-pointer">{{ product.productName }}</h3>
                 <p class="text-sm text-slate-500">{{ product.quantity }} unidad(es)</p>
               </div>
               <div class="text-right">
                  <a [href]="sale.ticketUrl" target="_blank" class="text-blue-600 text-sm font-medium hover:underline">Ver compra</a>
                  <br>
                  <button class="text-slate-400 text-sm hover:text-blue-600">Volver a comprar</button>
               </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
             <button class="text-blue-600 text-sm font-medium hover:bg-blue-50 px-4 py-2 rounded transition">Ver detalle</button>
          </div>

        </div>

        <!-- Empty State -->
        <div *ngIf="sales.length === 0 && !isLoading" class="bg-white rounded-lg p-12 text-center border border-dashed border-slate-300">
           <div class="text-6xl mb-4 grayscale opacity-30">🛍️</div>
           <h3 class="text-lg font-bold text-slate-700">No tienes compras recientes</h3>
           <p class="text-slate-500 mb-6">¡Descubre productos increíbles y haz tu primera compra!</p>
           <button class="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition shadow">Ir a comprar</button>
        </div>

        <!-- Loading -->
        <div *ngIf="isLoading" class="flex justify-center py-12">
           <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>

      </div>

    </div>
  `,
    styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
  `]
})
export class HistoryComponent implements OnInit {
    sales: SaleResponse[] = [];
    isLoading = true;

    constructor(
        private salesService: SalesService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        const userId = this.authService.currentUserValue?.id;

        if (userId) {
            this.salesService.getUserSales(userId).subscribe({
                next: (data) => {
                    this.sales = data;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error fetching sales history', err);
                    this.isLoading = false;
                }
            });
        } else {
            console.warn('User ID not found');
            this.isLoading = false;
        }
    }
}
