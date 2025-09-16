const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');

class JWTUtil {
    static generateAccessToken(userId, username, role) {
        return jwt.sign(
            { userId, username, role, type: 'access' },
            config.jwt.secret,
            { expiresIn: config.jwt.accessExpire }
        );
    }
    
    static generateRefreshToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    
    static generateCsrfToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (error) {
            return null;
        }
    }
    
    static decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            return null;
        }
    }
}

module.exports = JWTUtil;