const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("products");
    if (!columns.images) await queryInterface.addColumn("products", "images", { type: DataTypes.TEXT, allowNull: true });
  },
  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("products");
    if (columns.images) await queryInterface.removeColumn("products", "images");
  },
};