import React from 'react';
import { Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#080808] pt-16 pb-8 border-t border-soft-gray/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Brand column */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">
              <span className="text-acid-green">UN</span>
              <span className="text-soft-gray">WEAR</span>
              <span className="text-acid-green">BLE</span>
            </h3>
            <p className="text-soft-gray/70 mb-6 max-w-lg">
              Welcome to Unwearble — the T-shirt store made for those men who aren’t afraid to wear thoughts that most people wouldn’t even say out loud. These aren’t just T-shirts — they’re conversations, confessions, or maybe even cautions. Think before you wear. Or don't. We already did.
            </p>
          </div>
          
          {/* Contact column */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-acid-green">Contact Us</h4>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-soft-gray/80">
                <Mail size={16} className="text-acid-green" />
                <span>info@unwearble.com</span>
              </p>
              <p className="text-soft-gray/80">
                69 fashion street near Awnmyd District<br />
                Labib's city, UP 00100
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-soft-gray/10 pt-8 text-center text-soft-gray/60 text-sm">
          <p>&copy; {currentYear} UNWEARBLE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;