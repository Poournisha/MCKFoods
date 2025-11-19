# MCK Foods E-commerce Platform

## 🏪 Project Overview

A fully functional e-commerce website for MCK Foods, specializing in premium Ragi health food products with integrated Razorpay payment processing and comprehensive admin management.

## 🔐 Admin Credentials

**First Time Setup - Register with these credentials**:
- **Email**: `mangocitykitchen`
- **Password**: `paramscottage`

**Important**: Use these credentials when registering for the first time. The first registered user automatically becomes admin.

## 📚 Documentation

- **CREDENTIALS.md** - Quick reference for admin login
- **SETUP_GUIDE.md** - Complete setup and configuration guide
- **ADMIN_SETUP.md** - Detailed admin account setup instructions
- **GOOGLE_AUTH_SETUP.md** - Google OAuth integration guide
- **IMAGE_UPLOAD_GUIDE.md** - Image upload feature documentation
- **CHANGES.md** - Complete changelog of all features

## ✨ Key Features

### For Customers
- Browse 7 health food products across 3 categories
- Search and filter products
- Shopping cart with quantity management
- Secure Razorpay payment (UPI, Cards, NetBanking, Wallets)
- Order history and tracking
- User authentication (Email/Password or Google)

### For Admins
- Dashboard with analytics
- Product management (add, edit, delete)
- **Drag-and-drop image upload**
- Multi-image product gallery
- Order management
- User management

## 🚀 Quick Start

1. **Register as Admin**:
   - Go to Register page
   - Email: `mangocitykitchen`
   - Password: `paramscottage`
   - Complete registration

2. **Access Admin Panel**:
   - Click "Admin" button in header
   - Manage products, orders, and users

3. **Configure Razorpay** (Optional):
   - Add your Razorpay credentials to enable payments
   - See SETUP_GUIDE.md for details

4. **Enable Google Sign-In** (Optional):
   - Enable Google provider in Supabase Dashboard
   - See GOOGLE_QUICK_FIX.md for 2-minute setup
   - See GOOGLE_AUTH_SETUP.md for full configuration

## ⚠️ Common Issues

### "Unsupported provider: provider is not enabled"
This means Google OAuth isn't enabled yet. Quick fix:
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. See **GOOGLE_QUICK_FIX.md** for detailed steps

## Project Info

## Project Directory

```
├── README.md # Documentation
├── components.json # Component library configuration
├── eslint.config.js # ESLint configuration
├── index.html # Entry file
├── package.json # Package management
├── postcss.config.js # PostCSS configuration
├── public # Static resources directory
│   ├── favicon.png # Icon
│   └── images # Image resources
├── src # Source code directory
│   ├── App.tsx # Entry file
│   ├── components # Components directory
│   ├── context # Context directory
│   ├── db # Database configuration directory
│   ├── hooks # Common hooks directory
│   ├── index.css # Global styles
│   ├── layout # Layout directory
│   ├── lib # Utility library directory
│   ├── main.tsx # Entry file
│   ├── routes.tsx # Routing configuration
│   ├── pages # Pages directory
│   ├── services # Database interaction directory
│   ├── types # Type definitions directory
├── tsconfig.app.json # TypeScript frontend configuration file
├── tsconfig.json # TypeScript configuration file
├── tsconfig.node.json # TypeScript Node.js configuration file
└── vite.config.ts # Vite configuration file
```

## Tech Stack

Vite, TypeScript, React, Supabase

## Development Guidelines

### How to edit code locally?

You can choose [VSCode](https://code.visualstudio.com/Download) or any IDE you prefer. The only requirement is to have Node.js and npm installed.

### Environment Requirements

```
# Node.js ≥ 20
# npm ≥ 10
Example:
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

### Installing Node.js on Windows

```
# Step 1: Visit the Node.js official website: https://nodejs.org/, click download. The website will automatically suggest a suitable version (32-bit or 64-bit) for your system.
# Step 2: Run the installer: Double-click the downloaded installer to run it.
# Step 3: Complete the installation: Follow the installation wizard to complete the process.
# Step 4: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Installing Node.js on macOS

```
# Step 1: Using Homebrew (Recommended method): Open Terminal. Type the command `brew install node` and press Enter. If Homebrew is not installed, you need to install it first by running the following command in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Alternatively, use the official installer: Visit the Node.js official website. Download the macOS .pkg installer. Open the downloaded .pkg file and follow the prompts to complete the installation.
# Step 2: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### After installation, follow these steps:

```
# Step 1: Download the code package
# Step 2: Extract the code package
# Step 3: Open the code package with your IDE and navigate into the code directory
# Step 4: In the IDE terminal, run the command to install dependencies: npm i
# Step 5: In the IDE terminal, run the command to start the development server: npm run dev -- --host 127.0.0.1
# Step 6: if step 5 failed, try this command to start the development server: npx vite --host 127.0.0.1
```

### How to develop backend services?

Configure environment variables and install relevant dependencies.If you need to use a database, please use the official version of Supabase.

## Learn More

You can also check the help documentation: Download and Building the app（ [https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en](https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en)）to learn more detailed content.
