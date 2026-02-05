/**
 * Invoice Service
 * Handles GST invoice generation and tax breakdowns.
 */

import prisma from '../lib/prisma.js';

class InvoiceService {
    /**
     * Generate metadata for a GST Invoice.
     */
    async generateInvoiceData(orderId) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                customer: { include: { user: true } },
                dealer: { include: { user: true } },
                items: { include: { product: true } }
            }
        });

        if (!order) throw new Error('Order not found');

        // Tax Breakdown (JSON for frontend rendering)
        const subtotal = Number(order.totalAmount);
        const taxAmount = Number(order.taxAmount);
        const total = subtotal + taxAmount;

        const invoiceData = {
            invoiceNumber: `INV-${order.id.slice(0, 8).toUpperCase()}`,
            date: new Date(),
            billingDetails: {
                customerName: order.customer.name,
                customerPhone: order.customer.user.phone,
                dealerName: order.dealer.businessName,
                dealerGst: order.dealer.gstNumber,
                dealerAddress: order.dealer.businessAddress
            },
            items: order.items.map(item => ({
                name: item.product.name,
                hsn: "8481", // Mock HSN code
                quantity: item.quantity,
                unitPrice: Number(item.price),
                total: Number(item.price) * item.quantity
            })),
            financials: {
                subtotal,
                taxAmount,
                taxRate: "18%", // Fetched from rule previously
                total
            },
            footer: "Computer generated invoice. No signature required."
        };

        // Update order with invoice URL/ID (Mock for now)
        await prisma.order.update({
            where: { id: orderId },
            data: { invoiceUrl: `/api/orders/${orderId}/invoice` }
        });

        return invoiceData;
    }
}

export default new InvoiceService();
