/**
 * Payment State Machine
 * Enforces strict state transitions to prevent accounting bugs
 */

export const OrderStatus = {
    CREATED: 'CREATED',
    PAYMENT_PENDING: 'PAYMENT_PENDING',
    PAID: 'PAID',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    SETTLED: 'SETTLED',
    CANCELLED: 'CANCELLED',
    DISPUTED: 'DISPUTED',
    REFUNDED: 'REFUNDED'
};

export const PaymentStatus = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
};

export const EscrowStatus = {
    HOLD: 'HOLD',
    RELEASED: 'RELEASED',
    REFUNDED: 'REFUNDED',
    FROZEN: 'FROZEN'
};

// Valid state transitions
const VALID_TRANSITIONS = {
    [OrderStatus.CREATED]: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],
    [OrderStatus.PAYMENT_PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED, OrderStatus.CREATED],
    [OrderStatus.PAID]: [OrderStatus.CONFIRMED, OrderStatus.DISPUTED, OrderStatus.REFUNDED],
    [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.DISPUTED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.DISPUTED],
    [OrderStatus.DELIVERED]: [OrderStatus.SETTLED, OrderStatus.DISPUTED],
    [OrderStatus.SETTLED]: [], // Terminal state
    [OrderStatus.CANCELLED]: [], // Terminal state
    [OrderStatus.DISPUTED]: [OrderStatus.REFUNDED, OrderStatus.SETTLED],
    [OrderStatus.REFUNDED]: [] // Terminal state
};

/**
 * Validate if a state transition is allowed
 * @param {string} currentStatus - Current order status
 * @param {string} newStatus - Desired new status
 * @returns {boolean} - Whether transition is valid
 */
export function isValidTransition(currentStatus, newStatus) {
    const allowedTransitions = VALID_TRANSITIONS[currentStatus];
    if (!allowedTransitions) {
        throw new Error(`Invalid current status: ${currentStatus}`);
    }
    return allowedTransitions.includes(newStatus);
}

/**
 * Get allowed next states for current status
 * @param {string} currentStatus - Current order status
 * @returns {string[]} - Array of allowed next states
 */
export function getAllowedTransitions(currentStatus) {
    return VALID_TRANSITIONS[currentStatus] || [];
}

/**
 * Validate payment state consistency
 * @param {Object} order - Order object
 * @param {Object} payment - Payment object
 * @param {Object} escrow - Escrow object
 * @throws {Error} - If state is inconsistent
 */
export function validatePaymentState(order, payment, escrow) {
    // Rule 1: PAID orders must have successful payment
    if (order.status === OrderStatus.PAID && payment?.status !== PaymentStatus.SUCCESS) {
        throw new Error('Order marked as PAID but payment is not SUCCESS');
    }

    // Rule 2: PAID orders must have escrow in HOLD
    if (order.status === OrderStatus.PAID && escrow?.status !== EscrowStatus.HOLD) {
        throw new Error('Order marked as PAID but escrow is not in HOLD');
    }

    // Rule 3: SETTLED orders must have escrow RELEASED
    if (order.status === OrderStatus.SETTLED && escrow?.status !== EscrowStatus.RELEASED) {
        throw new Error('Order marked as SETTLED but escrow is not RELEASED');
    }

    // Rule 4: REFUNDED orders must have escrow REFUNDED
    if (order.status === OrderStatus.REFUNDED && escrow?.status !== EscrowStatus.REFUNDED) {
        throw new Error('Order marked as REFUNDED but escrow is not REFUNDED');
    }

    // Rule 5: DISPUTED orders must have escrow FROZEN
    if (order.status === OrderStatus.DISPUTED && escrow?.status !== EscrowStatus.FROZEN) {
        throw new Error('Order marked as DISPUTED but escrow is not FROZEN');
    }
}

export default {
    OrderStatus,
    PaymentStatus,
    EscrowStatus,
    isValidTransition,
    getAllowedTransitions,
    validatePaymentState
};
