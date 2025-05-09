import { Product } from '../types/product';

// Local storage key for products
const PRODUCTS_STORAGE_KEY = 'unwearble_products';

/**
 * Get all products from local storage
 */
export const getProducts = (): Product[] => {
  try {
    const productsJson = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!productsJson) return [];
    return JSON.parse(productsJson) as Product[];
  } catch (error) {
    console.error('Error getting products from local storage:', error);
    return [];
  }
};

/**
 * Add a new product to local storage
 */
export const addProduct = (product: Product): void => {
  try {
    const products = getProducts();
    products.push(product);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error adding product to local storage:', error);
    throw new Error('Failed to add product');
  }
};

/**
 * Update an existing product in local storage
 */
export const updateProduct = (updatedProduct: Product): void => {
  try {
    const products = getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    products[index] = updatedProduct;
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error updating product in local storage:', error);
    throw new Error('Failed to update product');
  }
};

/**
 * Delete a product from local storage
 */
export const deleteProduct = (productId: string): void => {
  try {
    const products = getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filteredProducts));
  } catch (error) {
    console.error('Error deleting product from local storage:', error);
    throw new Error('Failed to delete product');
  }
};

/**
 * Get a product by ID
 */
export const getProductById = (productId: string): Product | null => {
  try {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    return product || null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
};