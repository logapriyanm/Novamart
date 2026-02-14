
import mongoose from 'mongoose';
import { Order } from './src/server/models/index.js';

const MONGODB_URI = "mongodb://localhost:27017/novamart";

console.log('Script loaded. Connecting...');

async function checkOrders() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if Order model is registered
        if (!mongoose.models.Order) {
            console.log('Order model not registered in mongoose.models');
        } else {
            console.log('Order model registered');
        }

        const orderCount = await Order.countDocuments({});
        console.log(`Total Orders: ${orderCount}`);

        const statusCounts = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 }, totalRevenue: { $sum: "$totalAmount" } } }
        ]);

        console.log('Order Status Counts:', JSON.stringify(statusCounts, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

checkOrders();
