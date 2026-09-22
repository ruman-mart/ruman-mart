const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("products");
    if (!columns.stock_quantity) {
      await queryInterface.addColumn("products", "stock_quantity", {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      });
    }
  },
  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("products");
    if (columns.stock_quantity) await queryInterface.removeColumn("products", "stock_quantity");
  },
};