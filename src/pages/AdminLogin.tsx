import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { isAuthenticated, login } from '../utils/auth';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Using setTimeout to simulate network request
    setTimeout(() => {
      const success = login(email, password);
      
      if (success) {
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-jet-black flex items-center justify-center p-4">
      <div className="card max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-serif font-bold mb-2">
            <span className="text-acid-green">UN</span>
            <span className="text-soft-gray">WEAR</span>
            <span className="text-acid-green">BLE</span>
          </h1>
          <p className="text-soft-gray/70">Admin Login</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-soft-gray mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-soft-gray mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-soft-gray/70 hover:text-acid-green"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-jet-black border-t-transparent rounded-full"></span>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-acid-green hover:underline">
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;