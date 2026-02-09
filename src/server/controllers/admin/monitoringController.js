import monitoringService from '../../services/monitoring.js';

export const getSystemHealth = async (req, res) => {
    try {
        const health = await monitoringService.getSystemHealth();
        res.json({
            success: true,
            data: health
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            success: false,
            error: 'Health Check Failed'
        });
    }
};
