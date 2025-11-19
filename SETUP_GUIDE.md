# Ragi Products E-commerce Website - Setup Guide

## 🎉 Your E-commerce Platform is Ready!

This is a fully functional e-commerce website for selling Ragi health food products with integrated payment processing and admin management.

## 📋 What's Included

### Customer Features
- **Product Catalog**: Browse 7 health food products across 3 categories
- **Search & Filter**: Find products by name or category
- **Shopping Cart**: Add, remove, and adjust quantities
- **Secure Checkout**: Integrated Stripe payment processing
- **Order History**: Track all your orders
- **User Authentication**: Register and login with email/password

### Admin Features
- **Dashboard**: Overview of products, orders, users, and revenue
- **Product Management**: Add, edit, and delete products with images
- **Order Management**: View and track all customer orders
- **User Management**: Manage user accounts and roles

## 🔧 Configuration Required

### 1. Stripe Payment Setup

To enable payment processing, you need to add your Stripe secret key:

1. Get your Stripe secret key from https://dashboard.stripe.com/apikeys
2. The key should start with `sk_test_` (for testing) or `sk_live_` (for production)
3. Add it to your Supabase Edge Functions secrets (already configured in the system)

**Note**: The payment system is fully implemented and will work once you add your Stripe key.

### 2. First Admin Account

The system automatically makes the **first registered user** an admin. To set up your admin account:

1. Go to the Register page
2. Create your account with email and password
3. You'll automatically have admin privileges
4. Access the admin panel from the header menu

## 🗄️ Database Information

Your database is already set up with:
- **3 Categories**: Ragi-based Products, Dal-based Products, Banana Powder Products
- **7 Products**: All products with real images and descriptions
- **User Roles**: Automatic admin assignment for first user
- **Order Tracking**: Complete order management system

### Initial Data Included

The following products are pre-loaded:
1. Ragi Milk Powder - ₹120
2. Ragi Milk Powder with Beetroot and Carrot - ₹200
3. Ragi Milk Powder with Sweet Potato - ₹200
4. Ragi Milk Powder with Nenthiram - ₹130
5. Black Urad Dal Kanji Powder - ₹80
6. Black Urad Dal Kali Powder - ₹70
7. Pure Nenthiram Banana Powder - ₹150

**You can modify or delete these products through the admin panel.**

## 🎨 Design Features

- **Color Scheme**: Warm brown primary color with fresh green accents
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Professional Layout**: Card-based design with smooth transitions

## 🚀 How to Use

### For Customers

1. **Browse Products**: Visit the home page to see all products
2. **Search**: Use the search bar to find specific products
3. **Filter**: Click category buttons to filter products
4. **Add to Cart**: Click "Add to Cart" on any product
5. **Checkout**: Review your cart and proceed to checkout
6. **Payment**: Complete payment through Stripe (secure and encrypted)
7. **Track Orders**: View your order history in "My Orders"

### For Admins

1. **Login**: Use your admin account credentials
2. **Access Admin Panel**: Click "Admin" button in the header
3. **Manage Products**: Add new products, edit existing ones, or remove products
4. **View Orders**: Monitor all customer orders and their status
5. **Manage Users**: View all users and change their roles

## 🔐 Security Features

- **Secure Authentication**: Email/password authentication with Supabase
- **Row Level Security**: Database policies protect user data
- **Payment Security**: Stripe handles all payment processing securely
- **Admin Protection**: Admin routes are protected and require admin role

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop computers (1920px and above)
- Laptops (1366px - 1920px)
- Tablets (768px - 1366px)
- Mobile phones (320px - 768px)

## 🛠️ Technical Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **Hosting**: Ready for deployment

## 📝 Important Notes

1. **Stripe Configuration**: Add your Stripe secret key to enable payments
2. **First User is Admin**: The first person to register becomes an admin automatically
3. **Product Images**: All products have real images loaded
4. **Email Verification**: Currently disabled for easier testing (can be enabled in Supabase settings)

## 🎯 Next Steps

1. Register your admin account (first user)
2. Add your Stripe secret key for payment processing
3. Customize products through the admin panel
4. Test the complete shopping flow
5. Deploy to production when ready

## 💡 Tips

- **Testing Payments**: Use Stripe test card `4242 4242 4242 4242` with any future expiry date
- **Managing Stock**: Update product stock levels through the admin panel
- **Order Status**: Orders automatically update to "completed" after successful payment
- **User Roles**: Change user roles through the Users Management page

## 🆘 Support

If you need to:
- Add more product categories
- Customize the design colors
- Add new features
- Modify the checkout process

All the code is well-organized and documented for easy customization.

---

**Your e-commerce platform is ready to start selling! 🎊**
