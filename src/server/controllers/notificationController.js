import { Notification } from '../models/index.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ success: true, data: notifications });
    } catch (error) {
        console.error('Fetch Notifications Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ success: false, error: 'INVALID_ID', message: 'Notification ID is required' });
        }

        const result = await Notification.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { readAt: new Date() }
        );

        if (!result) {
            return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Notification not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Update Notification Error:', error);
        res.status(500).json({ success: false, error: 'Failed to update notification' });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, readAt: null },
            { readAt: new Date() }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Update All Notifications Error:', error);
        res.status(500).json({ success: false, error: 'Failed to update notifications' });
    }
};

export default {
    getNotifications,
    markAsRead,
    markAllAsRead
};
