import { supabase } from './supabase';
import { Product } from '../types/product';

// Local storage key for products
const PRODUCTS_STORAGE_KEY = 'unwearble_products';

// Test function to verify storage access
export const testStorageAccess = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('product-images')
      .list();

    if (error) {
      console.error('Storage access test failed:', error);
      return false;
    }

    console.log('Storage access test successful:', data);
    return true;
  } catch (error) {
    console.error('Storage access test error:', error);
    return false;
  }
};

/**
 * Get all products from local storage
 */
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Transform the data to match our frontend type
  const transformedData = data?.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    externalLink: item.external_link,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) || [];

  return transformedData;
};

/**
 * Add a new product to local storage
 */
export const addProduct = async (product: Product): Promise<void> => {
  try {
    // First upload the image to Supabase Storage
    const imageFile = dataURLtoFile(product.image, `${product.id}.jpg`);
    
    // Upload the image directly to the bucket
    const { data: imageData, error: imageError } = await supabase.storage
      .from('product-images')
      .upload(`${product.id}.jpg`, imageFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (imageError) {
      console.error('Error uploading image:', imageError);
      throw new Error(`Failed to upload image: ${imageError.message}`);
    }

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(`${product.id}.jpg`);

    // Then save the product data with the image URL
    const { error: insertError } = await supabase
      .from('products')
      .insert([{
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: publicUrl,
        external_link: product.externalLink,
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      // If product insert fails, try to delete the uploaded image
      await supabase.storage
        .from('product-images')
        .remove([`${product.id}.jpg`]);
        
      console.error('Error adding product:', insertError);
      throw new Error(`Failed to add product: ${insertError.message}`);
    }
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw error;
  }
};

/**
 * Update an existing product in local storage
 */
export const updateProduct = async (product: Product): Promise<void> => {
  try {
    // If the image has changed, upload the new image
    if (product.image.startsWith('data:')) {
      const imageFile = dataURLtoFile(product.image, `${product.id}.jpg`);
      const { error: imageError } = await supabase.storage
        .from('product-images')
        .update(`${product.id}.jpg`, imageFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (imageError) {
        console.error('Error updating image:', imageError);
        throw new Error(`Failed to update image: ${imageError.message}`);
      }

      // Get the public URL for the updated image
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(`${product.id}.jpg`);

      product.image = publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        external_link: product.externalLink,
        updated_at: new Date().toISOString()
      })
      .eq('id', product.id);

    if (error) {
      console.error('Error updating product:', error);
      throw new Error(`Failed to update product: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};

/**
 * Delete a product from local storage
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    // First delete the image from storage
    const { error: imageError } = await supabase.storage
      .from('product-images')
      .remove([`${id}.jpg`]);

    if (imageError) {
      console.error('Error deleting image:', imageError);
      // Continue with product deletion even if image deletion fails
    }

    // Then delete the product data
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
};

/**
 * Get a product by ID
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error getting product by ID:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Transform to match frontend type
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      externalLink: data.external_link,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
};

// Helper function to convert base64 to File object
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}