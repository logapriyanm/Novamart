import {
    ShoppingBag,
    Truck,
    ShieldCheck,
    MessageCircle,
    Star,
    AlertCircle,
    LayoutDashboard,
    Database,
    Settings,
    Users,
    TrendingUp,
    Package,
    Briefcase,
    Zap,
    Lock
} from 'lucide-react';

export interface ManualSection {
    title: string;
    description: string;
    icon?: any;
    items?: {
        title: string;
        description: string;
    }[];
}

export interface RoleManual {
    title: string;
    welcomeMessage: string;
    sections: ManualSection[];
}

export const GUEST_MANUAL: RoleManual = {
    title: "How NovaMart Works",
    welcomeMessage: "Welcome to NovaMart! Secure B2B2C marketplace connecting manufacturers, dealers, and buyers.",
    sections: [
        {
            title: "Buyer / Customer",
            description: "Browse and purchase products directly from verified sellers with escrow protection.",
            icon: ShoppingBag,
            items: [
                { title: "Browse Products", description: "Explore thousands of products across multiple categories." },
                { title: "Buy Products", description: "Secure checkout with multiple payment options." },
                { title: "Track Orders", description: "Real-time updates on your shipment status." },
                { title: "Rate Sellers", description: "Share your experience and build trust." }
            ]
        },
        {
            title: "Dealer / Seller",
            description: "Source wholesale products from manufacturers and reach a wider customer base.",
            icon: Users,
            items: [
                { title: "Buy Wholesale", description: "Get exclusive wholesale pricing from top manufacturers." },
                { title: "Manufacturer Access", description: "Request access to premium brand catalogs." },
                { title: "Sell to Customers", description: "List and manage your inventory for retail buyers." },
                { title: "Collaborate", description: "Use pooling and collaboration tools (with subscription)." }
            ]
        },
        {
            title: "Manufacturer",
            description: "Scale your production and distribution by managing authorized dealer networks.",
            icon: Briefcase,
            items: [
                { title: "Upload Products", description: "Single or bulk upload your product catalog." },
                { title: "Approve Dealers", description: "Control who sells your brand." },
                { title: "Custom Orders", description: "Accept and manage personalized manufacturing requests." },
                { title: "Stock Allocation", description: "Efficiently manage stock across your dealer network." }
            ]
        }
    ]
};

export const CUSTOMER_MANUAL: RoleManual = {
    title: "Customer User Manual",
    welcomeMessage: "Hi there! Here's everything you need to know to shop securely on NovaMart.",
    sections: [
        {
            title: "Searching & Discovery",
            description: "How to find exactly what you need.",
            icon: Zap,
            items: [
                { title: "Search Filters", description: "Use filters for category, price, and rating to narrow down results." },
                { title: "Verified Badges", description: "Look for the shield icon to identify verified sellers." }
            ]
        },
        {
            title: "Ordering & Payments",
            description: "Safe and secure transaction process.",
            icon: ShieldCheck,
            items: [
                { title: "Checkout Flow", description: "Add items to cart and follow the secure checkout steps." },
                { title: "Escrow Protection", description: "Your payment is held securely and only released when you confirm delivery." }
            ]
        },
        {
            title: "After-Sales",
            description: "Managing your orders and feedback.",
            icon: Truck,
            items: [
                { title: "Order Tracking", description: "Monitor your orders from 'My Account' -> 'Order History'." },
                { title: "Ratings & Reviews", description: "Leave feedback on products and seller service after delivery." },
                { title: "Raising Complaints", description: "Use the 'Report Issue' button on the order page for any disputes." }
            ]
        }
    ]
};

export const DEALER_MANUAL: RoleManual = {
    title: "Dealer / Seller User Manual",
    welcomeMessage: "Grow your business on NovaMart with exclusive access and powerful selling tools.",
    sections: [
        {
            title: "Inventory & Sourcing",
            description: "Manage what you sell and where you get it.",
            icon: Database,
            items: [
                { title: "Source from Manufacturers", description: "Browse manufacturer catalogs and place wholesale orders." },
                { title: "Access Requests", description: "Apply to sell specific brands by providing required documentation." },
                { title: "Manage Inventory", description: "Keep your stock levels updated to avoid order cancellations." }
            ]
        },
        {
            title: "Sales & Negotiation",
            description: "Closing deals with buyers and manufacturers.",
            icon: TrendingUp,
            items: [
                { title: "Negotiation Engine", description: "Propose and accept counter-offers for bulk purchases." },
                { title: "Direct Chat", description: "Communicate securely with buyers via integrated real-time chat." }
            ]
        },
        {
            title: "Subscription Benefits",
            description: "Unlock the full potential of NovaMart.",
            icon: Star,
            items: [
                { title: "Collaboration Tools", description: "Join pooling requests to get better rates from manufacturers." },
                { title: "Advanced Analytics", description: "Get insights into your sales performance and customer trends." }
            ]
        }
    ]
};

export const MANUFACTURER_MANUAL: RoleManual = {
    title: "Manufacturer User Manual",
    welcomeMessage: "Direct-to-market tools to manage your production and distribution at scale.",
    sections: [
        {
            title: "Catalog Management",
            description: "Getting your products in front of the right people.",
            icon: Package,
            items: [
                { title: "Product Uploads", description: "Use CSV imports for large catalogs or the manual form for single items." },
                { title: "Approval Workflow", description: "Manage dealer requests to ensure brand consistency." }
            ]
        },
        {
            title: "Dealer Network",
            description: "Build and scale your distribution channels.",
            icon: Users,
            items: [
                { title: "Dealer Verification", description: "Review and approve/reject dealer onboarding requests." },
                { title: "Stock Allocation", description: "Set priority stock levels for your top-performing dealers." }
            ]
        },
        {
            title: "Custom Manufacturing",
            description: "Handling non-standard requests.",
            icon: Settings,
            items: [
                { title: "Milestone Tracking", description: "Update production status to keep buyers informed." },
                { title: "Production Analytics", description: "Monitor lead times and fulfillment efficiency." }
            ]
        }
    ]
};
