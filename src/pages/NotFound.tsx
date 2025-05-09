import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-jet-black flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4">
          <span className="text-acid-green">4</span>
          <span className="text-soft-gray">0</span>
          <span className="text-acid-green">4</span>
        </h1>
        <p className="text-2xl text-soft-gray mb-8">Page not found</p>
        <Link to="/" className="btn btn-outline inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;