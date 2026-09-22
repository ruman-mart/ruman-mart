const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    if (!columns.advance_account_title) {
      await queryInterface.addColumn("shipping_settings", "advance_account_title", {
        type: DataTypes.STRING(120),
        allowNull: true,
      });
    }
  },
  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    if (columns.advance_account_title) await queryInterface.removeColumn("shipping_settings", "advance_account_title");
  },
};