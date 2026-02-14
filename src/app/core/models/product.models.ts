export interface ProductResponse {
    id: number;
    productName: string;
    description: string;
    type: string; // 'COMIDA' | 'BEBIDA' | 'OTRO'
    stock: number;
    price: number;
    imageUrl?: string;
}

export interface AddProductRequest {
    name: string;
    productType: string;
    descripcion: string;
    precio: number;
    stock: number;
}
