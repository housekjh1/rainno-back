const { User, RefreshToken } = require('../models');
const JWTUtil = require('../utils/jwtUtil');
const ResponseUtil = require('../utils/responseUtil');
const { Op } = require('sequelize');

class AuthService {
    async login(username, password) {
        // 사용자 찾기
        const user = await User.findOne({ 
            where: { username } 
        });
        
        if (!user) {
            throw new Error('Invalid credentials');
        }
        
        // 비밀번호 확인
        const isValid = await user.validatePassword(password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }
        
        // 활성 사용자 확인
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }
        
        // 토큰 생성
        const accessToken = JWTUtil.generateAccessToken(user.id, user.username, user.role);
        const refreshToken = JWTUtil.generateRefreshToken();
        const csrfToken = JWTUtil.generateCsrfToken();
        
        // Refresh Token 저장 (기존 토큰 삭제)
        await RefreshToken.destroy({ 
            where: { userId: user.id } 
        });
        
        await RefreshToken.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        
        // 마지막 로그인 시간 업데이트
        await user.update({ lastLogin: new Date() });
        
        return {
            user: user.toJSON(),
            tokens: {
                accessToken,
                refreshToken,
                csrfToken
            }
        };
    }
    
    async signup(userData) {
        // 중복 체크
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: userData.username },
                    { email: userData.email }
                ]
            }
        });
        
        if (existingUser) {
            throw new Error('Username or email already exists');
        }
        
        // 사용자 생성
        const user = await User.create(userData);
        
        return user.toJSON();
    }
    
    async refreshToken(refreshToken) {
        // Refresh Token 확인
        const storedToken = await RefreshToken.findOne({
            where: { token: refreshToken },
            include: ['user']
        });
        
        if (!storedToken) {
            throw new Error('Invalid refresh token');
        }
        
        // 만료 확인
        if (storedToken.expiresAt < new Date()) {
            await storedToken.destroy();
            throw new Error('Refresh token expired');
        }
        
        const user = storedToken.user;
        
        // 새 토큰 생성
        const newAccessToken = JWTUtil.generateAccessToken(user.id, user.username, user.role);
        const newRefreshToken = JWTUtil.generateRefreshToken();
        const newCsrfToken = JWTUtil.generateCsrfToken();
        
        // 기존 토큰 삭제 및 새 토큰 저장
        await storedToken.destroy();
        await RefreshToken.create({
            token: newRefreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        
        return {
            tokens: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                csrfToken: newCsrfToken
            }
        };
    }
    
    async logout(refreshToken) {
        if (refreshToken) {
            await RefreshToken.destroy({
                where: { token: refreshToken }
            });
        }
    }
}

module.exports = new AuthService();