# E-commerce Website Requirements Document

## 1. Website Overview

### 1.1 Website Name
Ragi Products Online Store

### 1.2 Website Description\nAn e-commerce platform for selling health food products including Ragi Milk Powder and related nutritional items, with integrated payment processing and administrative management capabilities. The platform is specifically designed for the Indian market with localized payment solutions.

### 1.3 Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Server Environment: XAMPP
- Payment Gateway: Razorpay (India's leading payment gateway supporting UPI, Cards, Net Banking, and Wallets)
- Database: MySQL

## 2. Product Catalog\n
### 2.1 Product List
1. Ragi Milk Powder - 200g - Rs 120
2. Ragi Milk Powder with Beetroot and Carrot Powder - 200g - Rs 200
3. Ragi Milk Powder with Sweet Potato Powder - 200g - Rs 200
4. Ragi Milk Powder with Nenthiram Powder - 200g - Rs 130\n5. Black Urad Dal Kanji Powder - 200g - Rs 80
6. Black Urad Dal Kali Powder - 200g - Rs 70
7. Pure Nenthiram Banana Powder - 200g - Rs 150

### 2.2 Product Categories
- Ragi-based Products
- Dal-based Products
- Banana Powder Products
\n## 3. Website Features\n
### 3.1 Customer-Facing Features
- **Home Page**: Product search functionality and category browsing
- **Product Display**: Individual product detail pages\n- **Shopping Cart**: Add/remove items with quantity adjustment
- **Checkout Process**: Order form and customer information collection
- **Payment Integration**: Razorpay payment gateway for secure transactions with support for Indian payment methods including UPI, Credit/Debit Cards, Net Banking, and popular wallets (Paytm, PhonePe, Google Pay)\n- **Order Confirmation**: Success page after payment verification
- **User Authentication**: Customer registration and login system

### 3.2 Admin Panel Features
- **Admin Login**: Secure authentication for administrators
- **Dashboard**: Overview of store operations
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **Image Upload**: Product image management system

### 3.3 Additional Features
- Email notifications for order confirmations
- Session-based authentication protection
- Database-driven product and order management\n- INR (Indian Rupee) currency support throughout the platform

## 4. File Structure

### 4.1 Root Directory
- index.php: Home page with search and categories
- product.php: Single product view\n- cart.php: Shopping cart management
- checkout.php: Checkout form
- payment.php: Razorpay order creation
- verify.php: Payment verification handler
- success.php: Order success page
- login.php: Customer login
- register.php: Customer registration\n- logout.php: Logout handler
- db.php: Database connection
- functions.php: Common helper functions
- config.php: Razorpay keys and site configuration
- send-email.php: Order email notifications

### 4.2 Assets Directory (/assets)\n- style.css: Main styling
- script.js: JavaScript for cart and UI interactions
- logo.png: Website logo
- /product-images: Product image storage

### 4.3 Admin Directory (/admin)
- index.php: Admin login page
- dashboard.php: Admin dashboard
- add-product.php: Add new products\n- edit-product.php: Edit existing products
- delete-product.php: Delete products
- manage-orders.php: View all customer orders
- logout.php: Admin logout
- /uploads: Uploaded product images

### 4.4 Orders Directory (/orders)
- save-order.php: Save orders to database
- order-details.php: View order details

### 4.5 Authentication Directory (/auth)
- login-handler.php: Login processing
- register-handler.php: Registration processing
- protect.php: Page access protection
\n### 4.6 SQL Directory (/sql)
- products.sql: Product table schema
- users.sql: Customer login table schema
- admin.sql: Admin login table schema
- orders.sql: Orders table schema
- categories.sql: Categories table schema

## 5. Design Style

### 5.1 Color Scheme\n- Primary color: Warm brown tones reflecting natural health products
- Secondary color: Fresh green accents for organic feel
- Background: Clean white with subtle beige undertones

### 5.2 Visual Elements
- Rounded corners (8px radius) for cards and buttons
- Soft shadows for depth and hierarchy
- Clean, sans-serif typography for readability
- Grid-based product layout for easy browsing
\n### 5.3 Layout Style
- Card-based design for product displays
- Responsive layout adapting to different screen sizes\n- Clear navigation with category filters\n- Prominent call-to-action buttons for cart and checkout