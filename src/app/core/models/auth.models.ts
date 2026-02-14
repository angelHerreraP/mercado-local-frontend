export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    id: number;
    token: string;
    type: string;
    username: string;
    role: string;
}
