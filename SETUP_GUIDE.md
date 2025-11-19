# MCK Foods E-commerce Website - Setup Guide

## 🎉 Your E-commerce Platform is Ready!

This is a fully functional e-commerce website for MCK Foods, selling premium Ragi health food products with integrated Razorpay payment processing (perfect for India) and comprehensive admin management.

## 📋 What's Included

### Customer Features
- **Product Catalog**: Browse 7 health food products across 3 categories
- **Search & Filter**: Find products by name or category
- **Shopping Cart**: Add, remove, and adjust quantities
- **Secure Checkout**: Integrated Razorpay payment processing (UPI, Cards, NetBanking, Wallets)
- **Order History**: Track all your orders
- **User Authentication**: Register and login with email/password
- **Product Gallery**: View multiple images for each product

### Admin Features
- **Dashboard**: Overview of products, orders, users, and revenue
- **Product Management**: Add, edit, and delete products
- **Multi-Image Upload**: Add unlimited images per product with primary image selection
- **Image Gallery Management**: Reorder, set primary, and delete product images
- **Order Management**: View and track all customer orders
- **User Management**: Manage user accounts and roles

## 🔧 Configuration Required

### 1. Razorpay Payment Setup

To enable payment processing, you need to add your Razorpay credentials:

1. **Get your Razorpay keys** from https://dashboard.razorpay.com/app/keys
   - Key ID (starts with `rzp_test_` for testing or `rzp_live_` for production)
   - Key Secret (keep this confidential)

2. **Add to Supabase Edge Functions**:
   - The system needs two environment variables:
     - `RAZORPAY_KEY_ID` - Your Razorpay Key ID
     - `RAZORPAY_KEY_SECRET` - Your Razorpay Key Secret

3. **Testing Payments**:
   - Use Razorpay test mode credentials for testing
   - Test cards and UPI IDs are available in Razorpay documentation
   - All Indian payment methods are supported (UPI, Cards, NetBanking, Wallets)

**Note**: The payment system is fully implemented and will work once you add your Razorpay keys.

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
- **Order Tracking**: Complete order management system with Razorpay integration

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
6. **Payment**: Complete payment through Razorpay (supports UPI, Cards, NetBanking, Wallets)
7. **Track Orders**: View your order history in "My Orders"

### For Admins

1. **Login**: Use your admin account credentials
2. **Access Admin Panel**: Click "Admin" button in the header
3. **Manage Products**: 
   - Add new products with primary image
   - Edit existing products
   - Click "Images" button to manage product gallery
   - Add multiple images per product
   - Set primary image for product display
   - Delete unwanted images
4. **View Orders**: Monitor all customer orders and their status
5. **Manage Users**: View all users and change their roles

## 🖼️ Multi-Image Product Management

The admin panel includes a powerful image management system with drag-and-drop upload:

### Adding Images to Products

1. **Create Product**: First create a product (image is optional at this stage)
2. **Manage Images**: Click the "Images" button on any product card
3. **Upload Images**: 
   - **Drag and Drop**: Drag image files directly into the upload area
   - **Click to Upload**: Click the upload area to select files from your computer
   - Supported formats: JPG, PNG, WEBP
   - Maximum file size: 1MB per image
   - First image is automatically set as primary
4. **Set Primary Image**: Click the star icon on any image to make it primary
5. **Delete Images**: Click the X icon to remove unwanted images

### Image Requirements

- **File Formats**: JPG, JPEG, PNG, WEBP
- **File Size**: Maximum 1MB per image
- **Filename**: Must not contain Chinese characters
- **Storage**: Images are stored in Supabase Storage and publicly accessible

### Image Display

- **Primary Image**: Shows on product cards and listings
- **Gallery**: All images available in product detail view
- **Order**: Images are displayed in the order they were uploaded

## 🔐 Security Features

- **Secure Authentication**: Email/password authentication with Supabase
- **Row Level Security**: Database policies protect user data
- **Payment Security**: Razorpay handles all payment processing securely with signature verification
- **Admin Protection**: Admin routes are protected and require admin role

## 💳 Payment Methods Supported

Razorpay supports all major Indian payment methods:
- **UPI**: Google Pay, PhonePe, Paytm, BHIM, and all UPI apps
- **Cards**: Credit Cards, Debit Cards (Visa, Mastercard, RuPay, Amex)
- **NetBanking**: All major Indian banks
- **Wallets**: Paytm, Mobikwik, Freecharge, Airtel Money, JioMoney
- **EMI**: Cardless EMI and Card EMI options

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
- **Payment**: Razorpay (India's leading payment gateway)
- **Hosting**: Ready for deployment

## 📝 Important Notes

1. **Razorpay Configuration**: Add your Razorpay Key ID and Key Secret to enable payments
2. **First User is Admin**: The first person to register becomes an admin automatically
3. **Product Images**: All products have real images loaded
4. **Email Verification**: Currently disabled for easier testing (can be enabled in Supabase settings)
5. **Currency**: All prices are in Indian Rupees (₹)

## 🎯 Next Steps

1. Register your admin account (first user)
2. Add your Razorpay credentials for payment processing
3. Customize products through the admin panel
4. Test the complete shopping flow with Razorpay test mode
5. Deploy to production when ready

## 💡 Tips

- **Testing Payments**: Use Razorpay test mode with test credentials
- **Managing Stock**: Update product stock levels through the admin panel
- **Order Status**: Orders automatically update to "completed" after successful payment verification
- **User Roles**: Change user roles through the Users Management page
- **Payment Verification**: Razorpay signature verification ensures payment authenticity

## 🆘 Support

If you need to:
- Add more product categories
- Customize the design colors
- Add new features
- Modify the checkout process
- Configure additional payment methods

All the code is well-organized and documented for easy customization.

---

**Your e-commerce platform is ready to start selling in India! 🎊**
