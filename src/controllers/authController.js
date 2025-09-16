const authService = require('../services/authService');
const ResponseUtil = require('../utils/responseUtil');
const config = require('../config/config');

class AuthController {
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            
            const result = await authService.login(username, password);
            
            // 쿠키 설정
            res.cookie('accessToken', result.tokens.accessToken, {
                ...config.cookies,
                maxAge: config.cookies.accessMaxAge
            });
            
            res.cookie('refreshToken', result.tokens.refreshToken, {
                ...config.cookies,
                maxAge: config.cookies.refreshMaxAge
            });
            
            return ResponseUtil.success(res, 'Login successful', {
                user: result.user,
                tokens: {
                    accessToken: result.tokens.accessToken,
                    csrfToken: result.tokens.csrfToken
                }
            });
        } catch (error) {
            next(error);
        }
    }
    
    async signup(req, res, next) {
        try {
            const user = await authService.signup(req.body);
            return ResponseUtil.success(res, 'User created successfully', user, 201);
        } catch (error) {
            next(error);
        }
    }
    
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            
            if (!refreshToken) {
                return ResponseUtil.unauthorized(res, 'Refresh token not found');
            }
            
            const result = await authService.refreshToken(refreshToken);
            
            // 새 쿠키 설정
            res.cookie('accessToken', result.tokens.accessToken, {
                ...config.cookies,
                maxAge: config.cookies.accessMaxAge
            });
            
            res.cookie('refreshToken', result.tokens.refreshToken, {
                ...config.cookies,
                maxAge: config.cookies.refreshMaxAge
            });
            
            return ResponseUtil.success(res, 'Token refreshed', {
                tokens: {
                    accessToken: result.tokens.accessToken,
                    csrfToken: result.tokens.csrfToken
                }
            });
        } catch (error) {
            next(error);
        }
    }
    
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            
            await authService.logout(refreshToken);
            
            // 쿠키 삭제
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            
            return ResponseUtil.success(res, 'Logout successful');
        } catch (error) {
            next(error);
        }
    }
    
    async checkAuth(req, res, next) {
        try {
            return ResponseUtil.success(res, 'Authenticated', {
                user: req.user
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();