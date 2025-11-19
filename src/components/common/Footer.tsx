import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              About MCK Foods
            </h3>
            <p className="text-gray-600">
              Premium quality health food products including Ragi-based powders, Dal powders, and natural banana powder. Committed to providing nutritious and wholesome food for your family.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              Contact Information
            </h3>
            <div className="text-gray-600 space-y-2">
              <p>Email: info@mckfoods.com</p>
              <p>Phone: +91 XXXXXXXXXX</p>
              <p>Support Hours: Mon-Sat, 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              Quick Links
            </h3>
            <div className="text-gray-600 space-y-2">
              <p>All products are made with natural ingredients</p>
              <p>Free delivery on orders above ₹500</p>
              <p>100% quality guaranteed</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-amber-200 text-center text-gray-600">
          <p>2025 MCK Foods</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
