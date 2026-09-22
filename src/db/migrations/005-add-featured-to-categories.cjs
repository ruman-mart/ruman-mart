const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("categories");
    if (!columns.is_featured) {
      await queryInterface.addColumn("categories", "is_featured", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("categories");
    if (columns.is_featured) await queryInterface.removeColumn("categories", "is_featured");
  },
};