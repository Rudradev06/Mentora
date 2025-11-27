# Payment Error Troubleshooting Guide

## Common Payment Errors and Solutions

### 1. **"Payment service is not configured" Error**

**Cause:** Stripe secret key is missing or invalid

**Solution:**
```bash
# Check if Stripe keys are in server/.env
cat server/.env | findstr STRIPE

# Should show:
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

If missing, add them to `server/.env`:
```env
STRIPE_SECRET_KEY=sk_test_51SW02e019pp48VoTOXIw7LT77uCKxHQpTcOieojlhtQwySskoBEGKPpfRKym2SVas7UQGevufBW5BymTxTmOdNfP00zoXmgrYC
STRIPE_WEBHOOK_SECRET=whsec_687d6de35a6400c1ba90541bfb2b39212a99435a6eb3f87aaf1ae627b156df57
```

Then restart the server.

---

### 2. **"Failed to initialize checkout" Error**

**Possible Causes:**
- Server is not running
- CORS issue
- Authentication token expired
- Course not found

**Solutions:**

**A. Check if server is running:**
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

**B. Check Stripe configuration:**
```bash
curl http://localhost:5000/api/debug/env
# Should return: {"hasStripeKey":true,"stripeKeyPrefix":"sk_test_51",...}
```

**C. Check if you're logged in:**
- Open browser DevTools (F12)
- Go to Application > Local Storage
- Check if `token` exists
- If not, log in again

**D. Restart both servers:**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

### 3. **"You are already enrolled in this course" Error**

**Cause:** You've already purchased/enrolled in this course

**Solution:**
- Go to "My Courses" to access the course
- Or try a different course

---

### 4. **"Only students can purchase courses" Error**

**Cause:** You're logged in as a teacher or admin

**Solution:**
- Log out
- Register/login as a student
- Teachers and admins cannot purchase courses

---

### 5. **Stripe Payment Element Not Loading**

**Possible Causes:**
- Missing Stripe publishable key in client
- Network issue
- Stripe service down

**Solutions:**

**A. Check client environment:**
```bash
# Check if key exists in client/.env
cat client/.env | findstr STRIPE

# Should show:
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

If missing, add to `client/.env`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SW02e019pp48VoTKder3jh3LmSW0w9LpZ7S0YKGqFekH2tjEdceR3lJjAeOvPejaRfYEQ5wc3BvhB1xOel1fpOg00F72MySm6
```

**B. Restart the frontend:**
```bash
cd client
# Stop the dev server (Ctrl+C)
npm run dev
```

**C. Clear browser cache:**
- Press Ctrl+Shift+Delete
- Clear cached images and files
- Reload the page

---

### 6. **Payment Succeeds but Shows "Not Enrolled"**

**Cause:** Webhook delay or enrollment check issue

**Solution:**
- Wait 5-10 seconds and refresh the page
- The retry logic should automatically check enrollment
- If still not enrolled after 30 seconds, check webhook logs

---

## Step-by-Step Debugging

### Step 1: Verify Environment Variables

**Server (.env):**
```bash
cd server
type .env
```

Should contain:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentora
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
STRIPE_SECRET_KEY=sk_test_51SW02e019pp48VoTOXIw7LT77uCKxHQpTcOieojlhtQwySskoBEGKPpfRKym2SVas7UQGevufBW5BymTxTmOdNfP00zoXmgrYC
STRIPE_WEBHOOK_SECRET=whsec_687d6de35a6400c1ba90541bfb2b39212a99435a6eb3f87aaf1ae627b156df57
CLIENT_URL=http://localhost:5173
```

**Client (.env):**
```bash
cd client
type .env
```

Should contain:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SW02e019pp48VoTKder3jh3LmSW0w9LpZ7S0YKGqFekH2tjEdceR3lJjAeOvPejaRfYEQ5wc3BvhB1xOel1fpOg00F72MySm6
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Test Backend Endpoints

```bash
# Test health
curl http://localhost:5000/api/health

# Test Stripe config
curl http://localhost:5000/api/debug/env

# Test courses endpoint
curl http://localhost:5000/api/courses
```

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Common errors:
   - `VITE_STRIPE_PUBLISHABLE_KEY is not defined` → Add key to client/.env
   - `Failed to fetch` → Server not running
   - `401 Unauthorized` → Token expired, log in again
   - `Network Error` → Check if backend is running on port 5000

### Step 4: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try to checkout
4. Look for failed requests (red)
5. Click on failed request to see details

### Step 5: Test with Stripe Test Cards

Use these test cards:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Auth:** `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC.

---

## Quick Fix Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] `server/.env` has STRIPE_SECRET_KEY
- [ ] `client/.env` has VITE_STRIPE_PUBLISHABLE_KEY
- [ ] You're logged in as a student
- [ ] The course has a price > 0
- [ ] You're not already enrolled in the course
- [ ] Browser cache is cleared
- [ ] No console errors in browser DevTools

---

## Still Having Issues?

### Check Server Logs

Look at the terminal where the backend is running. You should see:
```
✓ API running on http://localhost:5000
✓ MongoDB connected
✓ Stripe initialized successfully
```

If you see:
```
⚠️ STRIPE_SECRET_KEY not found or empty
```

Then Stripe is not configured properly.

### Check Frontend Logs

In browser console, you should see:
```
Creating payment intent for course: [courseId]
Payment intent created successfully
```

If you see errors, they will indicate what's wrong.

### Test Payment Flow Manually

1. **Register as a student:**
   - Go to http://localhost:5173/register
   - Email: test@example.com
   - Password: password123
   - Role: Student

2. **Browse courses:**
   - Go to http://localhost:5173/courses
   - Find a paid course (price > $0)

3. **Try to enroll:**
   - Click on the course
   - Click "Buy Now"
   - Should redirect to checkout page

4. **Check checkout page:**
   - Should see course details on right
   - Should see payment form on left
   - If you see an error, note the exact message

5. **Complete payment:**
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - Click "Complete Purchase"

6. **Verify success:**
   - Should redirect to payment success page
   - Should see "Payment Successful!" message
   - Click "Start Learning Now"
   - Should see course content

---

## Contact Information

If none of these solutions work, provide:
1. Exact error message you're seeing
2. Screenshot of browser console (F12 > Console tab)
3. Screenshot of Network tab showing failed request
4. Server terminal output
