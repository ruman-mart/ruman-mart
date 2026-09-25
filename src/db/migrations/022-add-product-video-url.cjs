const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn("products", "video_url", {
      type: DataTypes.STRING(500),
      allowNull: true,
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn("products", "video_url");
  },
};
