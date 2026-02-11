
import HomePageCMS from '../models/HomePageCMS.js';
import logger from '../lib/logger.js';

/**
 * Get active sections for the Home Page based on user role
 */
export const getHomeConfig = async (req, res) => {
    try {
        const userRole = req.user ? req.user.role : 'GUEST';
        const currentDate = new Date();

        const query = {
            isActive: true,
            visibleFor: userRole,
            // Check if schedule is either not set OR current date is within range
            $or: [
                { schedule: { $exists: false } },
                { schedule: null },
                {
                    $and: [
                        { 'schedule.startDate': { $lte: currentDate } },
                        { $or: [{ 'schedule.endDate': { $gte: currentDate } }, { 'schedule.endDate': null }] }
                    ]
                }
            ]
        };

        const sections = await HomePageCMS.find(query).sort({ order: 1 }).lean();

        res.json({
            success: true,
            data: sections
        });
    } catch (error) {
        logger.error('Failed to fetch CMS config:', error);
        res.status(500).json({ success: false, error: 'CMS_FETCH_FAILED' });
    }
};

/**
 * Get all sections (Admin) with full details
 */
export const getAllSections = async (req, res) => {
    try {
        const sections = await HomePageCMS.find({}).sort({ order: 1 }).lean();
        res.json({ success: true, data: sections });
    } catch (error) {
        logger.error('Failed to fetch all sections:', error);
        res.status(500).json({ success: false, error: 'CMS_ADMIN_FETCH_FAILED' });
    }
};

/**
 * Create a new section
 */
export const createSection = async (req, res) => {
    try {
        const { sectionKey, title, componentName, order, visibleFor, content } = req.body;

        const newSection = new HomePageCMS({
            sectionKey,
            title,
            componentName,
            order,
            visibleFor,
            content,
            metadata: {
                lastUpdatedBy: req.user._id
            }
        });

        await newSection.save();
        res.status(201).json({ success: true, data: newSection });
    } catch (error) {
        logger.error('Failed to create section:', error);
        res.status(500).json({ success: false, error: error.code === 11000 ? 'DUPLICATE_KEY' : 'CREATE_FAILED' });
    }
};

/**
 * Update an existing section
 */
export const updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const section = await HomePageCMS.findByIdAndUpdate(
            id,
            {
                ...updates,
                'metadata.lastUpdatedAt': new Date(),
                'metadata.lastUpdatedBy': req.user._id
            },
            { new: true }
        );

        if (!section) {
            return res.status(404).json({ success: false, error: 'SECTION_NOT_FOUND' });
        }

        res.json({ success: true, data: section });
    } catch (error) {
        logger.error('Failed to update section:', error);
        res.status(500).json({ success: false, error: 'UPDATE_FAILED' });
    }
};

/**
 * Reorder sections
 * Expects body: { "sectionOrders": [{ "id": "...", "order": 1 }, ...] }
 */
export const reorderSections = async (req, res) => {
    try {
        const { sectionOrders } = req.body;

        if (!Array.isArray(sectionOrders)) {
            return res.status(400).json({ success: false, error: 'INVALID_FORMAT' });
        }

        const bulkOps = sectionOrders.map(({ id, order }) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { order: Number(order) } }
            }
        }));

        await HomePageCMS.bulkWrite(bulkOps);

        res.json({ success: true, message: 'Sections reordered successfully' });
    } catch (error) {
        logger.error('Failed to reorder sections:', error);
        res.status(500).json({ success: false, error: 'REORDER_FAILED' });
    }
};

/**
 * Seed Default Sections
 * Use this to populate the DB with the initial hardcoded structure
 */
export const seedDefaults = async (req, res) => {
    try {
        const count = await HomePageCMS.countDocuments();
        if (count > 0 && !req.query.force) {
            return res.json({ success: true, message: 'CMS already seeded. Use ?force=true to overwrite.' });
        }

        if (req.query.force) {
            await HomePageCMS.deleteMany({});
        }

        const defaults = [
            {
                sectionKey: 'hero',
                title: 'Hero Section',
                componentName: 'HeroSection',
                order: 10,
                visibleFor: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true
            },
            {
                sectionKey: 'brand_spotlight',
                title: 'Brand Spotlight',
                componentName: 'BrandSpotlight',
                order: 20,
                visibleFor: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true
            },
            {
                sectionKey: 'trending_bar',
                title: 'Trending Now',
                componentName: 'TrendingBar',
                order: 30,
                visibleFor: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true
            },
            {
                sectionKey: 'customer_offers',
                title: 'Exclusive Offers',
                componentName: 'CustomerOffers',
                order: 40,
                visibleFor: ['GUEST', 'CUSTOMER'],
                isActive: true
            },
            {
                sectionKey: 'bestsellers',
                title: 'Bestsellers',
                componentName: 'BestsellerSlider',
                order: 50,
                visibleFor: ['GUEST', 'CUSTOMER'],
                isActive: true
            },
            // Personalized sections (Frontend handles conditional rendering if data exists)
            {
                sectionKey: 'occasion_banner',
                title: 'Special Occasion Banner',
                componentName: 'OccasionBanner',
                order: 55,
                visibleFor: ['CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true
            },
            {
                sectionKey: 'b2b_shortcuts',
                title: 'B2B Quick Actions',
                componentName: 'B2BShortcuts',
                order: 60,
                visibleFor: ['DEALER', 'MANUFACTURER'],
                isActive: true
            },
            {
                sectionKey: 'recommended_hero',
                title: 'Recommended For You',
                componentName: 'RecommendedProducts',
                order: 65,
                visibleFor: ['CUSTOMER', 'DEALER'],
                isActive: true,
                content: { title: "Top Pick For You" }
            },
            {
                sectionKey: 'continue_viewing',
                title: 'Continue Viewing',
                componentName: 'RecommendedProducts',
                order: 66,
                visibleFor: ['CUSTOMER', 'DEALER'],
                isActive: true,
                content: { title: "Continue Where You Left Off" }
            },
            {
                sectionKey: 'trust_strip',
                title: 'Trust Indicators',
                componentName: 'TrustStrip',
                order: 70,
                visibleFor: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true
            },
            {
                sectionKey: 'category_grid',
                title: 'Shop By Category',
                componentName: 'CategoryGrid',
                order: 80,
                visibleFor: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true
            },
            {
                sectionKey: 'why_novamart',
                title: 'Why NovaMart',
                componentName: 'WhyNovaMart',
                order: 90,
                visibleFor: ['GUEST'],
                isActive: true
            },
            {
                sectionKey: 'manufacturers_grid',
                title: 'Our Manufacturers',
                componentName: 'ManufacturersGrid',
                order: 100,
                visibleFor: ['GUEST'],
                isActive: true
            },
            {
                sectionKey: 'testimonials',
                title: 'Customer Testimonials',
                componentName: 'Testimonials',
                order: 110,
                visibleFor: ['GUEST'],
                isActive: true
            }
        ];

        await HomePageCMS.insertMany(defaults);
        res.json({ success: true, message: `Seeded ${defaults.length} sections.` });

    } catch (error) {
        logger.error('Failed to seed CMS:', error);
        res.status(500).json({ success: false, error: 'SEED_FAILED' });
    }
};

export default {
    getHomeConfig,
    getAllSections,
    createSection,
    updateSection,
    reorderSections,
    seedDefaults
};
