require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config/config');
const { connectDB } = require('./src/config/database');
const { initializeDefaultUsers } = require('./migrations/init');

const PORT = config.server.port;

// 서버 시작
const startServer = async () => {
    try {
        // 데이터베이스 연결
        await connectDB();
        
        // 개발 환경에서 초기 데이터 생성
        if (config.server.env === 'development') {
            await initializeDefaultUsers();
        }
        
        // 서버 시작
        app.listen(PORT, () => {
            console.log(`
            ====================================
            🚀 Server running on port ${PORT}
            🌍 Environment: ${config.server.env}
            📦 API Base URL: http://localhost:${PORT}/api
            ====================================
            
            📝 Test Accounts:
            - admin/password123 (ADMIN)
            - manager/password123 (MANAGER)
            - user/password123 (USER)
            
            📚 API Endpoints:
            - POST   /api/auth/login
            - POST   /api/auth/signup
            - POST   /api/auth/refresh
            - POST   /api/auth/logout
            - GET    /api/auth/check
            
            - GET    /api/user/profile
            - PUT    /api/user/profile
            - GET    /api/user/users (MANAGER+)
            
            - GET    /api/admin/dashboard (ADMIN)
            - PUT    /api/admin/users/:id/role (ADMIN)
            ====================================
            `);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});