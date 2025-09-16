const User = require('./User');
const RefreshToken = require('./RefreshToken');
const { sequelize } = require('../config/database');

// 관계 설정
User.hasMany(RefreshToken, { 
    foreignKey: 'user_id', 
    as: 'refreshTokens',
    onDelete: 'CASCADE' 
});

RefreshToken.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
});

module.exports = {
    sequelize,
    User,
    RefreshToken
};