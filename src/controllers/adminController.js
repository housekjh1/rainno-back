const { User } = require('../models');
const ResponseUtil = require('../utils/responseUtil');
const { sequelize } = require('../config/database');

class AdminController {
    async getDashboard(req, res, next) {
        try {
            // 통계 정보 조회
            const stats = await User.findAll({
                attributes: [
                    'role',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                group: ['role']
            });
            
            const activeUsers = await User.count({
                where: { isActive: true }
            });
            
            const totalUsers = await User.count();
            
            return ResponseUtil.success(res, 'Dashboard data retrieved', {
                stats,
                activeUsers,
                totalUsers,
                currentUser: req.user
            });
        } catch (error) {
            next(error);
        }
    }
    
    async updateUserRole(req, res, next) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            
            if (!['USER', 'MANAGER', 'ADMIN'].includes(role)) {
                return ResponseUtil.error(res, 'Invalid role', 400);
            }
            
            const user = await User.findByPk(id);
            if (!user) {
                return ResponseUtil.error(res, 'User not found', 404);
            }
            
            await user.update({ role });
            
            return ResponseUtil.success(res, 'User role updated', user.toJSON());
        } catch (error) {
            next(error);
        }
    }
    
    async toggleUserStatus(req, res, next) {
        try {
            const { id } = req.params;
            
            const user = await User.findByPk(id);
            if (!user) {
                return ResponseUtil.error(res, 'User not found', 404);
            }
            
            await user.update({ isActive: !user.isActive });
            
            return ResponseUtil.success(res, 
                `User ${user.isActive ? 'activated' : 'deactivated'}`, 
                user.toJSON()
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();