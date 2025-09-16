const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
    config.database.database,
    config.database.username,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialect: config.database.dialect,
        pool: config.database.pool,
        logging: config.database.logging
    }
);

// 연결 테스트
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL connected successfully');
        
        // 개발 환경에서는 모델 동기화 (주의: 프로덕션에서는 마이그레이션 사용)
        if (config.server.env === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database synchronized');
        }
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };