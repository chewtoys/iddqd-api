const User = (sequelize, type) => {
  return sequelize.define('users', {
    name: type.STRING,
    email: type.STRING,
    password: type.STRING,
    created_at: type.DATE,
    updated_at: type.DATE,
    last_login_attempt: type.DATE,
    token_lifetime: type.BIGINT
  }, {
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  })
};

module.exports = User;
