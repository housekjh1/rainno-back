class ResponseUtil {
    static success(res, message, data = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    
    static error(res, message, statusCode = 400, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }
    
    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({
            success: false,
            message
        });
    }
    
    static forbidden(res, message = 'Forbidden') {
        return res.status(403).json({
            success: false,
            message
        });
    }
}

module.exports = ResponseUtil;