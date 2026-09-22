const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("products");
    const fields = {
      colors: { type: DataTypes.TEXT, allowNull: true },
      storage_options: { type: DataTypes.TEXT, allowNull: true },
      quick_specs: { type: DataTypes.TEXT, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      key_features: { type: DataTypes.TEXT, allowNull: true },
      in_stock: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      free_shipping: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    };
    for (const [name, definition] of Object.entries(fields)) {
      if (!columns[name]) await queryInterface.addColumn("products", name, definition);
    }
  },
  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("products");
    for (const name of ["colors", "storage_options", "quick_specs", "description", "key_features", "in_stock", "free_shipping"]) {
      if (columns[name]) await queryInterface.removeColumn("products", name);
    }
  },
};