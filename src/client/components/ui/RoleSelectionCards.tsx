import React from 'react';
import { FaShoppingCart, FaStore, FaIndustry, FaCheck, FaStar, FaUsers, FaCog } from 'react-icons/fa';

interface RoleOption {
    role: 'CUSTOMER' | 'SELLER' | 'MANUFACTURER';
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    benefits: string[];
    bestFor: string;
    color: string;
}

const roleOptions: RoleOption[] = [
    {
        role: 'CUSTOMER',
        title: 'Customer',
        subtitle: 'Buy products for personal use',
        icon: <FaShoppingCart className="w-8 h-8" />,
        benefits: [
            'Browse thousands of products',
            'Secure escrow payments',
            'Rate and review products',
            'Track orders in real-time'
        ],
        bestFor: 'Individual buyers looking for home appliances and electronics',
        color: 'from-slate-700 to-slate-900'
    },
    {
        role: 'SELLER',
        title: 'Seller',
        subtitle: 'Buy wholesale and resell',
        icon: <FaStore className="w-8 h-8" />,
        benefits: [
            'Wholesale pricing & discounts',
            'Negotiate with manufacturers',
            'Collaborate with other sellers',
            'Custom product manufacturing',
            'Subscription-based benefits'
        ],
        bestFor: 'Retailers and wholesalers buying in bulk to resell',
        color: 'from-success to-emerald-600'
    },
    {
        role: 'MANUFACTURER',
        title: 'Manufacturer',
        subtitle: 'Sell your products',
        icon: <FaIndustry className="w-8 h-8" />,
        benefits: [
            'List unlimited products',
            'Reach thousands of sellers',
            'Accept custom orders',
            'Manage inventory & pricing',
            'Track production milestones'
        ],
        bestFor: 'Product manufacturers and suppliers selling to sellers',
        color: 'from-primary to-blue-700'
    }
];

interface RoleSelectionCardsProps {
    selectedRole: string;
    onSelectRole: (role: string) => void;
}

export default function RoleSelectionCards({ selectedRole, onSelectRole }: RoleSelectionCardsProps) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
                    Choose Your <span className="text-primary">Account Type</span>
                </h2>
                <p className="text-sm font-bold text-slate-500">
                    Select the role that best describes how you'll use NovaMart
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roleOptions.map((option) => (
                    <button
                        key={option.role}
                        type="button"
                        onClick={() => onSelectRole(option.role)}
                        className={`relative text-left p-6 rounded-[20px] border-2 transition-all ${selectedRole === option.role
                            ? 'border-primary bg-primary/5 shadow-xl'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                            }`}
                    >
                        {/* Selection Indicator */}
                        {selectedRole === option.role && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <FaCheck className="w-3 h-3 text-white" />
                            </div>
                        )}

                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-[15px] bg-gradient-to-br ${option.color} flex items-center justify-center text-white mb-4`}>
                            {option.icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-black text-[#1E293B] mb-1">{option.title}</h3>
                        <p className="text-xs font-bold text-slate-500 mb-4">{option.subtitle}</p>

                        {/* Best For */}
                        <div className="bg-slate-50 rounded-[10px] p-3 mb-4 border border-slate-100">
                            <p className="text-sm font-semibold text-slate-400 mb-1">Best for</p>
                            <p className="text-xs font-bold text-slate-700">{option.bestFor}</p>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-400">Key benefits</p>
                            {option.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <FaCheck className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                                    <span className="text-xs font-bold text-slate-600">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            {/* Help Text */}
            <div className="bg-primary/5 border border-primary/10 rounded-[15px] p-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-[10px] flex items-center justify-center shrink-0">
                    <FaStar className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="text-sm font-black text-primary mb-1">Not sure which to choose?</p>
                    <p className="text-xs font-bold text-slate-600">
                        Choose <strong>Customer</strong> if you're buying for yourself. Choose <strong>Seller</strong> if you're buying to resell.
                        Choose <strong>Manufacturer</strong> if you're selling products.
                    </p>
                </div>
            </div>
            {/* End Help Text */}
        </div>
    );
}
