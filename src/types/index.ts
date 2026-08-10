export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Variant {
  name: string;        // e.g. "Size"
  options: string[];   // e.g. ["S", "M", "L"]
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  stock: number;
  variants?: Variant[];
  featured: boolean;
  reviews?: Review[];   // ← add this line
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  variant?: string;
  priceAtAdd: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  variant?: string;
  price: number;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  stripePaymentIntentId?: string;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
  createdAt: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  createdAt: number;
}