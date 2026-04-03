import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-amber-900 to-orange-800 border-t border-amber-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-amber-100 mb-4">
              About MCK Foods
            </h3>
            <p className="text-amber-50/80">
              Premium quality health food products including Ragi-based powders, Dal powders, and natural banana powder. Committed to providing nutritious and wholesome food for your family.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-100 mb-4">
              Quick Links
            </h3>
            <div className="text-amber-50/80 space-y-2">
              <Link to="/" className="block hover:text-amber-100 transition-colors">
                Home
              </Link>
              <Link to="/" className="block hover:text-amber-100 transition-colors">
                All Products
              </Link>
              <Link to="/wishlist" className="block hover:text-amber-100 transition-colors">
                Wishlist
              </Link>
              <Link to="/cart" className="block hover:text-amber-100 transition-colors">
                Shopping Cart
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-100 mb-4">
              Information
            </h3>
            <div className="text-amber-50/80 space-y-2">
              <Link to="/policy/terms-conditions" className="block hover:text-amber-100 transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/policy/privacy-policy" className="block hover:text-amber-100 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/policy/refund-returns-policy" className="block hover:text-amber-100 transition-colors">
                Refund and Returns Policy
              </Link>
              <Link to="/policy/shipping-policy" className="block hover:text-amber-100 transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-100 mb-4">
              Contact Information
            </h3>
            <div className="text-amber-50/80 space-y-2">
              <p>Email: mckfoods@gmail.com</p>
              <p>Phone: +91 94434 59811</p>
              <p>Support Hours: Mon-Sat, 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-amber-700 text-center text-amber-50/80">
          <p>© 2025 MCK Foods. All rights reserved. Licensed by MCK Foods Private Limited.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
