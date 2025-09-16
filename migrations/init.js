const bcrypt = require('bcrypt');
const { User } = require('../src/models');
const config = require('../src/config/config');

const initializeDefaultUsers = async () => {
    try {
        // 기본 사용자 확인
        const adminExists = await User.findOne({ 
            where: { username: 'admin' } 
        });
        
        if (!adminExists) {
            const defaultPassword = 'password123';
            
            // 기본 사용자 생성
            const users = [
                {
                    username: 'admin',
                    email: 'admin@example.com',
                    password: defaultPassword,
                    role: 'ADMIN'
                },
                {
                    username: 'manager',
                    email: 'manager@example.com',
                    password: defaultPassword,
                    role: 'MANAGER'
                },
                {
                    username: 'user',
                    email: 'user@example.com',
                    password: defaultPassword,
                    role: 'USER'
                }
            ];
            
            for (const userData of users) {
                await User.create(userData);
                console.log(`✅ Created ${userData.role}: ${userData.username}`);
            }
            
            console.log('✅ Default users initialized');
        }
    } catch (error) {
        console.error('Error initializing users:', error);
    }
};

module.exports = { initializeDefaultUsers };

// CLI 실행 지원
if (require.main === module) {
    const { connectDB } = require('../src/config/database');
    
    (async () => {
        await connectDB();
        await initializeDefaultUsers();
        process.exit(0);
    })();
}