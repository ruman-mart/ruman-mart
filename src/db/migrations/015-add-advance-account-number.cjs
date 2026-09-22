const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    if (!columns.advance_account_number) {
      await queryInterface.addColumn("shipping_settings", "advance_account_number", {
        type: DataTypes.STRING(100),
        allowNull: true,
      });
    }
  },
  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    if (columns.advance_account_number) await queryInterface.removeColumn("shipping_settings", "advance_account_number");
  },
};