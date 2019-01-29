'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      language: {
        defaultValue: 'en',
        type: Sequelize.STRING
      },
      country: {
        defaultValue: null,
        type: Sequelize.STRING
      },
      gender: {
        defaultValue: null,
        type: Sequelize.INTEGER
      },
      city: {
        defaultValue: null,
        type: Sequelize.STRING
      },
      first_name: {
        defaultValue: null,
        type: Sequelize.STRING
      },
      last_name: {
        defaultValue: null,
        type: Sequelize.STRING
      },
      private_site: {
        defaultValue: null,
        type: Sequelize.STRING
      },
      about: {
        defaultValue: null,
        type: Sequelize.TEXT
      },
      time_zone: {
        defaultValue: null,
        type: Sequelize.INTEGER
      },
      avatar_id: {
        defaultValue: null,
        type: Sequelize.INTEGER
      },
      company: {
        defaultValue: null,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('profiles');
  }
};
