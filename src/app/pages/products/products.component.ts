import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ProductResponse } from '../../core/models/product.models';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded shadow-sm">
        <h2 class="text-xl font-medium text-slate-800">Búsquedas recientes</h2>
        <button *ngIf="isAdmin()" (click)="toggleForm()" 
          class="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors shadow-sm text-sm">
          {{ showForm ? 'Cancelar' : 'Vender Producto' }}
        </button>
      </div>

      <!-- Add Product Form (Admin Only) -->
      <div *ngIf="showForm && isAdmin()" class="bg-white p-6 rounded shadow-md border border-slate-200 animate-slide-in">
        <h3 class="text-lg font-medium mb-4 text-slate-800">Nuevo Producto</h3>
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div class="space-y-2">
            <label class="text-sm text-slate-500">Nombre del producto</label>
            <input formControlName="name" class="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none transition" placeholder="Ej. Samsung Galaxy S23">
          </div>
          
          <div class="space-y-2">
            <label class="text-sm text-slate-500">Categoría</label>
            <select formControlName="productType" class="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none transition bg-white">
              <option value="COMIDA">Comida</option>
              <option value="BEBIDA">Bebida</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          
          <div class="md:col-span-2 space-y-2">
            <label class="text-sm text-slate-500">Descripción</label>
            <textarea formControlName="descripcion" rows="3" class="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none transition" placeholder="Detalles del producto..."></textarea>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm text-slate-500">Precio ($)</label>
            <input type="number" formControlName="precio" class="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none transition" placeholder="0.00">
          </div>
          
          <div class="space-y-2">
            <label class="text-sm text-slate-500">Stock disponible</label>
            <input type="number" formControlName="stock" class="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none transition" placeholder="0">
          </div>

          <!-- Image Upload -->
          <div class="md:col-span-2 space-y-2">
            <label class="text-sm text-slate-500">Imágenes</label>
            <div class="flex items-center gap-4">
               <div class="relative w-24 h-24 border-2 border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden group transition">
                 <input type="file" (change)="onFileSelected($event)" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*">
                 <span *ngIf="!imagePreview" class="text-2xl text-slate-400 group-hover:scale-110 transition">+</span>
                 <img *ngIf="imagePreview" [src]="imagePreview" class="w-full h-full object-cover">
                 <div *ngIf="isUploading" class="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
               </div>
               <div class="text-xs text-slate-400">
                  <p>Formatos: JPG, PNG</p>
                  <p>Sube una foto clara de tu producto.</p>
               </div>
            </div>
            <input type="hidden" formControlName="imageUrl">
          </div>

          <div class="md:col-span-2 flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" [disabled]="productForm.invalid || isSubmitting || isUploading" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting ? 'Publicando...' : 'Publicar' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Product Grid (MercadoLibre Style) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        
        <div *ngFor="let product of products" class="bg-white rounded shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-slate-100 group flex flex-col h-full cursor-pointer">
          
          <!-- Image -->
          <div class="h-56 relative bg-white border-b border-slate-50 flex items-center justify-center p-4">
             <img *ngIf="product.imageUrl" [src]="product.imageUrl" class="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300">
             <span *ngIf="!product.imageUrl" class="text-4xl opacity-20 filter grayscale">{{ getIconForType(product.type) }}</span>
             
             <div *ngIf="product.type === 'COMIDA' || product.type === 'BEBIDA'" 
                  class="absolute top-2 left-2 bg-[#fee600] text-xs font-bold px-2 py-0.5 rounded text-slate-800">
               FULL
             </div>
          </div>

          <!-- Content -->
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="text-3xl font-normal text-slate-800 mb-1">\${{ product.price }}</h3>
            <p class="text-xs text-[#00a650] font-semibold mb-2" *ngIf="product.price > 50">Envío gratis</p>
            <h4 class="text-sm font-light text-slate-600 line-clamp-2 leading-snug mb-4 group-hover:text-blue-600 transition-colors">{{ product.productName }}</h4>
            
            <div class="mt-auto pt-2 text-xs text-slate-400 font-light flex justify-between items-center">
               <span>Por MercadoLocal</span>
               <span>Stock: {{ product.stock }}</span>
            </div>
          </div>

        </div>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="products.length === 0 && !isLoading" class="text-center py-20">
        <div class="text-6xl mb-4 grayscale opacity-30">🔍</div>
        <h3 class="text-xl font-medium text-slate-600">No encontramos productos</h3>
        <p class="text-slate-400 mt-2">Intenta revisar la red o agrega uno nuevo.</p>
      </div>

       <!-- Loading State -->
       <div *ngIf="isLoading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
       </div>

    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: ProductResponse[] = [];
  productForm: FormGroup;
  showForm = false;
  isLoading = true;
  isSubmitting = false;
  isUploading = false;
  imagePreview: string | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      productType: ['OTRO', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false;
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      // Show preview
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);

      // Upload to Backend -> S3
      this.productService.uploadImage(file).subscribe({
        next: (response) => {
          this.productForm.patchValue({ imageUrl: response.url });
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Error uploding file', err);
          this.isUploading = false;
          alert('Error al subir imagen. Intenta de nuevo.');
        }
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      this.productService.addProduct(this.productForm.value).subscribe({
        next: () => {
          this.loadProducts();
          this.showForm = false;
          this.productForm.reset({ productType: 'OTRO', precio: 0, stock: 0 });
          this.imagePreview = null;
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error adding product', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'COMIDA': return '🍔';
      case 'BEBIDA': return '🥤';
      default: return '📦';
    }
  }
}
