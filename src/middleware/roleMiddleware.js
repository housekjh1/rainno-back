const ResponseUtil = require('../utils/responseUtil');

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ResponseUtil.unauthorized(res, 'Not authenticated');
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return ResponseUtil.forbidden(res, 
                `Access denied. Required roles: ${allowedRoles.join(', ')}`
            );
        }
        
        next();
    };
};

module.exports = { authorize };