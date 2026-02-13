/**
 * User Service
 * Centralized identity management for all roles (Customer, Seller, Manufacturer, Admin).
 */

import { User, Customer, Seller, Manufacturer } from '../models/index.js';
import mongoose from 'mongoose';

class UserService {
    /**
     * Get User by ID with associated role data
     */
    async getUserWithProfile(userId) {
        const user = await User.findById(userId);
        if (!user) return null;

        const [customer, seller, manufacturer] = await Promise.all([
            Customer.findOne({ userId }),
            Seller.findOne({ userId }),
            Manufacturer.findOne({ userId })
        ]);

        return {
            ...user.toObject(),
            customer,
            seller,
            manufacturer
        };
    }

    /**
     * Update Core Account Details (User Table)
     * This affects the primary identity across all roles.
     */
    async updateAccount(userId, data) {
        const { email, phone, avatar, mfaEnabled } = data;

        return await User.findByIdAndUpdate(userId, {
            email,
            phone,
            avatar,
            mfaEnabled
        }, { new: true });
    }

    /**
     * Unified Profile Update
     * Detects role and updates both User table and role-specific metadata.
     */
    async updateFullProfile(userId, role, section, data) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let updatedProfile;

            // 1. Update Core User Data if 'account' section or if email/phone provided
            if (section === 'account' || data.email || data.phone || data.avatar) {
                await User.findByIdAndUpdate(userId, {
                    email: data.email,
                    phone: data.phone,
                    avatar: data.avatar
                }, { session, new: true });
            }

            // 2. Update Role-Specific Data
            if (role === 'CUSTOMER') {
                updatedProfile = await Customer.findOneAndUpdate(
                    { userId },
                    { name: data.name },
                    { session, new: true }
                );
            } else if (role === 'SELLER') {
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
                    updateData.payoutBlocked = true;
                }

                updatedProfile = await Seller.findOneAndUpdate(
                    { userId },
                    updateData,
                    { session, new: true }
                );
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

                updatedProfile = await Manufacturer.findOneAndUpdate(
                    { userId },
                    updateData,
                    { session, new: true }
                );
            }

            const updatedUser = await User.findById(userId).session(session);
            await session.commitTransaction();

            return {
                user: updatedUser,
                profile: updatedProfile
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Update FCM Token for Push Notifications
     */
    async updateFCMToken(userId, fcmToken) {
        return await User.findByIdAndUpdate(userId, { fcmToken }, { new: true });
    }
}

export default new UserService();
