const ResponseUtil = require('../utils/responseUtil');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Sequelize 에러 처리
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
        return ResponseUtil.error(res, 'Validation error', 400, errors);
    }
    
    if (err.name === 'SequelizeUniqueConstraintError') {
        return ResponseUtil.error(res, 'Duplicate entry', 409);
    }
    
    // 기본 에러 응답
    return ResponseUtil.error(res, 
        err.message || 'Internal server error', 
        err.statusCode || 500
    );
};

const notFound = (req, res) => {
    return ResponseUtil.error(res, 'Route not found', 404);
};

module.exports = {
    errorHandler,
    notFound
};