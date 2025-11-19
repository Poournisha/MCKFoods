# Google OAuth Setup Guide

## 🔐 Enable Google Sign-In for MCK Foods

This guide will help you set up Google OAuth authentication for your e-commerce platform.

## 📋 Prerequisites

- Access to your Supabase project dashboard
- A Google Cloud Platform account (free)

## 🚀 Setup Steps

### Step 1: Configure Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name: "MCK Foods" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External
     - App name: MCK Foods
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
     - Scopes: Leave default, click "Save and Continue"
     - Test users: Add your email (optional)
     - Click "Save and Continue"

5. **Configure OAuth Client**
   - Application type: **Web application**
   - Name: "MCK Foods Web Client"
   - **Authorized JavaScript origins**:
     - Add: `https://your-supabase-project.supabase.co`
     - Add: `http://localhost:5173` (for local testing)
   - **Authorized redirect URIs**:
     - Add: `https://your-supabase-project.supabase.co/auth/v1/callback`
     - Add: `http://localhost:5173/auth/v1/callback` (for local testing)
   - Click "Create"

6. **Copy Your Credentials**
   - You'll see a popup with:
     - **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-abc123xyz`)
   - **Save these credentials** - you'll need them in the next step

### Step 2: Configure Supabase

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your MCK Foods project

2. **Navigate to Authentication Settings**
   - Click "Authentication" in the left sidebar
   - Click "Providers"
   - Find "Google" in the list

3. **Enable Google Provider**
   - Toggle "Enable Sign in with Google" to **ON**
   - Enter your **Client ID** from Step 1
   - Enter your **Client Secret** from Step 1
   - Click "Save"

4. **Get Your Callback URL**
   - Copy the callback URL shown in Supabase
   - It should look like: `https://your-project.supabase.co/auth/v1/callback`
   - Make sure this matches what you entered in Google Cloud Console

### Step 3: Update Google Cloud Console (if needed)

1. **Go back to Google Cloud Console**
   - Navigate to "APIs & Services" → "Credentials"
   - Click on your OAuth client

2. **Verify Redirect URIs**
   - Make sure the Supabase callback URL is listed
   - Format: `https://your-project.supabase.co/auth/v1/callback`
   - Click "Save" if you made changes

### Step 4: Test the Integration

1. **Open Your Website**
   - Go to the Register or Login page

2. **Click "Sign up with Google" or "Google" button**
   - You should be redirected to Google's login page
   - Select your Google account
   - Grant permissions
   - You'll be redirected back to your website

3. **Verify Login**
   - Check if you're logged in
   - If you're the first user, you should have admin privileges
   - Check the admin panel to confirm

## 🎯 Important Notes

### First User Admin Assignment
- The **first user** to sign up (via Google or email) automatically becomes admin
- Subsequent Google sign-ups will be regular users
- You can promote users to admin through the admin panel

### Redirect URLs
Make sure your redirect URLs match exactly:
- **Production**: `https://your-project.supabase.co/auth/v1/callback`
- **Local Development**: `http://localhost:5173/auth/v1/callback`

### OAuth Consent Screen
- For testing: Use "External" user type and add test users
- For production: Submit for verification (required for public use)

## 🔧 Troubleshooting

### "Error 400: redirect_uri_mismatch"
- **Cause**: Redirect URI in Google Console doesn't match Supabase
- **Fix**: 
  1. Copy the exact callback URL from Supabase
  2. Add it to Google Console's Authorized redirect URIs
  3. Wait 5 minutes for changes to propagate

### "Access blocked: This app's request is invalid"
- **Cause**: OAuth consent screen not configured
- **Fix**: Complete the OAuth consent screen setup in Google Console

### "Google sign-in button doesn't work"
- **Cause**: Google provider not enabled in Supabase
- **Fix**: Enable Google provider in Supabase Authentication settings

### "User signed in but not redirected"
- **Cause**: Redirect URL configuration issue
- **Fix**: Check that redirectTo URL in code matches your domain

## 📱 User Experience

### For Customers
1. Click "Sign up with Google" on Register page
2. Select Google account
3. Grant permissions
4. Automatically logged in and redirected to home page

### For Admin (First User)
1. Be the first to sign up with Google
2. Automatically assigned admin role
3. Access admin panel from header
4. Manage products, orders, and users

## 🔒 Security Best Practices

1. **Keep Credentials Secret**
   - Never commit Client ID/Secret to version control
   - Store them securely in Supabase settings

2. **Use HTTPS in Production**
   - Always use HTTPS for production URLs
   - HTTP is only for local development

3. **Limit Redirect URIs**
   - Only add trusted domains
   - Remove test URLs before going live

4. **Review Permissions**
   - Only request necessary Google scopes
   - Current setup uses basic profile and email

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] OAuth client ID created
- [ ] Authorized redirect URIs configured
- [ ] Client ID and Secret copied
- [ ] Google provider enabled in Supabase
- [ ] Credentials entered in Supabase
- [ ] Test sign-up successful
- [ ] User redirected correctly
- [ ] Admin role assigned (for first user)

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify all URLs match exactly (including https://)
3. Wait 5-10 minutes after making changes in Google Console
4. Clear browser cache and cookies
5. Try in an incognito/private window

---

**Ready to enable Google Sign-In?** Follow the steps above to get started!
