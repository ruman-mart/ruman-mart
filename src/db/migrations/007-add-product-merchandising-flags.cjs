const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("products");
    for (const column of ["is_featured", "is_new_arrival", "is_deal"]) {
      if (!columns[column]) await queryInterface.addColumn("products", column, { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false });
    }
  },
  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("products");
    for (const column of ["is_featured", "is_new_arrival", "is_deal"]) {
      if (columns[column]) await queryInterface.removeColumn("products", column);
    }
  },
};