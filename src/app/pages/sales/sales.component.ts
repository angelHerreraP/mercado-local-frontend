import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { SalesService } from '../../services/sales/sales.service';
import { ProductResponse } from '../../core/models/product.models';
import { SaleResponse, ProductItemRequest } from '../../core/models/sales.models';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-theme(spacing.24))] flex flex-col md:flex-row gap-6 animate-fade-in">
      
      <!-- Left: Product Selection (POS) -->
      <div class="w-full md:w-2/3 flex flex-col gap-6">
        
        <!-- Search & Filter -->
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
           <div class="relative flex-1">
             <span class="absolute left-3 top-3 text-slate-400">🔍</span>
             <input type="text" [(ngModel)]="searchTerm" placeholder="Search products..." 
               class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition">
           </div>
           <select class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none cursor-pointer">
             <option value="ALL">All Categories</option>
             <option value="COMIDA">Food</option>
             <option value="BEBIDA">Drinks</option>
           </select>
        </div>

        <!-- Products Grid -->
        <div class="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
           <div *ngFor="let p of filteredProducts()" 
                (click)="addToCart(p)"
                class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group relative overflow-hidden">
                
                <div class="absolute top-2 right-2 flex flex-col gap-1 items-end">
                   <span class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full" 
                        [ngClass]="getTypeColor(p.type)">
                     {{ p.type }}
                   </span>
                   <span *ngIf="p.stock < 10" class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 animate-pulse">
                     Low Stock
                   </span>
                </div>

                <div class="h-20 flex items-center justify-center text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {{ getIconForType(p.type) }}
                </div>
                
                <h3 class="font-bold text-slate-700 text-sm leading-tight mb-1">{{ p.productName }}</h3>
                <div class="flex justify-between items-center mt-2">
                   <span class="text-lg font-bold text-blue-600">\${{ p.price }}</span>
                   <span class="text-xs text-slate-400">{{ p.stock }} left</span>
                </div>
           </div>
        </div>

      </div>

      <!-- Right: Cart & Checkout -->
      <div class="w-full md:w-1/3 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden">
        
        <!-- Cart Header -->
        <div class="p-5 border-b border-slate-100 bg-slate-50">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            🛒 Current Order
            <span *ngIf="cart.length > 0" class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{{ cartItemCount }}</span>
          </h2>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          
          <div *ngIf="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <span class="text-4xl mb-2">🛍️</span>
            <p>Cart is empty</p>
          </div>

          <div *ngFor="let item of cart; let i = index" class="flex items-center gap-3 bg-slate-50 p-3 rounded-xl animate-slide-in">
             <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl shadow-sm">
               {{ getIconForType(getProductType(item.productName)) }}
             </div>
             <div class="flex-1 min-w-0">
               <h4 class="font-bold text-slate-700 text-sm truncate">{{ item.productName }}</h4>
               <p class="text-xs text-slate-500">\${{ getUnitPrice(item.productName) }} x {{ item.quantity }}</p>
             </div>
             <div class="flex items-center gap-2">
                <span class="font-bold text-slate-800">\${{ (getUnitPrice(item.productName) * item.quantity).toFixed(2) }}</span>
                <button (click)="removeFromCart(i)" class="text-slate-300 hover:text-red-500 transition px-1">✕</button>
             </div>
          </div>
        </div>

        <!-- Totals & Actions -->
        <div class="p-6 bg-slate-50 border-t border-slate-200">
          
          <div class="flex justify-between items-center mb-4">
            <span class="text-slate-500">Subtotal</span>
            <span class="font-bold text-slate-800 text-lg">\${{ cartTotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center mb-6">
            <span class="text-slate-500">Tax (8%)</span>
            <span class="font-bold text-slate-800">\${{ (cartTotal * 0.08).toFixed(2) }}</span>
          </div>
          
          <div class="flex justify-between items-center mb-6 pt-4 border-t border-slate-200">
            <span class="text-lg font-bold text-slate-800">Total</span>
            <span class="text-3xl font-extrabold text-blue-600">\${{ (cartTotal * 1.08).toFixed(2) }}</span>
          </div>

          <button (click)="checkout()" [disabled]="cart.length === 0 || isProcessing"
             class="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
             [ngClass]="cart.length > 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-200' : 'bg-slate-300'">
             <span *ngIf="!isProcessing">Complete Sale</span>
             <span *ngIf="!isProcessing">➔</span>
             <div *ngIf="isProcessing" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          </button>
          
          <p *ngIf="message" class="text-center text-sm font-medium mt-3" 
             [ngClass]="messageType === 'success' ? 'text-emerald-600' : 'text-red-500'">
            {{ message }}
          </p>
        </div>

      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    
    @keyframes slideIn { from { transform: translateX(10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .animate-slide-in { animation: slideIn 0.2s ease-out forwards; }
  `]
})
export class SalesComponent implements OnInit {
  availableProducts: ProductResponse[] = [];
  searchTerm: string = '';
  cart: ProductItemRequest[] = [];
  isProcessing = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private productService: ProductService,
    private salesService: SalesService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => this.availableProducts = data);
  }

  filteredProducts() {
    return this.availableProducts.filter(p =>
      p.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addToCart(product: ProductResponse) {
    if (product.stock <= 0) return;

    const existingItem = this.cart.find(item => item.productName === product.productName);

    // Check if adding more exceeds stock
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    if (currentQtyInCart + 1 > product.stock) {
      this.showMessage('Not enough stock available', 'error');
      return;
    }

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({
        productName: product.productName,
        quantity: 1
      });
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  checkout() {
    if (this.cart.length === 0) return;
    this.isProcessing = true;

    this.salesService.createSale({ items: this.cart }).subscribe({
      next: (response) => {
        this.showMessage('Sale completed successfully!', 'success');
        this.cart = [];
        this.loadProducts(); // Update stock
        this.isProcessing = false;
      },
      error: (err) => {
        console.error('Sale failed', err);
        this.showMessage('Error processing sale. Try again.', 'error');
        this.isProcessing = false;
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }

  // Helpers for UI
  get cartTotal(): number {
    return this.cart.reduce((total, item) => {
      const price = this.getUnitPrice(item.productName);
      return total + (price * item.quantity);
    }, 0);
  }

  get cartItemCount(): number {
    return this.cart.reduce((acc, item) => acc + item.quantity, 0);
  }

  getUnitPrice(productName: string): number {
    const product = this.availableProducts.find(p => p.productName === productName);
    return product ? product.price : 0;
  }

  getProductType(productName: string): string {
    const product = this.availableProducts.find(p => p.productName === productName);
    return product ? product.type : '';
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'COMIDA': return '🍔';
      case 'BEBIDA': return '🥤';
      default: return '📦';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'COMIDA': return 'bg-orange-100 text-orange-700';
      case 'BEBIDA': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
