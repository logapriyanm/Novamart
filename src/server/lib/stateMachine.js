/**
 * Unified State Machine
 * Enforces strict state transitions across Orders, Negotiations, Escrow, and Disputes.
 * All status changes MUST go through isValidTransition() or isValidMachineTransition().
 */

// ==================== ORDER ====================
export const OrderStatus = {
    CREATED: 'CREATED',
    PAYMENT_PENDING: 'PAYMENT_PENDING',
    PAID: 'PAID',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    DELIVERY_CONFIRMED: 'DELIVERY_CONFIRMED',
    SETTLED: 'SETTLED',
    CANCELLED: 'CANCELLED',
    DISPUTED: 'DISPUTED',
    REFUNDED: 'REFUNDED'
};

const ORDER_TRANSITIONS = {
    [OrderStatus.CREATED]: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],
    [OrderStatus.PAYMENT_PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED, OrderStatus.DISPUTED, OrderStatus.REFUNDED],
    [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED, OrderStatus.DISPUTED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.DISPUTED],
    [OrderStatus.DELIVERED]: [OrderStatus.DELIVERY_CONFIRMED, OrderStatus.DISPUTED],
    [OrderStatus.DELIVERY_CONFIRMED]: [OrderStatus.SETTLED, OrderStatus.DISPUTED],
    [OrderStatus.SETTLED]: [], // Terminal state
    [OrderStatus.CANCELLED]: [], // Terminal state
    [OrderStatus.DISPUTED]: [OrderStatus.REFUNDED, OrderStatus.SETTLED],
    [OrderStatus.REFUNDED]: [] // Terminal state
};

// ==================== PAYMENT ====================
export const PaymentStatus = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
};

// ==================== ESCROW ====================
export const EscrowStatus = {
    HOLD: 'HOLD',
    RELEASED: 'RELEASED',
    REFUNDED: 'REFUNDED',
    FROZEN: 'FROZEN'
};

const ESCROW_TRANSITIONS = {
    [EscrowStatus.HOLD]: [EscrowStatus.FROZEN, EscrowStatus.RELEASED, EscrowStatus.REFUNDED],
    [EscrowStatus.FROZEN]: [EscrowStatus.HOLD, EscrowStatus.REFUNDED],
    [EscrowStatus.RELEASED]: [], // Terminal state
    [EscrowStatus.REFUNDED]: [] // Terminal state
};

// ==================== NEGOTIATION ====================
export const NegotiationStatus = {
    REQUESTED: 'REQUESTED',
    NEGOTIATING: 'NEGOTIATING',
    OFFER_MADE: 'OFFER_MADE',
    ACCEPTED: 'ACCEPTED',
    DEAL_CLOSED: 'DEAL_CLOSED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED'
};

const NEGOTIATION_TRANSITIONS = {
    [NegotiationStatus.REQUESTED]: [NegotiationStatus.NEGOTIATING, NegotiationStatus.OFFER_MADE, NegotiationStatus.REJECTED, NegotiationStatus.ACCEPTED, NegotiationStatus.CANCELLED],
    [NegotiationStatus.NEGOTIATING]: [NegotiationStatus.OFFER_MADE, NegotiationStatus.ACCEPTED, NegotiationStatus.REJECTED, NegotiationStatus.CANCELLED],
    [NegotiationStatus.OFFER_MADE]: [NegotiationStatus.ACCEPTED, NegotiationStatus.NEGOTIATING, NegotiationStatus.REJECTED],
    [NegotiationStatus.ACCEPTED]: [NegotiationStatus.DEAL_CLOSED, NegotiationStatus.REJECTED],
    [NegotiationStatus.DEAL_CLOSED]: [], // Terminal state
    [NegotiationStatus.REJECTED]: [], // Terminal state
    [NegotiationStatus.CANCELLED]: [] // Terminal state
};

// ==================== DISPUTE ====================
export const DisputeStatus = {
    OPEN: 'OPEN',
    UNDER_REVIEW: 'UNDER_REVIEW',
    EVIDENCE_COLLECTION: 'EVIDENCE_COLLECTION',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED'
};

const DISPUTE_TRANSITIONS = {
    [DisputeStatus.OPEN]: [DisputeStatus.UNDER_REVIEW, DisputeStatus.CLOSED],
    [DisputeStatus.UNDER_REVIEW]: [DisputeStatus.EVIDENCE_COLLECTION, DisputeStatus.RESOLVED, DisputeStatus.CLOSED],
    [DisputeStatus.EVIDENCE_COLLECTION]: [DisputeStatus.IN_PROGRESS, DisputeStatus.RESOLVED],
    [DisputeStatus.IN_PROGRESS]: [DisputeStatus.RESOLVED],
    [DisputeStatus.RESOLVED]: [DisputeStatus.CLOSED],
    [DisputeStatus.CLOSED]: [] // Terminal state
};

// ==================== PRODUCT ====================
export const ProductStatus = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    DISABLED: 'DISABLED'
};

const PRODUCT_TRANSITIONS = {
    [ProductStatus.DRAFT]: [ProductStatus.PENDING, ProductStatus.APPROVED],
    [ProductStatus.PENDING]: [ProductStatus.APPROVED, ProductStatus.REJECTED],
    [ProductStatus.APPROVED]: [ProductStatus.PENDING, ProductStatus.DISABLED],
    [ProductStatus.REJECTED]: [ProductStatus.PENDING, ProductStatus.DRAFT],
    [ProductStatus.DISABLED]: [ProductStatus.PENDING, ProductStatus.DRAFT]
};

// ==================== MACHINE REGISTRY ====================
const MACHINES = {
    ORDER: ORDER_TRANSITIONS,
    ESCROW: ESCROW_TRANSITIONS,
    NEGOTIATION: NEGOTIATION_TRANSITIONS,
    DISPUTE: DISPUTE_TRANSITIONS,
    PRODUCT: PRODUCT_TRANSITIONS
};

/**
 * Validate if a state transition is allowed for ORDER (backwards-compatible API)
 */
export function isValidTransition(currentStatus, newStatus) {
    const allowedTransitions = ORDER_TRANSITIONS[currentStatus];
    if (!allowedTransitions) {
        throw new Error(`Invalid current status: ${currentStatus}`);
    }
    return allowedTransitions.includes(newStatus);
}

/**
 * Validate if a state transition is allowed for ANY machine
 * @param {'ORDER'|'ESCROW'|'NEGOTIATION'|'DISPUTE'} machineName
 * @param {string} currentStatus
 * @param {string} newStatus
 * @returns {boolean}
 */
export function isValidMachineTransition(machineName, currentStatus, newStatus) {
    const machine = MACHINES[machineName];
    if (!machine) throw new Error(`Unknown state machine: ${machineName}`);
    const allowed = machine[currentStatus];
    if (!allowed) throw new Error(`Invalid status "${currentStatus}" for machine "${machineName}"`);
    return allowed.includes(newStatus);
}

/**
 * Get allowed next states for current status
 */
export function getAllowedTransitions(currentStatus) {
    return ORDER_TRANSITIONS[currentStatus] || [];
}

/**
 * Validate payment state consistency across order, payment, escrow
 */
export function validatePaymentState(order, payment, escrow) {
    if (order.status === OrderStatus.PAID && payment?.status !== PaymentStatus.SUCCESS) {
        throw new Error('Order marked as PAID but payment is not SUCCESS');
    }
    if (order.status === OrderStatus.PAID && escrow?.status !== EscrowStatus.HOLD) {
        throw new Error('Order marked as PAID but escrow is not in HOLD');
    }
    if (order.status === OrderStatus.SETTLED && escrow?.status !== EscrowStatus.RELEASED) {
        throw new Error('Order marked as SETTLED but escrow is not RELEASED');
    }
    if (order.status === OrderStatus.REFUNDED && escrow?.status !== EscrowStatus.REFUNDED) {
        throw new Error('Order marked as REFUNDED but escrow is not REFUNDED');
    }
    if (order.status === OrderStatus.DISPUTED && escrow?.status !== EscrowStatus.FROZEN) {
        throw new Error('Order marked as DISPUTED but escrow is not FROZEN');
    }
}

/**
 * Assert a transition is valid, throw descriptive error if not.
 * @param {string} machineName
 * @param {string} currentStatus
 * @param {string} newStatus
 * @throws {Error}
 */
export function assertTransition(machineName, currentStatus, newStatus) {
    if (!isValidMachineTransition(machineName, currentStatus, newStatus)) {
        const err = new Error(`INVALID_TRANSITION: ${machineName} cannot move from '${currentStatus}' to '${newStatus}'`);
        err.code = 'INVALID_STATE_TRANSITION';
        err.status = 400;
        throw err;
    }
}

/**
 * Create a timeline entry for state transition logging.
 */
export function createTimelineEntry(fromState, toState, reason = '', metadata = {}) {
    return {
        fromState,
        toState,
        reason,
        metadata,
        createdAt: new Date()
    };
}

/**
 * Check if a state is terminal (no further transitions).
 */
export function isTerminalState(machineName, state) {
    const machine = MACHINES[machineName];
    if (!machine || !machine[state]) return true;
    return machine[state].length === 0;
}

export default {
    OrderStatus,
    PaymentStatus,
    EscrowStatus,
    NegotiationStatus,
    DisputeStatus,
    ProductStatus,
    isValidTransition,
    isValidMachineTransition,
    assertTransition,
    getAllowedTransitions,
    validatePaymentState,
    createTimelineEntry,
    isTerminalState,
    MACHINES
};
