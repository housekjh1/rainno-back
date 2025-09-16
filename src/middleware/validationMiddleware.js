const { body, validationResult } = require('express-validator');
const ResponseUtil = require('../utils/responseUtil');

// 유효성 검사 결과 확인
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseUtil.error(res, 'Validation failed', 400, errors.array());
    }
    next();
};

// 로그인 유효성 검사
const validateLogin = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
];

// 회원가입 유효성 검사
const validateSignup = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain at least one number'),
    body('role')
        .optional()
        .isIn(['USER', 'MANAGER', 'ADMIN']).withMessage('Invalid role'),
    validate
];

module.exports = {
    validate,
    validateLogin,
    validateSignup
};