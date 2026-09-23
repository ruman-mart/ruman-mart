const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    const fields = {
      about_story_title: DataTypes.STRING(180),
      about_story_text: DataTypes.TEXT,
      about_story_second_text: DataTypes.TEXT,
      about_story_image: DataTypes.STRING(500),
    };
    for (const [name, type] of Object.entries(fields)) {
      if (!columns[name]) await queryInterface.addColumn("shipping_settings", name, { type, allowNull: true });
    }
  },
  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    for (const name of ["about_story_title", "about_story_text", "about_story_second_text", "about_story_image"]) {
      if (columns[name]) await queryInterface.removeColumn("shipping_settings", name);
    }
  },
};
