# E-commerce Website Requirements Document
\n## 1. Website Overview\n
### 1.1 Website Name
MCK Foods Online Store

### 1.2 Company Logo\nUse the uploaded logo image 'mcklogo.jpg' as the company brand identity throughout the website.\n
### 1.3 Website Description
An e-commerce platform for MCK Foods, specializing in selling health food products including Ragi Milk Powder and related nutritional items, with integrated payment processing and comprehensive administrative management capabilities. The platform is specifically designed for the Indian market with localized payment solutions.
\n### 1.4 Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Server Environment: XAMPP
- Payment Gateway: Razorpay (India's leading payment gateway supporting UPI, Cards, Net Banking, and Wallets)
- Database: MySQL
- Authentication: OSS Google Login for social authentication

## 2. Product Catalog

### 2.1 Product List\n1. Ragi Milk Powder - 200g - Rs 120
2. Ragi Milk Powder with Beetroot and Carrot Powder - 200g - Rs 200\n3. Ragi Milk Powder with Sweet Potato Powder - 200g - Rs 200
4. Ragi Milk Powder with Nenthiram Powder - 200g - Rs 130
5. Black Urad Dal Kanji Powder - 200g - Rs 80
6. Black Urad Dal Kali Powder - 200g - Rs 70\n7. Pure Nenthiram Banana Powder - 200g - Rs 150
\n### 2.2 Product Categories
- Ragi-based Products
- Dal-based Products
- Banana Powder Products

## 3. Website Features

### 3.1 Customer-Facing Features
- **Home Page**: Product search functionality and category browsing with MCK Foods branding
- **Product Display**: Individual product detail pages with multiple product images
- **Shopping Cart**: Add/remove items with quantity adjustment
- **Checkout Process**: Order form and customer information collection
- **Payment Integration**: Razorpay payment gateway for secure transactions with support for Indian payment methods including UPI, Credit/Debit Cards, Net Banking, and popular wallets (Paytm, PhonePe, Google Pay)\n- **Order Confirmation**: Success page after payment verification
- **User Authentication**: \n  - Traditional customer registration and login system with email and password
  - **Google Sign-Up/Login**: Allow users to register and login using their Google account via OSS Google Login integration
  - Automatic account creation for first-time Google login users
  - Link Google account with existing email-based accounts

### 3.2 Admin Panel Features
- **Admin Login**: Secure authentication for administrators
- **Dashboard**: Overview of store operations with key metrics
- **Product Management**:
  - **Add Products**: Create new products with multiple image upload capability (admin can upload as many product images as needed)\n  - **Edit Products**: Modify existing product details including name, description, price, category, and manage multiple product images (add new images or remove existing ones)
  - **Delete Products**: Remove products from the catalog with confirmation prompt
  - **Manage Products**: View all products in a list with quick edit and delete actions\n- **Order Management**: View and manage customer orders
- **Image Management**: Advanced product image handling system supporting multiple images per product

### 3.3 Additional Features
- Email notifications for order confirmations
- Session-based authentication protection
- Database-driven product and order management
- INR (Indian Rupee) currency support throughout the platform
- Multi-image gallery for product pages
- OSS Google Login integration for seamless social authentication

## 4. File Structure

### 4.1 Root Directory\n- index.php: Home page with search and categories
- product.php: Single product view with image gallery
- cart.php: Shopping cart management
- checkout.php: Checkout form
- payment.php: Razorpay order creation
- verify.php: Payment verification handler
- success.php: Order success page\n- login.php: Customer login with Google login option
- register.php: Customer registration with Google sign-up option
- google-callback.php: Handle Google authentication callback
- logout.php: Logout handler
- db.php: Database connection
- functions.php: Common helper functions
- config.php: Razorpay keys, Google OAuth credentials, and site configuration
- send-email.php: Order email notifications

### 4.2 Assets Directory (/assets)\n- style.css: Main styling
- script.js: JavaScript for cart and UI interactions
- mcklogo.jpg: MCK Foods company logo
- /product-images: Product image storage

### 4.3 Admin Directory (/admin)
- index.php: Admin login page\n- dashboard.php: Admin dashboard with statistics
- add-product.php: Add new products with multiple image upload
- edit-product.php: Edit existing products and manage product images
- delete-product.php: Delete products with confirmation\n- manage-products.php: View and manage all products in a table format
- manage-orders.php: View all customer orders
- logout.php: Admin logout\n- /uploads: Uploaded product images

### 4.4 Orders Directory (/orders)
- save-order.php: Save orders to database
- order-details.php: View order details

### 4.5 Authentication Directory (/auth)
- login-handler.php: Login processing
- register-handler.php: Registration processing
- google-auth.php: Google authentication processing
- protect.php: Page access protection

### 4.6 SQL Directory (/sql)
- products.sql: Product table schema with support for multiple images
- product_images.sql: Product images table schema for storing multiple images per product
- users.sql: Customer login table schema with Google ID field
- admin.sql: Admin login table schema
- orders.sql: Orders table schema
- categories.sql: Categories table schema\n\n## 5. Design Style\n
### 5.1 Color Scheme
- Primary color: Deep blue reflecting the MCK Foods brand identity (matching the logo)\n- Secondary color: Warm brown tones for natural health products
- Accent color: Fresh green for organic feel
- Background: Clean white with subtle beige undertones\n
### 5.2 Visual Elements
- Rounded corners (8px radius) for cards and buttons
- Soft shadows for depth and hierarchy
- Clean, sans-serif typography for readability
- Grid-based product layout for easy browsing
- Image gallery with thumbnail navigation for multiple product images
- Google sign-in button with official Google branding guidelines

### 5.3 Layout Style
- Card-based design for product displays
- Responsive layout adapting to different screen sizes
- Clear navigation with category filters
- Prominent call-to-action buttons for cart and checkout
- Admin dashboard with data visualization and quick action buttons
- Login/Register pages with clear separation between traditional and Google authentication options