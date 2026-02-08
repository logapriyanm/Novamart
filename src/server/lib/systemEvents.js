import { EventEmitter } from 'events';

class SystemEventEmitter extends EventEmitter { }

const systemEvents = new SystemEventEmitter();

export const EVENTS = {
    AUTH: {
        REGISTERED: 'AUTH.REGISTERED',
        VERIFIED: 'AUTH.VERIFIED',
        REJECTED: 'AUTH.REJECTED',
        SUSPENDED: 'AUTH.SUSPENDED',
        PASSWORD_CHANGED: 'AUTH.PASSWORD_CHANGED'
    },
    PRODUCT: {
        CREATED: 'PRODUCT.CREATED',
        APPROVED: 'PRODUCT.APPROVED',
        REJECTED: 'PRODUCT.REJECTED',
        PAUSED: 'PRODUCT.PAUSED'
    },
    ORDER: {
        PLACED: 'ORDER.PLACED',
        PAID: 'ORDER.PAID',
        SHIPPED: 'ORDER.SHIPPED',
        DELIVERED: 'ORDER.DELIVERED',
        CANCELLED: 'ORDER.CANCELLED'
    },
    ESCROW: {
        HOLD: 'ESCROW.HOLD',
        RELEASE: 'ESCROW.RELEASE',
        REFUND: 'ESCROW.REFUND'
    },
    COMPLIANCE: {
        BANK_CHANGED: 'COMPLIANCE.BANK_CHANGED',
        GST_REJECTED: 'COMPLIANCE.GST_REJECTED'
    },
    DISPUTE: {
        RAISED: 'DISPUTE.RAISED',
        RESOLVED: 'DISPUTE.RESOLVED'
    }
};

export default systemEvents;
