# Quick Start: Payment Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Get Stripe Keys (2 minutes)

1. Go to https://stripe.com and sign up (or login)
2. Navigate to **Developers** → **API keys**
3. Copy these two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 2: Configure Backend (1 minute)

1. Open `server/.env` (create it if it doesn't exist)
2. Add your Stripe secret key:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentora-db
JWT_SECRET=your-super-secret-jwt-key-here
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_WEBHOOK_SECRET
CLIENT_URL=http://localhost:5173
```

### Step 3: Configure Frontend (1 minute)

1. Open `client/.env` (create it if it doesn't exist)
2. Add your Stripe publishable key:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Restart Servers (1 minute)

```bash
# Stop current servers (Ctrl+C)
# Then restart
./start.bat
```

### Step 5: Test It! (30 seconds)

1. Open http://localhost:5173
2. Login as a student
3. Find a paid course
4. Click "Buy Now"
5. Use test card: `4242 4242 4242 4242`
6. Any future date, any CVC, any ZIP
7. Complete payment ✅

## 🎯 What You Can Do Now

### As a Student:
- ✅ Browse free and paid courses
- ✅ Enroll in free courses instantly
- ✅ Purchase paid courses with credit card
- ✅ View payment history
- ✅ Access purchased courses immediately

### As a Teacher:
- ✅ Create free courses
- ✅ Create paid courses with custom pricing
- ✅ View course enrollment stats
- ✅ Track revenue (via Stripe Dashboard)

## 📱 User Journey

### Buying a Course:

```
Browse Courses → Click "Buy Now" → Enter Card Details → Success! → Start Learning
```

### Free Course:

```
Browse Courses → Click "Enroll Free" → Start Learning
```

## 🧪 Test Cards

| Card Number | Result |
|------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0025 0000 3155 | 🔐 Requires 3D Secure |

## 🎨 What Was Added

### New Pages:
1. **Checkout Page** (`/checkout/:id`)
   - Professional payment form
   - Order summary
   - Security badges

2. **Payment Success** (`/payment-success`)
   - Confirmation message
   - Course access button
   - Receipt information

3. **Payment History** (`/payment-history`)
   - All transactions
   - Status tracking
   - Download receipts

### Updated Pages:
- **Courses Page**: "Buy Now" button for paid courses
- **Course Detail**: Checkout redirect
- **Navbar**: Payment history link

## 🔧 Troubleshooting

### "Payment failed" error?
- Check your Stripe keys are correct
- Verify MongoDB is running
- Check server console for errors

### Webhook not working?
- For local testing, use Stripe CLI:
  ```bash
  stripe listen --forward-to localhost:5000/api/payment/webhook
  ```

### Student not enrolled after payment?
- Check webhook secret is configured
- Review Stripe Dashboard webhook logs
- Check server logs for errors

## 📊 Monitoring Payments

### Stripe Dashboard:
- View all transactions
- See payment status
- Check webhook events
- Download reports

### Your App:
- Payment history page
- Course enrollment tracking
- User purchase records

## 💡 Pro Tips

1. **Test Mode**: Always test in test mode first
2. **Webhooks**: Set up webhooks for production
3. **Errors**: Check both Stripe and server logs
4. **Security**: Never commit API keys to git
5. **Production**: Switch to live keys when ready

## 🎉 You're All Set!

Your payment integration is ready to accept real payments. When you're ready to go live:

1. Switch to Stripe live mode
2. Update environment variables with live keys
3. Set up production webhook
4. Test with a real card (small amount)
5. Start accepting payments! 💰

## 📚 Need Help?

- **Setup Guide**: See `PAYMENT_SETUP.md`
- **Full Summary**: See `PAYMENT_INTEGRATION_SUMMARY.md`
- **Stripe Docs**: https://stripe.com/docs
- **Test Cards**: https://stripe.com/docs/testing

---

**Ready to make money from your courses? Let's go! 🚀**
