export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  externalLink: string;
  createdAt: string;
}

export interface ImageUploadEvent extends Event {
  target: HTMLInputElement & EventTarget;
}