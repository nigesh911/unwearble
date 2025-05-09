import React from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card group">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-[4/3] bg-soft-gray/10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      {/* Product Info */}
      <h3 className="text-xl font-medium mb-2">{product.name}</h3>
      <p className="text-soft-gray/70 mb-4 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xl font-medium text-acid-green">₹{product.price.toFixed(2)}</span>
        <a
          href={product.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex items-center gap-2 py-2 text-sm"
        >
          <ShoppingBag size={16} />
          <span>Buy Now</span>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;