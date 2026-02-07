import models from '../models/index.js';

/**
 * Universal service for MongoDB CRUD with auditing and rules.
 */
class MongoService {
    async create(collectionName, data, actorId = 'SYSTEM') {
        const Model = models[collectionName];
        if (!Model) throw new Error(`Model ${collectionName} not found`);

        const doc = await Model.create(data);

        // Auto-audit for sensitive actions
        if (['ProductVersion', 'User', 'KYCDocument', 'TrustBadge'].includes(collectionName)) {
            await models.AuditLog.create({
                actorId,
                role: 'SYSTEM_SERVICE',
                action: `CREATED_${collectionName.toUpperCase()}`,
                entity: doc._id,
                details: { status: 'SUCCESS' }
            });
        }

        return doc;
    }

    async find(collectionName, query = {}, options = {}) {
        const Model = models[collectionName];
        if (!Model) throw new Error(`Model ${collectionName} not found`);

        return await Model.find(query)
            .sort(options.sort || { createdAt: -1 })
            .limit(options.limit || 100)
            .skip(options.skip || 0);
    }

    async updateStatus(collectionName, id, status, actorId) {
        const Model = models[collectionName];
        if (!Model) throw new Error(`Model ${collectionName} not found`);

        const doc = await Model.findByIdAndUpdate(id, { status }, { new: true });

        await models.AuditLog.create({
            actorId,
            role: 'MANAGER',
            action: `UPDATED_STATUS_${collectionName.toUpperCase()}`,
            entity: id,
            details: { newStatus: status }
        });

        return doc;
    }

    // Deletion is strictly managed
    async softDelete(collectionName, id, actorId) {
        return this.updateStatus(collectionName, id, 'DELETED', actorId);
    }
}

export default new MongoService();
