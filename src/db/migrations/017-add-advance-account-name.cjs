const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    if (!columns.advance_account_name) {
      await queryInterface.addColumn("shipping_settings", "advance_account_name", {
        type: DataTypes.STRING(120),
        allowNull: true,
      });
    }
  },
  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    if (columns.advance_account_name) await queryInterface.removeColumn("shipping_settings", "advance_account_name");
  },
};