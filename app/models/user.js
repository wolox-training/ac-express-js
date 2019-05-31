// const Purchase = require('.').purchases;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      firstName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isAdmin: {
        allowNull: true,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      }
    },
    {
      timestamps: false,
      classMethods: {
        associate: models => {
          User.hasMany(models.purchases);
        }
      }
    }
  );
  sequelize.sync();
  return User;
};
