import logger from '../lib/logger.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/; // Indian standard mobile validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // Min 8 chars, 1 upper, 1 lower, 1 digit

export const validateRegistration = (req, res, next) => {
    const { email, phone, password, role, name, businessName, companyName, gstNumber } = req.body;
    const errors = {};

    if (!email || !emailRegex.test(email)) errors.email = 'INVALID_EMAIL';
    if (!phone || !phoneRegex.test(phone)) errors.phone = 'INVALID_PHONE';
    if (!password || !passwordRegex.test(password)) errors.password = 'WEAK_PASSWORD';
    if (!role) errors.role = 'ROLE_REQUIRED';

    const roleUpper = role?.toUpperCase();
    if (roleUpper === 'CUSTOMER' && !name) errors.name = 'NAME_REQUIRED';
    if (roleUpper === 'DEALER' && !businessName) errors.businessName = 'BUSINESS_NAME_REQUIRED';
    if (roleUpper === 'MANUFACTURER' && !companyName) errors.companyName = 'COMPANY_NAME_REQUIRED';

    // GST validation if provided or required for B2B
    if ((roleUpper === 'DEALER' || roleUpper === 'MANUFACTURER') && !gstNumber) {
        errors.gstNumber = 'GST_REQUIRED';
    }

    if (Object.keys(errors).length > 0) {
        logger.warn('Registration validation failed', { email, phone, errors });
        return res.status(400).json({ error: 'VALIDATION_FAILED', details: errors });
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = {};

    if (!email || !emailRegex.test(email)) errors.email = 'INVALID_EMAIL';
    if (!password) errors.password = 'PASSWORD_REQUIRED';

    if (Object.keys(errors).length > 0) {
        logger.warn('Login validation failed', { email, errors });
        return res.status(400).json({ error: 'VALIDATION_FAILED', details: errors });
    }
    next();
};

export const validatePhoneLogin = (req, res, next) => {
    const { phone, otp } = req.body;
    const errors = {};

    if (!phone || !phoneRegex.test(phone)) errors.phone = 'INVALID_PHONE';
    if (!otp || otp.length !== 6) errors.otp = 'INVALID_OTP_FORMAT';

    if (Object.keys(errors).length > 0) {
        logger.warn('Phone login validation failed', { phone, errors });
        return res.status(400).json({ error: 'VALIDATION_FAILED', details: errors });
    }
    next();
};

export const validateProduct = (req, res, next) => {
    const { name, basePrice, category, moq } = req.body;
    const errors = {};

    const nameVal = name?.trim();
    if (!nameVal || nameVal.length < 3) errors.name = 'NAME_TOO_SHORT';

    const priceNum = parseFloat(basePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
        errors.basePrice = 'INVALID_PRICE';
    }

    if (!category || category === '') errors.category = 'CATEGORY_REQUIRED';

    if (moq) {
        const moqNum = parseInt(moq);
        if (isNaN(moqNum) || moqNum < 1) {
            errors.moq = 'INVALID_MOQ';
        }
    }

    if (Object.keys(errors).length > 0) {
        logger.warn('Product validation failed', { name, errors, manufacturerId: req.user?.id });
        return res.status(400).json({ error: 'VALIDATION_FAILED', details: errors });
    }

    next();
};

export default {
    validateRegistration,
    validateLogin,
    validatePhoneLogin,
    validateProduct
};
