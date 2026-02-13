import React from 'react';
import { FaBuilding, FaStar, FaCrown } from 'react-icons/fa';

interface SubscriptionBadgeProps {
    tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
}

export default function SubscriptionBadge({ tier, size = 'md', showIcon = true }: SubscriptionBadgeProps) {
    const getStyles = () => {
        switch (tier) {
            case 'BASIC':
                return {
                    container: 'bg-gray-100 text-gray-700 border-gray-200',
                    icon: <FaBuilding className={iconSize} />
                };
            case 'PRO':
                return {
                    container: 'bg-blue-100 text-blue-700 border-blue-200',
                    icon: <FaStar className={iconSize} />
                };
            case 'ENTERPRISE':
                return {
                    container: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-transparent',
                    icon: <FaCrown className={iconSize} />
                };
            default:
                return {
                    container: 'bg-gray-100 text-gray-700 border-gray-200',
                    icon: <FaBuilding className={iconSize} />
                };
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-1.5 text-sm';
            case 'lg':
                return 'px-6 py-3 text-sm';
            default:
                return 'px-4 py-2 text-sm';
        }
    };

    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    const styles = getStyles();

    return (
        <div className={`inline-flex items-center gap-2 rounded-[10px] border font-semibold ${styles.container} ${getSizeClasses()}`}>
            {showIcon && styles.icon}
            <span>{tier}</span>
        </div>
    );
}
