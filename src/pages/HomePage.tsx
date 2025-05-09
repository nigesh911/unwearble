import React, { useEffect, useState } from 'react';
import { ChevronRight, ArrowUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/productStorage';
import { Product } from '../types/product';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const loadedProducts = await getProducts();
        // Only show up to 4 products
        setProducts(loadedProducts.slice(0, 4));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-jet-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-jet-black/60 to-jet-black z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 z-20 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-fade-in">
            <span className="text-acid-green">UN</span>
            <span className="text-soft-gray">WEAR</span>
            <span className="text-acid-green">BLE</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-slide-up delay-100">
            Welcome to Unwearble — the T-shirt store for those who like their humor a little darker and their style a little louder. We create graphic tees that bite back, made for men who aren't afraid to wear thoughts that most people wouldn't even say out loud.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
            <a href="#products" className="btn btn-primary">
              Explore Collection
            </a>
            <a 
              href="https://unwearble.blinkstore.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline"
            >
              Visit Store
            </a>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section id="products" className="py-24 bg-jet-black/80">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              <span className="text-acid-green">Featured</span> Collection
            </h2>
            <a 
              href="https://unwearble.blinkstore.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline"
            >
              Visit Store
            </a>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-xl text-soft-gray/70">
                Loading products...
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-soft-gray/70">
                Check back soon for our latest products.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-acid-green text-jet-black p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default HomePage;