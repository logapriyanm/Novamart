/**
 * Invoice Service
 * Handles GST invoice generation and tax breakdowns.
 */

import { Order, Customer, Seller } from '../models/index.js';

class InvoiceService {
    /**
     * Generate metadata for a GST Invoice.
     */
    async generateInvoiceData(orderId) {
        const order = await Order.findById(orderId)
            .populate({
                path: 'customerId',
                populate: { path: 'userId' }
            })
            .populate({
                path: 'dealerId',
                populate: { path: 'userId' }
            })
            .populate('items.productId');

        if (!order) throw new Error('Order not found');

        // Tax Breakdown
        const subtotal = Number(order.totalAmount);
        const taxAmount = Number(order.taxAmount);
        const total = subtotal + taxAmount;

        const invoiceData = {
            invoiceNumber: `INV-${order._id.toString().slice(0, 8).toUpperCase()}`,
            date: new Date(),
            billingDetails: {
                customerName: order.customerId?.name || 'Customer',
                customerPhone: order.customerId?.userId?.phone,
                dealerName: order.dealerId?.businessName,
                dealerGst: order.dealerId?.gstNumber,
                dealerAddress: order.dealerId?.businessAddress
            },
            items: order.items.map(item => ({
                name: item.productId?.name || 'Product',
                hsn: "8481", // Mock HSN code
                quantity: item.quantity,
                unitPrice: Number(item.price),
                total: Number(item.price) * item.quantity
            })),
            financials: {
                subtotal,
                taxAmount,
                taxRate: "18%",
                total
            },
            footer: "Computer generated invoice. No signature required."
        };

        // Update order with invoice URL
        await Order.findByIdAndUpdate(orderId, {
            invoiceUrl: `/api/orders/${orderId}/invoice`
        });

        return invoiceData;
    }
}

export default new InvoiceService();

