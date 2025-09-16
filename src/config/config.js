require('dotenv').config();

module.exports = {
    // Server Config
    server: {
        port: process.env.PORT || 8000,
        env: process.env.NODE_ENV || 'development'
    },
    
    // Database Config
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || 'rainno',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'cngcctv1!',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    },
    
    // JWT Config
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpire: process.env.JWT_ACCESS_EXPIRE || '15m',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d'
    },
    
    // Security Config
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15,
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },
    
    // Cookie Config
    cookies: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        accessMaxAge: 15 * 60 * 1000, // 15분
        refreshMaxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    }
};