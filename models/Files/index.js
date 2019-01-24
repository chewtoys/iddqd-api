export default (sequelize, type) => {
  return sequelize.define('files', {
    original_name: type.STRING,
    extension: type.STRING,
    size: type.INTEGER,
    original_uri: type.STRING,
    preview_uri: type.STRING,
    created_at: type.DATE,
    updated_at: type.DATE,
  }, {
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  })
};
