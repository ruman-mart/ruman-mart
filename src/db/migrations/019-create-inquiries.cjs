const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes("inquiries")) return;

    await queryInterface.createTable("inquiries", {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(190), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      subject: { type: DataTypes.STRING(120), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.ENUM("New", "Read", "Resolved"), allowNull: false, defaultValue: "New" },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable("inquiries");
  },
};
