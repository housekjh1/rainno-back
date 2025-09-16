const JWTUtil = require('../utils/jwtUtil');
const ResponseUtil = require('../utils/responseUtil');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
    try {
        let token = null;
        
        // 1. Authorization 헤더에서 토큰 확인
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        
        // 2. 쿠키에서 토큰 확인
        if (!token && req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        
        if (!token) {
            return ResponseUtil.unauthorized(res, 'No token provided');
        }
        
        // 토큰 검증
        const decoded = JWTUtil.verifyAccessToken(token);
        if (!decoded) {
            return ResponseUtil.unauthorized(res, 'Invalid token');
        }
        
        // 사용자 확인
        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user || !user.isActive) {
            return ResponseUtil.unauthorized(res, 'User not found or inactive');
        }
        
        // 요청 객체에 사용자 정보 추가
        req.user = user;
        req.token = decoded;
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return ResponseUtil.error(res, 'Authentication failed', 500);
    }
};

module.exports = { authenticate };