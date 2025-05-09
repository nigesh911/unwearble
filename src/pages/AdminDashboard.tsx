import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut, Plus, Save, Trash2, X, Edit, Image } from 'lucide-react';
import { logout } from '../utils/auth';
import { addProduct, deleteProduct, getProducts, updateProduct, testStorageAccess } from '../utils/productStorage';
import { Product } from '../types/product';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [externalLink, setExternalLink] = useState('');
  
  useEffect(() => {
    const initialize = async () => {
      try {
        // Test storage access first
        const hasStorageAccess = await testStorageAccess();
        if (!hasStorageAccess) {
          toast.error('Storage access failed. Please check your Supabase configuration.');
          return;
        }
        
        // Then load products
        await loadProducts();
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Failed to initialize dashboard');
      }
    };

    initialize();
  }, []);
  
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const loadedProducts = await getProducts();
      setProducts(loadedProducts);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/');
  };
  
  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setImage(product.image);
      setExternalLink(product.externalLink);
    } else {
      resetForm();
      setEditingProduct(null);
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    setExternalLink('');
    setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !price || !image || !externalLink) {
      toast.error('All fields are required');
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error('Price must be a positive number');
      return;
    }
    
    try {
      setIsLoading(true);
      if (editingProduct) {
        // Update existing product
        const updatedProduct = {
          ...editingProduct,
          name,
          description,
          price: priceValue,
          image,
          externalLink,
        };
        
        await updateProduct(updatedProduct);
        toast.success('Product updated successfully');
      } else {
        // Add new product
        const newProduct: Product = {
          id: Date.now().toString(),
          name,
          description,
          price: priceValue,
          image,
          externalLink,
          createdAt: new Date().toISOString(),
        };
        
        await addProduct(newProduct);
        toast.success('Product added successfully');
      }
      
      await loadProducts();
      closeModal();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        await deleteProduct(id);
        toast.success('Product deleted successfully');
        await loadProducts();
      } catch (error) {
        toast.error('Failed to delete product');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-jet-black">
      {/* Header */}
      <header className="bg-jet-black border-b border-soft-gray/10 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">
            <span className="text-acid-green">UN</span>
            <span className="text-soft-gray">WEAR</span>
            <span className="text-acid-green">BLE</span>
            <span className="text-soft-gray text-xl ml-2">Admin</span>
          </h1>
          <div className="flex items-center gap-4">
            <a 
              href="https://unwearble.blinkstore.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Visit Store
            </a>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-soft-gray hover:text-acid-green transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Product Management</h2>
          <button 
            onClick={() => openModal()}
            className="btn btn-primary flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
        
        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-soft-gray/20">
                <th className="py-4 px-4 text-left">Image</th>
                <th className="py-4 px-4 text-left">Name</th>
                <th className="py-4 px-4 text-left">Price</th>
                <th className="py-4 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-soft-gray/60">
                    Loading...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map(product => (
                  <tr key={product.id} className="border-b border-soft-gray/10 hover:bg-soft-gray/5">
                    <td className="py-4 px-4">
                      <div className="w-16 h-16 rounded overflow-hidden bg-soft-gray/10">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">{product.name}</td>
                    <td className="py-4 px-4">₹{product.price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => openModal(product)}
                          className="text-soft-gray hover:text-acid-green p-1"
                          aria-label="Edit product"
                          disabled={isLoading}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-soft-gray hover:text-red-500 p-1"
                          aria-label="Delete product"
                          disabled={isLoading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-soft-gray/60">
                    No products found. Click "Add Product" to create your first product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      
      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-jet-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-soft-gray/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-soft-gray/20 p-4">
              <h3 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-soft-gray hover:text-acid-green"
                aria-label="Close modal"
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-soft-gray mb-1">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full"
                  placeholder="Enter product name"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-soft-gray mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input w-full min-h-[100px]"
                  placeholder="Enter product description"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-soft-gray mb-1">
                  Price (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input w-full"
                  placeholder="Enter price"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-soft-gray mb-1">
                  Product Image
                </label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <label 
                      htmlFor="image-upload" 
                      className="btn w-full flex items-center justify-center gap-2 border-2 border-dashed border-soft-gray/40 hover:border-acid-green bg-transparent text-soft-gray hover:text-acid-green cursor-pointer py-8"
                    >
                      <Image size={24} />
                      <span>Click to upload image</span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-soft-gray/60 mt-2">
                      Maximum file size: 2MB. Supported formats: JPG, PNG, WebP
                    </p>
                  </div>
                  {image && (
                    <div className="w-24 h-24 border border-soft-gray/20 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={image} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="externalLink" className="block text-sm font-medium text-soft-gray mb-1">
                  External Link (Blinkstore)
                </label>
                <input
                  id="externalLink"
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="input w-full"
                  placeholder="https://unwearble.blinkstore.in/product/..."
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn border border-soft-gray/30 text-soft-gray hover:border-soft-gray/60"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Save size={18} />
                  <span>{isLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;