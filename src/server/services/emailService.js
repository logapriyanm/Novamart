import nodemailer from 'nodemailer';
import logger from '../lib/logger.js';

// Create email transporter
const createTransporter = () => {
    // For development: use mailtrap, ethereal, or Gmail
    // For production: use SendGrid, AWS SES, etc.

    if (process.env.EMAIL_SERVICE === 'gmail') {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD // App password for Gmail
            }
        });
    }

    // Default: Use SMTP configuration if credentials provided
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT || '2525'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    // Fallback: Logger transporter for development/testing
    logger.warn('No email credentials found. Falling back to mock transporter.');
    return {
        sendMail: async (options) => {
            logger.info('[MOCK EMAIL] To: %s | Subject: %s', options.to, options.subject);
            return { messageId: `mock-${Date.now()}` };
        }
    };
};

const transporter = createTransporter();

// Email templates
const emailTemplates = {
    orderConfirmation: (order, customer) => ({
        subject: `Order Confirmed #${order.id.slice(0, 8).toUpperCase()} - NovaMart`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FF5733 0%, #C70039 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 900; }
        .content { padding: 40px 30px; }
        .badge { display: inline-block; background: #10B981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 20px 0; }
        .order-id { font-size: 14px; color: #666; margin-top: 10px; }
        .section { margin: 30px 0; }
        .section-title { font-size: 14px; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
        .info-box { background: #F9FAFB; border-radius: 12px; padding: 20px; margin: 15px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E5E7EB; }
        .info-row:last-child { border-bottom: none; }
        .label { color: #6B7280; font-size: 14px; font-weight: 500; }
        .value { color: #111827; font-size: 14px; font-weight: bold; }
        .escrow-notice { background: #ECFDF5; border-left: 4px solid #10B981; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .escrow-notice h3 { margin: 0 0 10px 0; color: #059669; font-size: 16px; }
        .escrow-notice p { margin: 0; color: #065F46; font-size: 14px; line-height: 1.6; }
        .total { background: #1F2937; color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
        .total-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
        .total-amount { font-size: 32px; font-weight: 900; margin-top: 5px; }
        .button { display: inline-block; background: #FF5733; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { background: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <div class="badge">✓ Payment Secured</div>
            <div class="order-id">Order ID: ${order.id.slice(0, 13).toUpperCase()}</div>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Hi ${customer.user.firstName || 'Customer'},
            </p>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
                Thank you for your order! We've received your payment and it's now securely held in escrow. 
                Your order will be shipped soon.
            </p>
            
            <div class="escrow-notice">
                <h3>🛡️ Buyer Protection Active</h3>
                <p>
                    Your payment of ₹${Number(order.totalAmount).toLocaleString('en-IN')} is held securely in escrow. 
                    The seller will not receive funds until you confirm delivery. You're fully protected!
                </p>
            </div>
            
            <div class="section">
                <div class="section-title">Order Summary</div>
                <div class="info-box">
                    ${order.items.map(item => `
                        <div class="info-row">
                            <span class="label">Item × ${item.quantity}</span>
                            <span class="value">₹${Number(item.price).toLocaleString('en-IN')}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="total">
                <div class="total-label">Total Paid</div>
                <div class="total-amount">₹${Number(order.totalAmount).toLocaleString('en-IN')}</div>
            </div>
            
            <div class="section">
                <div class="section-title">Shipping Address</div>
                <div class="info-box">
                    <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">
                        ${order.shippingAddress || 'Address on file'}
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/customer/orders/${order.id}" class="button">
                    Track Your Order →
                </a>
            </div>
            
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
                Questions? Reply to this email or contact support@novamart.com
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">NovaMart</p>
            <p style="margin: 0;">Secure B2B Marketplace with Escrow Protection</p>
            <p style="margin: 10px 0 0 0;">© 2026 NovaMart. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `
    }),

    paymentConfirmation: (payment, order, customer) => ({
        subject: `Payment Confirmed ₹${Number(payment.amount).toLocaleString('en-IN')} - NovaMart`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 900; }
        .content { padding: 40px 30px; }
        .checkmark { width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .amount-box { background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0; }
        .amount-label { font-size: 14px; color: #059669; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        .amount { font-size: 36px; font-weight: 900; color: #065F46; margin-top: 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .info-card { background: #F9FAFB; padding: 15px; border-radius: 8px; }
        .info-card-label { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .info-card-value { font-size: 14px; color: #111827; font-weight: bold; }
        .escrow-box { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="checkmark">✓</div>
            <h1>Payment Received!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your payment has been securely processed</p>
        </div>
        
        <div class="content">
            <div class="amount-box">
                <div class="amount-label">Amount Paid</div>
                <div class="amount">₹${Number(payment.amount).toLocaleString('en-IN')}</div>
            </div>
            
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-card-label">Transaction ID</div>
                    <div class="info-card-value">${payment.razorpayPaymentId || 'MOCK_' + Date.now()}</div>
                </div>
                <div class="info-card">
                    <div class="info-card-label">Order ID</div>
                    <div class="info-card-value">#${order.id.slice(0, 8).toUpperCase()}</div>
                </div>
                <div class="info-card">
                    <div class="info-card-label">Payment Method</div>
                    <div class="info-card-value">${payment.method || 'Online'}</div>
                </div>
                <div class="info-card">
                    <div class="info-card-label">Status</div>
                    <div class="info-card-value" style="color: #10B981;">✓ SUCCESS</div>
                </div>
            </div>
            
            <div class="escrow-box">
                <h3 style="margin: 0 0 10px 0; color: #D97706; font-size: 16px;">🔒 Funds Secured in Escrow</h3>
                <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.6;">
                    Your payment is held safely in our escrow system. The seller will receive payment only after you confirm delivery of your order.
                </p>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin: 30px 0;">
                This is an automated receipt for your records. Your order is being processed and will be shipped soon. 
                You'll receive another email with tracking information.
            </p>
            
            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 12px; color: #666;">
                    <strong>Need a refund?</strong> You can request a refund from your order page if there's an issue. 
                    All refunds are processed through the same payment method within 5-7 business days.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">NovaMart Payment Gateway</p>
            <p style="margin: 0;">Secure payments powered by Razorpay</p>
            <p style="margin: 10px 0 0 0;">© 2026 NovaMart. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `
    }),
    passwordReset: (user, resetLink) => ({
        subject: 'Password Reset Request - NovaMart',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #000; color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px 30px; text-align: center; }
        .button { display: inline-block; background: #000; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 30px 0; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; }
        .footer { background: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 12px; }
        .warning { font-size: 12px; color: #999; margin-top: 20px; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>NovaMart Security</h1>
        </div>
        <div class="content">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6;">
                Hi ${user.firstName || user.email.split('@')[0]},<br>
                We received a request to reset the password for your NovaMart account. 
                Click the button below to set a new password.
            </p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p class="warning">
                This link will expire in 1 hour. If you didn't request this, you can safely ignore this email. 
                Your password will remain unchanged.
            </p>
        </div>
        <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">NovaMart Hub</p>
            <p style="margin: 0;">Verified B2B Wholesale Ecosystem</p>
            <p style="margin: 10px 0 0 0;">© 2026 NovaMart. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `
    })
};

// Send email function
export const sendEmail = async (to, template) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'NovaMart <noreply@novamart.com>',
            to,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info('Email sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        logger.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

// Import Mongoose models
import { Order, Customer } from '../models/index.js';

// Specific email functions
export const sendOrderConfirmation = async (order) => {
    try {
        // Fetch customer details if not included
        const orderWithDetails = await Order.findById(order._id || order.id)
            .populate({
                path: 'customerId',
                populate: { path: 'userId' }
            })
            .populate('items.productId');

        if (!orderWithDetails) {
            throw new Error('Order not found');
        }

        const customerEmail = orderWithDetails.customerId?.userId?.email;
        if (!customerEmail) {
            throw new Error('Customer email not found');
        }

        const template = emailTemplates.orderConfirmation(orderWithDetails, orderWithDetails.customerId);

        return await sendEmail(customerEmail, template);
    } catch (error) {
        logger.error('Order confirmation email error:', error);
        return { success: false, error: error.message };
    }
};

export const sendPaymentConfirmation = async (payment, order) => {
    try {
        // Fetch full order with customer
        const orderWithDetails = await Order.findById(order._id || order.id)
            .populate({
                path: 'customerId',
                populate: { path: 'userId' }
            });

        if (!orderWithDetails) {
            throw new Error('Order not found');
        }

        const customerEmail = orderWithDetails.customerId?.userId?.email;
        if (!customerEmail) {
            throw new Error('Customer email not found');
        }

        const template = emailTemplates.paymentConfirmation(payment, order, orderWithDetails.customerId);

        return await sendEmail(customerEmail, template);
    } catch (error) {
        logger.error('Payment confirmation email error:', error);
        return { success: false, error: error.message };
    }
};

export default {
    sendEmail,
    sendOrderConfirmation,
    sendPaymentConfirmation,
    emailTemplates
};
