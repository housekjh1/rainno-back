const { User } = require('../models');
const { Op } = require('sequelize');

class UserService {
    async getAllUsers(filters = {}) {
        const where = {};
        
        if (filters.role) {
            where.role = filters.role;
        }
        
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        
        return await User.findAll({
            where,
            attributes: { exclude: ['password'] }
        });
    }
    
    async getUserById(userId) {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    }
    
    async updateUser(userId, updateData) {
        const user = await User.findByPk(userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // 민감한 필드는 제외
        delete updateData.password;
        delete updateData.role;
        
        await user.update(updateData);
        return user.toJSON();
    }
    
    async deleteUser(userId) {
        const user = await User.findByPk(userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        await user.destroy();
        return { message: 'User deleted successfully' };
    }
}

module.exports = new UserService();