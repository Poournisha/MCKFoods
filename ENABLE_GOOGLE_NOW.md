# ⚡ Enable Google Sign-In NOW (2 Minutes)

## 🎯 You're seeing this error:
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

## ✅ Here's the fix:

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Click on your **MCK Foods** project

### Step 2: Enable Google Provider
1. Click **"Authentication"** in the left sidebar
2. Click **"Providers"** tab at the top
3. Scroll down to find **"Google"**
4. Toggle the switch to **ON** (green)
5. Click **"Save"** button

**That's it!** ✨

### Step 3: Test
1. Go back to your website
2. Click the **Google** button on Login or Register page
3. The error should be gone!

---

## 🔧 What happens next?

After enabling the provider, you'll see one of these:

### Option A: It works! 🎉
- You're redirected to Google login
- You can sign in with your Google account
- You're logged into MCK Foods

### Option B: Different error (needs credentials)
You'll see an error about missing credentials. This means you need to:
1. Create OAuth credentials in Google Cloud Console
2. Add them to Supabase

**See GOOGLE_AUTH_SETUP.md for full instructions**

---

## 📝 Quick Reference

| What | Where | Action |
|------|-------|--------|
| Enable Provider | Supabase Dashboard | Authentication → Providers → Google → ON |
| Add Credentials | Google Cloud Console | Create OAuth Client ID |
| Configure Redirect | Google Console | Add Supabase callback URL |
| Test | Your Website | Click Google button |

---

## 🆘 Still having issues?

### Error: "Invalid redirect URI"
- You need to add Google OAuth credentials
- See: **GOOGLE_AUTH_SETUP.md** (Step 2)

### Error: "Access denied"
- Check your Google account permissions
- Try a different Google account

### Button doesn't work
- Clear browser cache
- Try incognito/private mode
- Check browser console for errors

---

## 📚 More Help

- **GOOGLE_QUICK_FIX.md** - Detailed fix guide
- **GOOGLE_AUTH_SETUP.md** - Complete setup with credentials
- **GOOGLE_OAUTH_SUMMARY.md** - Feature overview
- **README.md** - Project documentation

---

## ⏱️ Time Required

- **Enable provider**: 2 minutes ⚡
- **Add credentials**: 15 minutes 🔧
- **Full production setup**: 20 minutes 🚀

---

**Start here**: Just enable the provider in Supabase (Step 2 above)

**Then**: Add credentials when you're ready for production

---

## 🎉 Benefits After Setup

✅ Users can sign up in seconds  
✅ No password to remember  
✅ One-click login  
✅ Better conversion rates  
✅ More secure authentication  

---

**Ready?** Go to Supabase Dashboard → Authentication → Providers → Google → ON
