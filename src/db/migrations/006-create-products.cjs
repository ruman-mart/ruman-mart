const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable("products", {
      id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(180), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      brand: { type: DataTypes.STRING(120), allowNull: false },
      category_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, references: { model: "categories", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      original_price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      image: { type: DataTypes.STRING(500), allowNull: false },
      rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false, defaultValue: 0 },
      reviews: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable("products");
  },
};