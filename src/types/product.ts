export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  externalLink: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ImageUploadEvent extends Event {
  target: HTMLInputElement & EventTarget;
}