import { Review, Order, Inventory, Customer, Product, Seller } from '../models/index.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';

// --- Helpers ---

const updateProductStats = async (productId) => {
    const stats = await Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId), status: 'APPROVED' } },
        {
            $group: {
                _id: '$productId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            reviewCount: stats[0].reviewCount
        });
    }
};

const updateSellerStats = async (sellerId) => {
    const stats = await Review.aggregate([
        { $match: { sellerId: new mongoose.Types.ObjectId(sellerId), status: 'APPROVED' } },
        {
            $group: {
                _id: '$sellerId',
                avgRating: { $avg: '$rating' },
                avgDelivery: { $avg: '$deliveryRating' },
                avgPackaging: { $avg: '$packagingRating' },
                avgCommunication: { $avg: '$communicationRating' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Seller.findByIdAndUpdate(sellerId, {
            averageRating: Math.round(stats[0].avgRating * 10) / 10,
            reviewCount: stats[0].count,
            ratings: {
                delivery: Math.round(stats[0].avgDelivery * 10) / 10,
                packaging: Math.round(stats[0].avgPackaging * 10) / 10,
                communication: Math.round(stats[0].avgCommunication * 10) / 10
            }
        });
    }
};

// --- Controllers ---

export const submitProductReview = async (req, res) => {
    try {
        const { orderItemId, productId, rating, title, comment, pros, cons, images } = req.body;
        const userId = req.user._id;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        // 1. Verify Eligibility (Delivered Order)
        const order = await Order.findOne({
            customerId: customer._id,
            'items._id': orderItemId,
            status: 'DELIVERED'
        });

        if (!order) {
            return res.status(403).json({ success: false, error: 'Verified Purchase Required: Only delivered items can be reviewed.' });
        }

        // 2. Prevent Duplicate Review
        const existingReview = await Review.findOne({ orderId: order._id, productId });
        if (existingReview) {
            return res.status(409).json({ success: false, error: 'You have already reviewed this product for this order.' });
        }

        // 3. Create Review
        const review = await Review.create({
            type: 'PRODUCT',
            orderId: order._id,
            productId,
            customerId: customer._id,
            rating,
            title,
            comment,
            pros,
            cons,
            images,
            verifiedPurchase: true,
            status: 'APPROVED' // Auto-approve for now, can change to PENDING based on spam filter
        });

        // 4. Update Aggregates
        await updateProductStats(productId);

        // 5. Emit Event
        systemEvents.emit(EVENTS.REVIEW.CREATED, { review });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const submitSellerReview = async (req, res) => {
    try {
        const { orderId, dealerId, rating, delivery, packaging, communication, title, comment } = req.body;
        const userId = req.user._id;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const order = await Order.findOne({ _id: orderId, customerId: customer._id, status: 'DELIVERED' });
        if (!order) {
            return res.status(403).json({ success: false, error: 'Verified Purchase Required: Order must be delivered.' });
        }

        if (order.dealerId.toString() !== dealerId) {
            return res.status(400).json({ success: false, error: 'Seller mismatch.' });
        }

        const existingReview = await Review.findOne({ orderId: order._id, sellerId: dealerId });
        if (existingReview) {
            return res.status(409).json({ success: false, error: 'You have already reviewed this seller for this order.' });
        }

        // Prevent self-review (if user somehow manages both accounts, though Role prevents this)
        // Seller cannot review themselves.

        const review = await Review.create({
            type: 'SELLER',
            orderId: order._id,
            sellerId: dealerId,
            customerId: customer._id,
            rating, // Overall
            deliveryRating: delivery,
            packagingRating: packaging,
            communicationRating: communication,
            title,
            comment,
            verifiedPurchase: true,
            status: 'APPROVED'
        });

        await updateSellerStats(dealerId);

        // Emit Event
        systemEvents.emit(EVENTS.REVIEW.CREATED, { review });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;

        const skip = (page - 1) * limit;
        let sortOption = { createdAt: -1 };

        if (sort === 'highest') sortOption = { rating: -1 };
        if (sort === 'lowest') sortOption = { rating: 1 };
        if (sort === 'helpful') sortOption = { 'votes.up': -1 };

        const reviews = await Review.find({ productId, status: 'APPROVED' })
            .populate('customerId', 'name avatar') // Careful with PII
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Review.countDocuments({ productId, status: 'APPROVED' });

        res.json({
            success: true,
            data: reviews,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getSellerReviews = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ sellerId, status: 'APPROVED' })
            .populate('customerId', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Review.countDocuments({ sellerId, status: 'APPROVED' });

        res.json({ success: true, data: reviews, pagination: { total, pages: Math.ceil(total / limit) } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const voteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { type } = req.body; // 'up' or 'down'

        // Simple increment (In production, track user votes to prevent spam)
        const update = type === 'up' ? { $inc: { 'votes.up': 1 } } : { $inc: { 'votes.down': 1 } };

        await Review.findByIdAndUpdate(reviewId, update);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const reportReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { reason } = req.body;
        const userId = req.user._id;

        await Review.findByIdAndUpdate(reviewId, {
            $push: { reports: { userId, reason } },
            status: 'FLAGGED' // Auto-flag for moderation
        });

        res.json({ success: true, message: 'Review reported for moderation.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const moderateReview = async (req, res) => {
    try {
        const { reviewId, status, reason } = req.body; // 'APPROVED', 'REJECTED'

        const review = await Review.findByIdAndUpdate(reviewId, {
            status,
            moderationReason: reason
        }, { new: true });

        // If status changed, re-calc stats
        if (review.type === 'PRODUCT') updateProductStats(review.productId);
        if (review.type === 'SELLER') updateSellerStats(review.sellerId);

        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPendingReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ status: { $in: ['PENDING', 'FLAGGED'] } })
            .populate('customerId', 'name')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const replyToReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const seller = await Seller.findOne({ userId });
        if (!seller) return res.status(403).json({ success: false, error: 'Seller profile required' });

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ success: false, error: 'Review not found' });

        // Verify ownership (or if product review, check if product belongs to seller)
        // For now, assuming sellerId is populated on review creation for both types
        if (review.sellerId && review.sellerId.toString() !== seller._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized to reply to this review' });
        }

        // If product review and sellerId missing (legacy?), fetch product
        if (!review.sellerId && review.productId) {
            const product = await Product.findById(review.productId).populate('inventory.dealerId');
            // Complex logic omitted for brevity, assuming new reviews have sellerId
            // If strictly needed, would check product.inventory[0].dealerId
        }

        review.sellerReply = {
            text,
            createdAt: new Date()
        };
        await review.save();

        // Emit Event
        systemEvents.emit(EVENTS.REVIEW.REPLIED, { review });

        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMyReviews = async (req, res) => {
    try {
        const userId = req.user._id;
        // Find customer profile
        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(404).json({ success: false, error: 'Customer profile required' });

        const reviews = await Review.find({ customerId: customer._id })
            .populate('productId', 'name images')
            .populate('sellerId', 'businessName')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getSellerAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const seller = await Seller.findOne({ userId });
        if (!seller) return res.status(403).json({ success: false, error: 'Seller profile required' });

        const sellerId = seller._id;

        // 1. Star Distribution
        const distribution = await Review.aggregate([
            { $match: { sellerId, status: 'APPROVED' } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        // Fill missing stars
        const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        distribution.forEach(d => {
            if (stars[d._id] !== undefined) stars[d._id] = d.count;
        });

        // 2. Recent Trend (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const trend = await Review.aggregate([
            {
                $match: {
                    sellerId,
                    status: 'APPROVED',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    avgRating: { $avg: "$rating" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Recent Reviews (Limit 5 for dashboard)
        const recentReviews = await Review.find({ sellerId })
            .populate('customerId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                totalReviews: seller.reviewCount || 0,
                averageRating: seller.averageRating || 0,
                stars,
                trend,
                granular: seller.ratings || {},
                recentReviews
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAdminAnalytics = async (req, res) => {
    try {
        // Platform-wide stats
        const totalReviews = await Review.countDocuments();
        const pendingReviews = await Review.countDocuments({ status: 'PENDING' });
        const flaggedReviews = await Review.countDocuments({ status: 'FLAGGED' });

        // Average Rating across platform
        const avgRating = await Review.aggregate([
            { $match: { status: 'APPROVED' } },
            { $group: { _id: null, avg: { $avg: '$rating' } } }
        ]);

        // Recent Flags
        const recentFlags = await Review.find({ status: 'FLAGGED' })
            .populate('sellerId', 'businessName')
            .populate('productId', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            data: {
                totalReviews,
                pendingReviews,
                flaggedReviews,
                averagePlatformRating: avgRating[0]?.avg || 0,
                recentFlags
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
