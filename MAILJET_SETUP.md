# Mailjet Email Integration Setup

## 1. Create Mailjet Account

1. Go to https://www.mailjet.com/
2. Sign up for a free account (200 emails/day, 6,000/month)
3. Verify your email address

## 2. Get API Credentials

1. Log in to Mailjet dashboard
2. Go to **Account Settings** → **API Key Management** (Master API Key & Sub API key)
   - Or directly: https://app.mailjet.com/account/apikeys
3. Copy your **API Key** and **Secret Key**

## 3. Configure Sender Email

1. In Mailjet dashboard, go to **Account Settings** → **Sender Addresses & Domains**
2. Add and verify `support@thecircleapp.co.in`
3. Follow the email verification link sent to your email

## 4. Update Environment Variables

Update your `config/.env` file with your Mailjet credentials:

```env
EMAIL_PROVIDER=mailjet
MAILJET_API_KEY=your-actual-api-key-here
MAILJET_API_SECRET=your-actual-secret-key-here
EMAIL_PROVIDER_FROM_EMAIL=support@thecircleapp.co.in
```

## 5. Deploy to Production

### Local Testing:
```bash
# Restart your local server
npm run develop
```

### Production Server:
```bash
# 1. Push changes to GitHub
git add .
git commit -m "Integrate Mailjet email service"
git push origin main

# 2. SSH to server
ssh -i ~/.ssh/id_ed25519_second root@143.244.138.36

# 3. Pull changes
cd /var/www/circle-app-backend
git pull origin main

# 4. Install new dependencies
npm install

# 5. Update production .env file
nano config/.env
# Add these lines:
# EMAIL_PROVIDER=mailjet
# MAILJET_API_KEY=your-actual-api-key
# MAILJET_API_SECRET=your-actual-secret-key

# 6. Restart PM2
pm2 restart circleapp
pm2 logs circleapp
```

## 6. Test Email Sending

Test the signup flow:
```bash
curl --location --request POST 'https://api.thecircleapp.co.in/demo/api/user/signUp' \
--header 'accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: l3k3v4vs84vdghjdl4nl' \
--data-raw '{"email": "your-test-email@gmail.com"}'
```

## Features Implemented

✅ Mailjet integration with fallback to SMTP
✅ Support for verification emails
✅ Support for password reset emails
✅ Support for subscription confirmation emails
✅ Support for celebrity request emails
✅ Easy switching between Mailjet and SMTP via `EMAIL_PROVIDER` env variable

## Mailjet Free Tier Limits

- 200 emails per day
- 6,000 emails per month
- No credit card required
- Unlimited contacts

## Troubleshooting

If emails aren't sending:
1. Check PM2 logs: `pm2 logs circleapp`
2. Verify sender email is validated in Mailjet dashboard
3. Check API credentials are correct
4. Ensure `EMAIL_PROVIDER_SEND_EMAIL=true`
5. Verify `EMAIL_PROVIDER=mailjet` (not `smtp`)

## Switching Back to SMTP

If you want to use Hostinger SMTP instead:
```env
EMAIL_PROVIDER=smtp
```
