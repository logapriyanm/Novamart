# Email Service Configuration

## Environment Variables

Add the following to your `.env` file:

```env
# Email Service Configuration
EMAIL_SERVICE=smtp          # Options: 'gmail' or 'smtp'
EMAIL_FROM=NovaMart <noreply@novamart.com>

# For Gmail (requires App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# For SMTP (e.g., Mailtrap, SendGrid, AWS SES)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password

# Frontend URL for email links
FRONTEND_URL=http://localhost:3000
```

## Setup Options

### Option 1: Gmail (Development)
1. Enable 2FA on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Set `EMAIL_SERVICE=gmail`
4. Set `EMAIL_USER` and `EMAIL_PASSWORD`

### Option 2: Mailtrap (Development/Testing)
1. Sign up at https://mailtrap.io
2. Get SMTP credentials from your inbox
3. Set `EMAIL_SERVICE=smtp`
4. Configure SMTP_* variables

### Option 3: SendGrid (Production)
1. Sign up at https://sendgrid.com
2. Create API key
3. Configure:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Option 4: AWS SES (Production)
1. Verify domain in AWS SES
2. Get SMTP credentials
3. Configure SMTP_* variables with AWS values

## Email Templates

### Order Confirmation
- **Trigger**: After successful order creation
- **To**: Customer email
- **Includes**: Order summary, total, escrow notice, tracking link

### Payment Confirmation  
- **Trigger**: After payment verification
- **To**: Customer email
- **Includes**: Amount, transaction ID, payment method, escrow status

## Testing

### Test Email Sending
```javascript
import emailService from './services/emailService.js';

// Test with mock order
const testOrder = {
    id: 'test_order_123',
    totalAmount: 5000,
    items: [{ quantity: 2, price: 2500 }],
    shippingAddress: '123 Test St',
    customer: {
        user: {
            email: 'test@example.com',
            firstName: 'Test User'
        }
    }
};

await emailService.sendOrderConfirmation(testOrder);
```

## Troubleshooting

### Gmail "Less secure app" error
- Use App Password, not regular password
- Ensure 2FA is enabled

### SMTP connection timeout
- Check firewall/network settings
- Verify SMTP port is correct (usually 587 or 2525)

### Emails not sending
- Check console logs for errors
- Verify environment variables are loaded
- Test SMTP credentials with a mail client

## Production Recommendations

1. **Use a dedicated email service** (SendGrid, AWS SES, Mailgun)
2. **Set up SPF/DKIM records** for your domain
3. **Monitor email delivery rates**
4. **Implement retry logic** for failed sends
5. **Add email queue** for high volume (e.g., Bull/Redis)

## Email Queue (Optional Enhancement)

For production, consider adding a job queue:

```javascript
import Queue from 'bull';
const emailQueue = new Queue('email', process.env.REDIS_URL);

emailQueue.process(async (job) => {
    const { type, data } = job.data;
    if (type === 'order-confirmation') {
        await emailService.sendOrderConfirmation(data);
    }
});

// Usage
emailQueue.add({ type: 'order-confirmation', order });
```
