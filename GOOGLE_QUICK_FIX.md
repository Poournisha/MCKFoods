# Fix: "Unsupported provider: provider is not enabled"

## ❌ Error Message
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

## ✅ Quick Fix (5 Minutes)

This error means Google OAuth isn't enabled in Supabase yet. Follow these steps:

### Step 1: Enable Google Provider in Supabase (2 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your MCK Foods project

2. **Navigate to Authentication**
   - Click "Authentication" in left sidebar
   - Click "Providers" tab

3. **Enable Google**
   - Find "Google" in the providers list
   - Toggle the switch to **ON** (enabled)
   - Click "Save" (you can add credentials later)

**That's it!** The error should be gone now.

### Step 2: Test (Optional - works without credentials for testing)

1. Go to your Login or Register page
2. Click the Google button
3. You should now see a different error or be redirected to Google

---

## 🔧 Full Setup (For Production Use)

For Google sign-in to actually work, you need to add credentials:

### Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create OAuth Client**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: "MCK Foods"

3. **Configure Redirect URIs**
   - Get your Supabase callback URL from the Supabase dashboard
   - It looks like: `https://your-project.supabase.co/auth/v1/callback`
   - Add this to "Authorized redirect URIs" in Google Console

4. **Copy Credentials**
   - Copy the **Client ID**
   - Copy the **Client Secret**

### Add Credentials to Supabase

1. **Go back to Supabase Dashboard**
   - Authentication → Providers → Google

2. **Enter Credentials**
   - Paste **Client ID**
   - Paste **Client Secret**
   - Click "Save"

3. **Test**
   - Click Google button on your website
   - Should redirect to Google login
   - After login, redirects back to your site
   - User is logged in!

---

## 📚 Detailed Instructions

For complete step-by-step instructions with screenshots and troubleshooting:
- See: **GOOGLE_AUTH_SETUP.md**

---

## 🎯 Summary

**Immediate Fix**: Just enable Google provider in Supabase (Step 1 above)

**For Production**: Complete the full setup with Google credentials

**Time Required**:
- Quick fix: 2 minutes
- Full setup: 15-20 minutes

---

## ✅ Verification

After enabling the provider, you should see:
- ✅ No more "provider is not enabled" error
- ✅ Google button works (redirects to Google or shows credential error)
- ✅ Can proceed with full setup

---

**Need more help?** Check GOOGLE_AUTH_SETUP.md for detailed instructions!
