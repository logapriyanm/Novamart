/**
 * User Service
 * Centralized identity management for all roles (Customer, Dealer, Manufacturer, Admin).
 */

import prisma from '../lib/prisma.js';

class UserService {
    /**
     * Get User by ID with associated role data
     */
    async getUserWithProfile(userId) {
        return await prisma.user.findUnique({
            where: { id: userId },
            include: {
                customer: true,
                dealer: true,
                manufacturer: true
            }
        });
    }

    /**
     * Update Core Account Details (User Table)
     * This affects the primary identity across all roles.
     */
    async updateAccount(userId, data) {
        const { email, phone, avatar, mfaEnabled } = data;

        return await prisma.user.update({
            where: { id: userId },
            data: {
                email,
                phone,
                avatar,
                mfaEnabled
            }
        });
    }

    /**
     * Unified Profile Update
     * Detects role and updates both User table and role-specific metadata.
     */
    async updateFullProfile(userId, role, section, data) {
        return await prisma.$transaction(async (tx) => {
            let updatedProfile;

            // 1. Update Core User Data if 'account' section or if email/phone provided
            if (section === 'account' || data.email || data.phone || data.avatar) {
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        email: data.email,
                        phone: data.phone,
                        avatar: data.avatar
                    }
                });
            }

            // 2. Update Role-Specific Data
            if (role === 'CUSTOMER') {
                updatedProfile = await tx.customer.update({
                    where: { userId },
                    data: { name: data.name }
                });
            } else if (role === 'DEALER') {
                const updateData = {};
                if (section === 'business') {
                    updateData.businessName = data.businessName;
                    updateData.ownerName = data.ownerName;
                    updateData.businessType = data.businessType;
                } else if (section === 'compliance') {
                    updateData.gstNumber = data.gstNumber;
                } else if (section === 'address') {
                    updateData.businessAddress = data.businessAddress;
                    updateData.city = data.city;
                    updateData.state = data.state;
                    updateData.pincode = data.pincode;
                } else if (section === 'bank') {
                    updateData.bankDetails = data.bankDetails;
                    updateData.payoutBlocked = true; // Rule: Changing bank pauses payouts
                }

                updatedProfile = await tx.dealer.update({
                    where: { userId },
                    data: updateData
                });
            } else if (role === 'MANUFACTURER') {
                const updateData = {};
                if (section === 'company') {
                    updateData.companyName = data.companyName;
                    updateData.registrationNo = data.registrationNo;
                } else if (section === 'factory') {
                    updateData.factoryAddress = data.factoryAddress;
                    updateData.capacity = data.capacity;
                } else if (section === 'compliance') {
                    updateData.gstNumber = data.gstNumber;
                } else if (section === 'bank') {
                    updateData.bankDetails = data.bankDetails;
                }

                updatedProfile = await tx.manufacturer.update({
                    where: { userId },
                    data: updateData
                });
            }

            return {
                user: await tx.user.findUnique({ where: { id: userId } }),
                profile: updatedProfile
            };
        });
    }

    /**
     * Update FCM Token for Push Notifications
     */
    async updateFCMToken(userId, fcmToken) {
        return await prisma.user.update({
            where: { id: userId },
            data: { fcmToken }
        });
    }
}

export default new UserService();
