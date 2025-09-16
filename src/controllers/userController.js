const userService = require('../services/userService');
const ResponseUtil = require('../utils/responseUtil');

class UserController {
    async getProfile(req, res, next) {
        try {
            const user = await userService.getUserById(req.user.id);
            return ResponseUtil.success(res, 'Profile retrieved', user);
        } catch (error) {
            next(error);
        }
    }
    
    async updateProfile(req, res, next) {
        try {
            const user = await userService.updateUser(req.user.id, req.body);
            return ResponseUtil.success(res, 'Profile updated', user);
        } catch (error) {
            next(error);
        }
    }
    
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers(req.query);
            return ResponseUtil.success(res, 'Users retrieved', users);
        } catch (error) {
            next(error);
        }
    }
    
    async getUserById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            return ResponseUtil.success(res, 'User retrieved', user);
        } catch (error) {
            next(error);
        }
    }
    
    async deleteUser(req, res, next) {
        try {
            const result = await userService.deleteUser(req.params.id);
            return ResponseUtil.success(res, result.message);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();