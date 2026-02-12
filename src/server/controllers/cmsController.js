
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
        const updates = { ...req.body };

        // Sanitize immutable or sensitive fields
        delete updates._id;
        delete updates.__v;
        delete updates.createdAt;
        delete updates.updatedAt;
        delete updates.metadata; // Prevent conflict with specific metadata updates
        delete updates.sectionKey; // Immutable

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
        res.status(500).json({
            success: false,
            error: 'UPDATE_FAILED',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
                isActive: true,
                content: {
                    slides: [
                        { id: 1, title: 'Upgrade Your', highlight: 'Home Appliances', description: 'Discover premium appliances from top manufacturers at factory-direct prices.', discount: 'Up to 40% OFF', subText: 'Limited Time Offer', tag: 'New Arrivals', ctaText: 'Shop Now', ctaLink: '/products', secondaryCta: 'Learn More', image: '/assets/hero1.png' },
                        { id: 2, title: 'Smart Kitchen', highlight: 'Revolution', description: 'Modern cooking appliances that make your kitchen smarter and more efficient.', discount: 'Flat 25% OFF', subText: 'Kitchen Appliances', tag: 'Best Sellers', ctaText: 'Explore', ctaLink: '/products?cat=kitchen-appliances', secondaryCta: 'View All', image: '/assets/hero2.png' }
                    ]
                }
            },
            {
                sectionKey: 'brand_spotlight',
                title: 'Brand Spotlight',
                componentName: 'BrandSpotlight',
                order: 20,
                visibleFor: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true,
                content: {
                    setups: [
                        { name: 'Kitchen', description: 'Complete Kitchen Setup', image: '/assets/kitchen-setup.jpg', link: '/products?cat=kitchen-appliances' },
                        { name: 'Living Room', description: 'Smart Living Essentials', image: '/assets/living-setup.jpg', link: '/products?cat=home-comfort' },
                        { name: 'Laundry', description: 'Premium Laundry Care', image: '/assets/laundry-setup.jpg', link: '/products?cat=washing-machines' }
                    ]
                }
            },
            {
                sectionKey: 'trending_bar',
                title: 'Trending Now',
                componentName: 'TrendingBar',
                order: 30,
                visibleFor: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true,
                content: {
                    categories: [
                        { name: 'Refrigerators', image: '/assets/trending-fridge.png' },
                        { name: 'Washing Machines', image: '/assets/trending-washer.png' },
                        { name: 'Air Conditioners', image: '/assets/trending-ac.png' },
                        { name: 'Microwave Ovens', image: '/assets/trending-microwave.png' },
                        { name: 'Television', image: '/assets/trending-tv.png' },
                        { name: 'Water Purifiers', image: '/assets/trending-purifier.png' }
                    ]
                }
            },
            {
                sectionKey: 'customer_offers',
                title: 'Exclusive Offers',
                componentName: 'CustomerOffers',
                order: 40,
                visibleFor: ['GUEST', 'CUSTOMER'],
                isActive: true,
                content: {
                    offers: [
                        { id: 1, icon: 'FaGift', title: 'First-Time Buyer Bonus', subtitle: 'Welcome Offer', badge: 'New', lightColor: 'bg-indigo-50', color: 'bg-indigo-600', details: ['Flat 15% off on first order', 'Free shipping on orders above ₹999', 'Easy returns within 7 days'], purpose: ['Acquisition', 'Onboarding'] },
                        { id: 2, icon: 'FaStar', title: 'Loyalty Rewards', subtitle: 'Repeat Purchase', lightColor: 'bg-amber-50', color: 'bg-amber-600', details: ['Earn points on every purchase', 'Redeem for discounts', 'Exclusive member sales'], purpose: ['Retention', 'Engagement'] },
                        { id: 3, icon: 'FaCalendarAlt', title: 'Seasonal Festival Sale', subtitle: 'Limited Period', badge: 'Hot', lightColor: 'bg-rose-50', color: 'bg-rose-600', details: ['Up to 50% off on select items', 'Bundle deals on appliances', 'EMI options available'], purpose: ['Revenue', 'Clearance'] }
                    ],
                    ctaTitle: 'Ready to unlock exclusive benefits?',
                    ctaSubtitle: 'Join thousands of satisfied shoppers on NovaMart and experience a smarter way to shop with premium savings.'
                }
            },
            {
                sectionKey: 'bestsellers',
                title: 'Bestsellers',
                componentName: 'BestsellerSlider',
                order: 50,
                visibleFor: ['GUEST', 'CUSTOMER'],
                isActive: true,
                content: {
                    products: [
                        { id: 1, title: 'Smart Inverter Refrigerator', category: 'Home Appliances', image: '/assets/BestSeller.png', price: '₹42,999', status: 'In Stock' },
                        { id: 2, title: 'Front Load Washing Machine', category: 'Laundry', image: '/assets/BestSeller2.png', price: '₹34,500', status: 'Selling Fast' },
                        { id: 3, title: '4K QLED Smart TV 55"', category: 'Entertainment', image: '/assets/BestSeller3.png', price: '₹54,990', status: 'In Stock' },
                        { id: 4, title: 'Convection Microwave Oven', category: 'Kitchen', image: '/assets/BestSeller4.png', price: '₹14,200', status: 'Limited Stock' },
                        { id: 5, title: 'Inverter Split AC 1.5 Ton', category: 'Cooling', image: '/assets/BestSeller5.png', price: '₹38,990', status: 'Best Seller' }
                    ]
                }
            },
            {
                sectionKey: 'occasion_banner',
                title: 'Special Occasion Banner',
                componentName: 'OccasionBanner',
                order: 55,
                visibleFor: ['CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true,
                content: {}
            },
            {
                sectionKey: 'b2b_shortcuts',
                title: 'B2B Quick Actions',
                componentName: 'B2BShortcuts',
                order: 60,
                visibleFor: ['DEALER', 'MANUFACTURER'],
                isActive: true,
                content: {}
            },
            {
                sectionKey: 'recommended_hero',
                title: 'Recommended For You',
                componentName: 'RecommendedProducts',
                order: 65,
                visibleFor: ['CUSTOMER', 'DEALER'],
                isActive: true,
                content: { title: 'Top Pick For You' }
            },
            {
                sectionKey: 'continue_viewing',
                title: 'Continue Viewing',
                componentName: 'RecommendedProducts',
                order: 66,
                visibleFor: ['CUSTOMER', 'DEALER'],
                isActive: true,
                content: { title: 'Continue Where You Left Off' }
            },
            {
                sectionKey: 'trust_strip',
                title: 'Trust Indicators',
                componentName: 'TrustStrip',
                order: 70,
                visibleFor: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true,
                content: {
                    items: [
                        { icon: 'FaShieldAlt', title: 'Verified Sellers', desc: 'Every manufacturer is verified and audited' },
                        { icon: 'FaBoxOpen', title: 'Genuine Products', desc: '100% authentic products guaranteed' },
                        { icon: 'FaUserCheck', title: 'Trusted Platform', desc: 'Rated 4.8/5 by 10K+ buyers' },
                        { icon: 'FaLock', title: 'Secure Payments', desc: 'SSL encrypted secure checkout' }
                    ]
                }
            },
            {
                sectionKey: 'category_grid',
                title: 'Shop By Category',
                componentName: 'CategoryGrid',
                order: 80,
                visibleFor: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER'],
                isActive: true,
                content: {}
            },
            {
                sectionKey: 'delivery_partners',
                title: 'Delivery Partners',
                componentName: 'DeliveryPartners',
                order: 85,
                visibleFor: ['GUEST', 'CUSTOMER'],
                isActive: true,
                content: {
                    partners: [
                        { name: 'DHL Express', icon: 'FaDhl', color: '#D4001A' },
                        { name: 'UPS', icon: 'FaUps', color: '#351C15' },
                        { name: 'FedEx', icon: 'FaFedex', color: '#4D148C' },
                        { name: 'NovaMart Express', icon: 'FaShippingFast', color: '#10367D' },
                        { name: 'BlueDart', icon: 'FaTruckMoving', color: '#003399' },
                        { name: 'Ecom Express', icon: 'FaBoxOpen', color: '#FF6600' }
                    ]
                }
            },
            {
                sectionKey: 'why_novamart',
                title: 'Why NovaMart',
                componentName: 'WhyNovaMart',
                order: 90,
                visibleFor: ['GUEST'],
                isActive: true,
                content: {
                    features: [
                        { icon: 'FaShieldAlt', title: 'Verified Supply Chain', desc: 'Every product is sourced directly from certified manufacturers with full traceability.' },
                        { icon: 'FaHandshake', title: 'Fair Trade Practices', desc: 'Transparent pricing with no hidden fees. Direct factory-to-consumer model.' },
                        { icon: 'FaUserShield', title: 'Buyer Protection', desc: 'Full refund guarantee and dispute resolution within 48 hours.' },
                        { icon: 'FaGem', title: 'Premium Quality', desc: 'Rigorous quality checks on every product before it reaches you.' }
                    ]
                }
            },
            {
                sectionKey: 'manufacturers_grid',
                title: 'Our Manufacturers',
                componentName: 'ManufacturersGrid',
                order: 100,
                visibleFor: ['GUEST'],
                isActive: true,
                content: {
                    manufacturers: [
                        { name: 'Samsung', location: 'South Korea', image: '/assets/brands/samsung.png' },
                        { name: 'LG', location: 'South Korea', image: '/assets/brands/lg.png' },
                        { name: 'Whirlpool', location: 'USA', image: '/assets/brands/whirlpool.png' },
                        { name: 'Bosch', location: 'Germany', image: '/assets/brands/bosch.png' },
                        { name: 'Godrej', location: 'India', image: '/assets/brands/godrej.png' },
                        { name: 'Haier', location: 'China', image: '/assets/brands/haier.png' }
                    ]
                }
            },
            {
                sectionKey: 'testimonials',
                title: 'Customer Testimonials',
                componentName: 'Testimonials',
                order: 110,
                visibleFor: ['GUEST'],
                isActive: true,
                content: {
                    testimonials: [
                        { id: 1, variant: 'service-card', author: 'Rajesh Kumar', role: 'Dealer', title: 'Outstanding Platform', text: 'NovaMart has transformed our procurement process. Direct manufacturer access is a game-changer.', image: '/assets/testimonial1.jpg', rating: 5, cols: 'md:col-span-1', rows: '' },
                        { id: 2, variant: 'pure-quote', author: 'Priya Sharma', role: 'Customer', title: 'Best Shopping Experience', text: 'Genuine products at unbeatable prices. The verified seller system gives me confidence.', image: '/assets/testimonial2.jpg', rating: 5, cols: 'md:col-span-1', rows: '' },
                        { id: 3, variant: 'photo-split', author: 'Vikram Patel', role: 'Manufacturer', title: 'Growing My Business', text: 'As a manufacturer, NovaMart gives me direct access to dealers and customers across India.', image: '/assets/testimonial3.jpg', rating: 5, cols: 'md:col-span-1', rows: '' },
                        { id: 4, variant: 'wide-likes', author: 'Meena Iyer', role: 'Customer', title: 'Reliable & Fast Delivery', text: 'Every order arrived on time and in perfect condition. The customer support is exceptional.', image: '/assets/testimonial4.jpg', rating: 5, likes: 142, cols: 'md:col-span-2 lg:col-span-2', rows: '' }
                    ]
                }
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
