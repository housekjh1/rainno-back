const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function setupDatabase() {
    let connection;
    
    try {
        // 1. MySQL 연결 (데이터베이스 없이)
        console.log('📦 Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'cngcctv1!'
        });
        
        console.log('✅ Connected to MySQL');
        
        // 2. 데이터베이스 생성
        const dbName = process.env.DB_NAME || 'rainno';
        console.log(`📦 Creating database: ${dbName}...`);
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        await connection.query(`USE ${dbName}`);
        console.log('✅ Database created/selected');
        
        // 3. Users 테이블 생성
        console.log('📦 Creating users table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('USER', 'MANAGER', 'ADMIN') DEFAULT 'USER',
                is_active BOOLEAN DEFAULT true,
                last_login DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_username (username),
                INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Users table created');
        
        // 4. Refresh Tokens 테이블 생성
        console.log('📦 Creating refresh_tokens table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                token VARCHAR(255) UNIQUE NOT NULL,
                user_id INT NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_token (token),
                INDEX idx_user_id (user_id),
                INDEX idx_expires (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Refresh tokens table created');
        
        // 5. CSRF Tokens 테이블 생성
        console.log('📦 Creating csrf_tokens table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS csrf_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                token VARCHAR(255) UNIQUE NOT NULL,
                user_id INT NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_token (token),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ CSRF tokens table created');
        
        // 6. 테스트 사용자 생성
        console.log('📦 Creating test users...');
        
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // 기존 사용자 확인
        const [existingUsers] = await connection.query(
            'SELECT username FROM users WHERE username IN (?, ?, ?)',
            ['admin', 'manager', 'user']
        );
        
        if (existingUsers.length === 0) {
            // 테스트 사용자 삽입
            const users = [
                ['admin', 'admin@example.com', hashedPassword, 'ADMIN'],
                ['manager', 'manager@example.com', hashedPassword, 'MANAGER'],
                ['user', 'user@example.com', hashedPassword, 'USER']
            ];
            
            for (const [username, email, password, role] of users) {
                await connection.query(
                    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                    [username, email, password, role]
                );
                console.log(`✅ Created ${role} user: ${username}/password123`);
            }
        } else {
            console.log('ℹ️ Test users already exist');
        }
        
        // 7. 테이블 확인
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\n📋 Created tables:');
        tables.forEach(table => {
            console.log(`   - ${Object.values(table)[0]}`);
        });
        
        console.log('\n✅ Database setup completed successfully!');
        console.log('\n📝 Test accounts:');
        console.log('   - admin/password123 (ADMIN)');
        console.log('   - manager/password123 (MANAGER)');
        console.log('   - user/password123 (USER)');
        
    } catch (error) {
        console.error('\n❌ Database setup failed:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n💡 Solution:');
            console.error('1. Check your MySQL username and password in .env file');
            console.error('2. Make sure MySQL is running');
            console.error('3. Try: mysql -u root -p (and enter your password)');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Solution:');
            console.error('1. Start MySQL service:');
            console.error('   - Windows: net start mysql');
            console.error('   - Mac: brew services start mysql');
            console.error('   - Linux: sudo service mysql start');
        }
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// 실행
setupDatabase();