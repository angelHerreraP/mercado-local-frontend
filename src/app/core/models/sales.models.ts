export interface ProductItemRequest {
    productName: string;
    quantity: number;
}

export interface SaleRequest {
    items: ProductItemRequest[];
}

export interface ProductSummary {
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface SaleResponse {
    userId: number;
    products: ProductSummary[];
    total: number;
    timestamp: string;
    ticketUrl: string;
    message: string;
}
