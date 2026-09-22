const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes("orders")) return;

    await queryInterface.createTable("orders", {
      id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      order_number: { type: DataTypes.STRING(30), allowNull: false, unique: true },
      customer_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
      customer_name: { type: DataTypes.STRING(120), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: false },
      email: { type: DataTypes.STRING(190), allowNull: false },
      address: { type: DataTypes.STRING(255), allowNull: false },
      province: { type: DataTypes.STRING(80), allowNull: false },
      city: { type: DataTypes.STRING(100), allowNull: false },
      postal_code: { type: DataTypes.STRING(20), allowNull: false },
      country: { type: DataTypes.STRING(80), allowNull: false, defaultValue: "Pakistan" },
      items: { type: DataTypes.TEXT, allowNull: false },
      subtotal: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      shipping_cost: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      discount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      total: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      payment_method: { type: DataTypes.STRING(40), allowNull: false, defaultValue: "cod" },
      status: { type: DataTypes.ENUM("Processing", "Shipped", "Delivered", "Cancelled"), allowNull: false, defaultValue: "Processing" },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable("orders");
  },
};