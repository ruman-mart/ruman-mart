const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.changeColumn("orders", "postal_code", {
      type: DataTypes.STRING(20),
      allowNull: true,
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.changeColumn("orders", "postal_code", {
      type: DataTypes.STRING(20),
      allowNull: false,
    });
  },
};
