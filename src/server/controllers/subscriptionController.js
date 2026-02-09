import prisma from '../lib/prisma.js';

// --- PLANS ---

export const getPlans = async (req, res) => {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { rank: 'asc' }
        });
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch plans' });
    }
};

export const seedPlans = async (req, res) => {
    try {
        // IDEMPOTENT SEED with Phase 6 Benefits
        const plans = [
            {
                name: 'BASIC', price: 0, duration: 365, margin: 5, rank: 1,
                features: ['Access to basic catalog', 'Standard Support'],
                wholesaleDiscount: 0, marginBoost: 0, priorityAllocation: false
            },
            {
                name: 'PRO', price: 4999, duration: 365, margin: 15, rank: 2,
                features: ['Priority Support', '5% Wholesale Discount', 'Verified Badge', '5% Margin Boost'],
                wholesaleDiscount: 5, marginBoost: 5, priorityAllocation: true
            },
            {
                name: 'ENTERPRISE', price: 14999, duration: 365, margin: 25, rank: 3,
                features: ['Dedicated Manager', '10% Wholesale Discount', 'Priority Stock Access', '10% Margin Boost'],
                wholesaleDiscount: 10, marginBoost: 10, priorityAllocation: true
            }
        ];

        for (const plan of plans) {
            const existing = await prisma.subscriptionPlan.findFirst({ where: { name: plan.name } });
            if (existing) {
                await prisma.subscriptionPlan.update({
                    where: { id: existing.id },
                    data: plan
                });
            } else {
                await prisma.subscriptionPlan.create({ data: plan });
            }
        }
        res.json({ success: true, message: 'Plans seeded and synchronized' });
    } catch (error) {
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
};

// --- DEALER SUBSCRIPTIONS ---

export const subscribeToPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { planId } = req.body;

        const dealer = await prisma.dealer.findUnique({ where: { userId } });
        if (!dealer) return res.status(404).json({ message: 'Dealer profile not found' });

        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        // Calculate End Date
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration);

        // One active subscription at a time rule
        await prisma.dealerSubscription.updateMany({
            where: { dealerId: dealer.id, status: 'ACTIVE' },
            data: { status: 'CANCELLED' }
        });

        const subscription = await prisma.dealerSubscription.create({
            data: {
                dealerId: dealer.id,
                planId: plan.id,
                endDate,
                status: 'ACTIVE'
            }
        });


        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        res.status(500).json({ message: 'Subscription failed' });
    }
};

export const getMySubscription = async (req, res) => {
    try {
        const userId = req.user.id;
        const dealer = await prisma.dealer.findUnique({
            where: { userId },
            include: {
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    include: { plan: true },
                    orderBy: { endDate: 'desc' },
                    take: 1
                }
            }
        });

        if (!dealer) return res.status(404).json({ message: 'Dealer not found' });

        const activeSub = dealer.subscriptions[0] || null;
        res.json({ success: true, data: activeSub });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscription' });
    }
};

export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user.id;
        const dealer = await prisma.dealer.findUnique({ where: { userId } });

        await prisma.dealerSubscription.updateMany({
            where: { dealerId: dealer.id, status: 'ACTIVE' },
            data: { status: 'CANCELLED' }
        });

        res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Cancellation failed' });
    }
};

export default {
    getPlans,
    seedPlans,
    subscribeToPlan,
    getMySubscription,
    cancelSubscription
};
