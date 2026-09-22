const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes("shipping_settings")) return;
    await queryInterface.createTable("shipping_settings", {
      id: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, primaryKey: true, defaultValue: 1 },
      rates: { type: DataTypes.TEXT, allowNull: false },
      advance_shipping: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.bulkInsert("shipping_settings", [{
      id: 1,
      rates: JSON.stringify({ punjab: 250, sindh: 200, "khyber-pakhtunkhwa": 300, balochistan: 350, islamabad: 250, "azad-kashmir": 350, "gilgit-baltistan": 450 }),
      advance_shipping: false,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable("shipping_settings");
  },
};