const bcrypt = require('bcrypt');
const config = require('../config/config');

class HashUtil {
    static async hashPassword(password) {
        return await bcrypt.hash(password, config.security.bcryptRounds);
    }
    
    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = HashUtil;