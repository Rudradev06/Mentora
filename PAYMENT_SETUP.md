# Payment Integration Setup Guide

This guide will help you set up Stripe payment integration for the Mentora platform.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed
3. MongoDB running locally or remotely

## Setup Steps

### 1. Get Your Stripe API Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

### 2. Configure Backend Environment Variables

1. Navigate to the `server` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your Stripe keys:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mentora-db
   JWT_SECRET=your-super-secret-jwt-key-here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   CLIENT_URL=http://localhost:5173
   ```

### 3. Configure Frontend Environment Variables

1. Navigate to the `client` directory
2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your Stripe publishable key:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   VITE_API_URL=http://localhost:5000/api
   ```

### 4. Set Up Stripe Webhooks (For Production)

Webhooks allow Stripe to notify your server about payment events.

#### For Local Development (Using Stripe CLI):

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/payment/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to your `.env` file

#### For Production:

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/payment/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your production environment variables

### 5. Install Dependencies

Dependencies have already been installed, but if you need to reinstall:

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 6. Start the Application

```bash
# From the root directory
./start.bat  # Windows
# or
./start.sh   # Linux/Mac
```

## Testing Payment Integration

### Test Card Numbers

Stripe provides test card numbers for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Testing Flow

1. Register as a student
2. Browse courses and select a paid course
3. Click "Buy Now"
4. Enter test card details on the checkout page
5. Complete the payment
6. Verify enrollment and access to course content

## Payment Flow

1. **Student clicks "Buy Now"** → Redirected to `/checkout/:courseId`
2. **Checkout page loads** → Creates a Payment Intent via backend API
3. **Student enters card details** → Stripe securely processes payment
4. **Payment succeeds** → Webhook notifies backend
5. **Backend enrolls student** → Updates course enrollment
6. **Student redirected** → Payment success page → Course learning page

## Features Implemented

✅ Stripe payment integration
✅ Secure checkout page with Stripe Elements
✅ Payment intent creation
✅ Webhook handling for payment events
✅ Payment history page
✅ Free course direct enrollment
✅ Paid course checkout flow
✅ Payment success confirmation
✅ Automatic enrollment after payment

## Security Best Practices

- ✅ API keys stored in environment variables
- ✅ Webhook signature verification
- ✅ HTTPS required for production
- ✅ PCI compliance through Stripe
- ✅ No card details stored on your server

## Troubleshooting

### Payment Intent Creation Fails
- Check that `STRIPE_SECRET_KEY` is correctly set
- Verify the course exists and is published
- Ensure user is authenticated and is a student

### Webhook Not Receiving Events
- Verify webhook secret is correct
- Check that webhook URL is accessible
- Review Stripe Dashboard webhook logs

### Payment Succeeds but Student Not Enrolled
- Check webhook is properly configured
- Review server logs for errors
- Verify MongoDB connection

## Going to Production

Before going live:

1. Switch to Stripe live mode keys
2. Set up production webhook endpoint
3. Enable HTTPS on your domain
4. Test with real card (small amount)
5. Set up proper error monitoring
6. Configure email notifications
7. Add refund functionality (if needed)

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Elements](https://stripe.com/docs/stripe-js)

## Support

For issues or questions:
- Check Stripe Dashboard logs
- Review server console logs
- Test with Stripe CLI
- Contact Stripe support for payment-specific issues
