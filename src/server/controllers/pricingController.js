import PricingRule from '../models/PricingRule.js';
import Product from '../models/Product.js';
import logger from '../lib/logger.js';

export const createRule = async (req, res) => {
    try {
        const { name, type, minQuantity, discountPercentage, validFrom, validUntil, productId, sellerId } = req.body;

        // Basic validation
        if (!name || !discountPercentage) {
            return res.status(400).json({ message: 'Name and discount percentage are required' });
        }

        const rule = await PricingRule.create({
            manufacturerId: req.user._id,
            name,
            type,
            minQuantity: minQuantity || 1,
            discountPercentage,
            validFrom: validFrom || Date.now(),
            validUntil,
            productId,
            sellerId
        });

        logger.info(`Pricing rule created: ${rule._id} by ${req.user._id}`);
        res.status(201).json(rule);
    } catch (error) {
        logger.error('Create Pricing Rule Error:', error);
        res.status(500).json({ message: 'Failed to create pricing rule' });
    }
};

export const getRules = async (req, res) => {
    try {
        const query = { manufacturerId: req.user._id };

        // Optional filters
        if (req.query.type) query.type = req.query.type;
        if (req.query.active === 'true') query.isActive = true;

        const rules = await PricingRule.find(query)
            .populate('productId', 'name images basePrice category')
            .populate('sellerId', 'email businessName') // Assuming seller profile is merged or accessible
            .sort({ createdAt: -1 });

        res.json(rules);
    } catch (error) {
        logger.error('Get Pricing Rules Error:', error);
        res.status(500).json({ message: 'Failed to fetch pricing rules' });
    }
};

export const deleteRule = async (req, res) => {
    try {
        const rule = await PricingRule.findOneAndDelete({
            _id: req.params.id,
            manufacturerId: req.user._id
        });

        if (!rule) {
            return res.status(404).json({ message: 'Rule not found or unauthorized' });
        }

        logger.info(`Pricing rule deleted: ${req.params.id} by ${req.user._id}`);
        res.json({ message: 'Rule deleted successfully' });
    } catch (error) {
        logger.error('Delete Pricing Rule Error:', error);
        res.status(500).json({ message: 'Failed to delete pricing rule' });
    }
};

export const toggleRuleStatus = async (req, res) => {
    try {
        const rule = await PricingRule.findOne({
            _id: req.params.id,
            manufacturerId: req.user._id
        });

        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        rule.isActive = !rule.isActive;
        await rule.save();

        res.json(rule);
    } catch (error) {
        logger.error('Toggle Rule Status Error:', error);
        res.status(500).json({ message: 'Failed to update rule status' });
    }
};
