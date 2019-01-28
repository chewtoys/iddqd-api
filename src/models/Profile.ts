export default (sequelize, type) => {
  return sequelize.define(
    "profiles",
    {
      user_id: type.INTEGER,
      language: type.STRING,
      country: type.STRING,
      gender: type.INTEGER,
      city: type.STRING,
      first_name: type.STRING,
      last_name: type.STRING,
      private_site: type.STRING,
      about: type.TEXT,
      time_zone: type.INTEGER,
      avatar_id: type.INTEGER,
      company: type.STRING,
    },
    {
      updatedAt: "updated_at",
      createdAt: "created_at"
    }
  );
};
