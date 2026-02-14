import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../lib/logger.js';
import EmailLog from '../models/EmailLog.js';
import { Order, Review } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const TEMPLATE_DIR = path.join(__dirname, '../templates');
const EMAIL_FROM = process.env.EMAIL_FROM || 'NovaMart <noreply@novamart.com>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// --- Transporter Setup ---
const createTransporter = () => {
    if (process.env.NODE_ENV === 'production' || (process.env.SMTP_USER && process.env.SMTP_PASSWORD)) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT || '2525'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    // Mock Transporter for Dev (if no creds)
    logger.warn('⚠️ No SMTP credentials found. Using Mock Email Transporter.');
    return {
        sendMail: async (options) => {
            logger.info(`[MOCK EMAIL] To: ${options.to} | Subject: ${options.subject}`);
            return { messageId: `mock-${Date.now()}` };
        }
    };
};

const transporter = createTransporter();

// --- Template Engine ---
const loadTemplate = (templateName, data) => {
    try {
        const layoutPath = path.join(TEMPLATE_DIR, 'layout.html');
        const templatePath = path.join(TEMPLATE_DIR, `${templateName}.html`);

        // Load Base Layout
        let layout = fs.readFileSync(layoutPath, 'utf8');

        // Load Content Template
        let content = fs.readFileSync(templatePath, 'utf8');

        // Replace Content Placeholders
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, data[key] || '');
        });

        // Inject Content into Layout
        let finalHtml = layout.replace('{{content}}', content);

        // Replace Global Layout Placeholders
        const globalData = {
            frontendUrl: FRONTEND_URL,
            year: new Date().getFullYear(),
            ...data
        };

        Object.keys(globalData).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalHtml = finalHtml.replace(regex, globalData[key] || '');
        });

        return finalHtml;

    } catch (error) {
        logger.error(`Error loading template ${templateName}:`, error);
        throw new Error('Email template loading failed');
    }
};

// --- Core Send Function ---
const sendEmail = async ({ to, subject, templateName, data, userId, emailType, orderId = null }) => {
    try {
        // 1. Duplicate Prevention
        if (emailType && userId) {
            const existingLog = await EmailLog.findOne({
                userId,
                emailType,
                orderId,
                status: 'SENT',
                createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Prevent dupes within 24h
            });

            if (existingLog) {
                logger.info(`🚫 Duplicate email prevented: ${emailType} for User ${userId}`);
                return { success: true, skipped: true };
            }
        }

        // 2. Render HTML
        const html = loadTemplate(templateName, data);

        // 3. Send Email
        const info = await transporter.sendMail({
            from: EMAIL_FROM,
            to,
            subject,
            html
        });

        // 4. Log Success
        if (userId && emailType) {
            await EmailLog.create({
                userId,
                emailType,
                recipientEmail: to,
                orderId,
                status: 'SENT',
                messageId: info.messageId,
                metadata: { template: templateName }
            });
        }

        logger.info(`✅ Email Sent: ${emailType} to ${to}`);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        logger.error(`❌ Email Failed: ${emailType || 'Unknown'} to ${to}`, error);

        // Log Failure
        if (userId && emailType) {
            await EmailLog.create({
                userId,
                emailType,
                recipientEmail: to,
                orderId,
                status: 'FAILED',
                metadata: { error: error.message }
            });
        }

        return { success: false, error: error.message };
    }
};

// --- Public Methods ---

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (user) => {
    const roleMap = {
        'CUSTOMER': 'WELCOME_CUSTOMER',
        'SELLER': 'WELCOME_SELLER',
        'MANUFACTURER': 'WELCOME_MANUFACTURER',
        'ADMIN': 'WELCOME_ADMIN' // Optional
    };

    return await sendEmail({
        to: user.email,
        subject: 'Welcome to NovaMart! 🚀',
        templateName: 'welcome',
        data: {
            name: user.name || user.firstName || 'User',
            role: user.role.charAt(0) + user.role.slice(1).toLowerCase(),
            email: user.email,
            actionUrl: `${FRONTEND_URL}/${user.role.toLowerCase()}`
        },
        userId: user._id,
        emailType: roleMap[user.role]
    });
};

/**
 * Send Forgot Password Email
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
    // Determine the frontend route based on role if needed, or use a generic auth route
    // Assuming /auth/reset-password?token=...
    const resetUrl = `${FRONTEND_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    return await sendEmail({
        to: user.email,
        subject: 'Reset Your NovaMart Password 🔒',
        templateName: 'forgot-password',
        data: {
            name: user.name || 'User',
            actionUrl: resetUrl
        },
        userId: user._id,
        emailType: 'FORGOT_PASSWORD'
    });
};

/**
 * Send Order Confirmation
 */
export const sendOrderConfirmation = async (orderId) => {
    try {
        const order = await Order.findById(orderId)
            .populate('customerId')
            .populate({ path: 'items.productId', select: 'name' });
        // Note: In real app, might need deep population to get user email from customer

        // Deep populate helper if needed (depending on your schema structure)
        // Assuming Order -> Customer -> User (where email is)
        // If not populated, fetch manually.

        if (!order) throw new Error('Order not found');

        // We need the User ID to log this email
        // Check schema: Order.customerId might be a Customer Profile, which links to User
        // Or if your Order schema has userId directly.
        // Adjusting based on standard schema patterns:

        // Re-fetching with correct populate if needed. 
        // Assuming Order has 'customerId' which is the Customer Profile
        // and Customer Profile has 'userId'.

        const fullOrder = await Order.findById(orderId).populate({
            path: 'customerId',
            populate: { path: 'userId' }
        });

        const user = fullOrder.customerId?.userId;
        const customerEmail = user?.email;

        if (!customerEmail) {
            throw new Error(`Customer email not found for Order ${orderId}`);
        }

        const itemsHtml = fullOrder.items.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productId?.name || 'Product'}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">x${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${item.price}</td>
            </tr>
        `).join('');

        return await sendEmail({
            to: customerEmail,
            subject: `Order Confirmed #${fullOrder._id.toString().slice(-6).toUpperCase()}`,
            templateName: 'order-confirmation',
            data: {
                name: user.name || 'Customer',
                orderId: fullOrder._id.toString().slice(-6).toUpperCase(),
                totalAmount: `₹${fullOrder.totalAmount}`,
                deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Mock +5 days
                itemsHtml,
                actionUrl: `${FRONTEND_URL}/customer/orders/${fullOrder._id}`
            },
            userId: user._id,
            emailType: 'ORDER_CONFIRMATION',
            orderId: fullOrder._id
        });

    } catch (error) {
        logger.error('Order Confirmation Email Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send Order Shipped
 */
export const sendOrderShipped = async (orderId, trackingNumber = 'N/A', carrier = 'Logistics Partner') => {
    try {
        const fullOrder = await Order.findById(orderId).populate({
            path: 'customerId',
            populate: { path: 'userId' }
        });

        const user = fullOrder.customerId?.userId;
        const customerEmail = user?.email;

        if (!customerEmail) return { success: false, error: 'No email found' };

        return await sendEmail({
            to: customerEmail,
            subject: `Your Order #${fullOrder._id.toString().slice(-6).toUpperCase()} has Shipped! 🚚`,
            templateName: 'order-shipped',
            data: {
                name: user.name || 'Customer',
                orderId: fullOrder._id.toString().slice(-6).toUpperCase(),
                trackingNumber,
                carrier,
                actionUrl: `${FRONTEND_URL}/customer/orders/${fullOrder._id}`
            },
            userId: user._id,
            emailType: 'ORDER_SHIPPED',
            orderId: fullOrder._id
        });

    } catch (error) {
        logger.error('Order Shipped Email Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send Order Delivered
 */
export const sendOrderDelivered = async (orderId) => {
    try {
        const fullOrder = await Order.findById(orderId).populate({
            path: 'customerId',
            populate: { path: 'userId' }
        });

        const user = fullOrder.customerId?.userId;
        const customerEmail = user?.email;

        if (!customerEmail) return { success: false, error: 'No email found' };

        return await sendEmail({
            to: customerEmail,
            subject: `Your Order #${fullOrder._id.toString().slice(-6).toUpperCase()} is Delivered! 📦`,
            templateName: 'order-delivered',
            data: {
                name: user.name || 'Customer',
                orderId: fullOrder._id.toString().slice(-6).toUpperCase(),
                shippingAddress: fullOrder.shippingAddress || 'Your Address',
                actionUrl: `${FRONTEND_URL}/customer/reviews/new?orderId=${fullOrder._id}`
            },
            userId: user._id,
            emailType: 'ORDER_DELIVERED',
            orderId: fullOrder._id
        });

    } catch (error) {
        logger.error('Order Delivered Email Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send New Review Notification to Seller
 */
export const sendReviewNotification = async (review) => {
    try {
        // Deep populate to get names and emails
        // We likely need to fetch the review with populated fields if not already passed
        // Or assume the subscriber handles fetching full data. 
        // Let's safe-guard by fetching here or assuming data structure.
        // Best practice: Fetch fresh data to ensure we have emails.
        const fullReview = await Review.findById(review._id)
            .populate({ path: 'sellerId', populate: { path: 'userId' } }) // Seller Email
            .populate('customerId') // Customer Name
            .populate('productId'); // Product Name

        const sellerUser = fullReview.sellerId?.userId;
        const sellerEmail = sellerUser?.email;

        if (!sellerEmail) {
            logger.warn(`No seller email found for review ${review._id}`);
            return { success: false, error: 'No seller email' };
        }

        return await sendEmail({
            to: sellerEmail,
            subject: `New ${fullReview.rating}-Star Review for ${fullReview.productId?.name || 'Your Product'} 🌟`,
            templateName: 'new-review', // We might need to create this or use specific mock log
            data: {
                name: sellerUser.name || 'Seller',
                customerName: fullReview.customerId?.name || 'A Customer',
                productName: fullReview.productId?.name || 'Product',
                rating: fullReview.rating,
                title: fullReview.title || 'Review',
                comment: fullReview.comment,
                actionUrl: `${FRONTEND_URL}/dashboard/seller/reviews` // Deep link to dashboard
            },
            userId: sellerUser._id,
            emailType: 'REVIEW_RECEIVED'
        });

    } catch (error) {
        logger.error('Review Notification Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send Reply Notification to Customer
 */
export const sendReplyNotification = async (review) => {
    try {
        const fullReview = await Review.findById(review._id)
            .populate({ path: 'customerId', populate: { path: 'userId' } }) // Customer Email
            .populate('sellerId') // Seller Business Name
            .populate('productId');

        const customerUser = fullReview.customerId?.userId;
        const customerEmail = customerUser?.email;

        if (!customerEmail) {
            logger.warn(`No customer email found for review ${review._id}`);
            return { success: false, error: 'No customer email' };
        }

        return await sendEmail({
            to: customerEmail,
            subject: `Response to your review on ${fullReview.productId?.name || 'NovaMart'} 💬`,
            templateName: 'review-reply',
            data: {
                name: customerUser.name || 'Customer',
                sellerName: fullReview.sellerId?.businessName || 'Seller',
                productName: fullReview.productId?.name || 'Product',
                replyText: fullReview.sellerReply?.text || '',
                actionUrl: `${FRONTEND_URL}/products/${fullReview.productId?._id}`
            },
            userId: customerUser._id,
            emailType: 'REVIEW_REPLIED'
        });

    } catch (error) {
        logger.error('Reply Notification Error:', error);
        return { success: false, error: error.message };
    }
};

export default {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendOrderConfirmation,
    sendOrderShipped,
    sendOrderDelivered,
    sendReviewNotification,
    sendReplyNotification,
    // Legacy export for backward compatibility if needed, but preferred to be specific
    sendEmail
};
