module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'purchases',
    {
      albumId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      classMethods: {
        associate: models =>
          Purchase.belongsTo(models.user, {
            as: 'userId',
            onDelete: 'CASCADE'
          })
      }
    }
  );
  sequelize.sync();
  return Purchase;
};
