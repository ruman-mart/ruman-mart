const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    const fields = {
      logo_url: DataTypes.STRING(500),
      store_address: DataTypes.STRING(255),
      store_phone: DataTypes.STRING(40),
      store_email: DataTypes.STRING(190),
      facebook_url: DataTypes.STRING(500),
      instagram_url: DataTypes.STRING(500),
      tiktok_url: DataTypes.STRING(500),
      whatsapp_url: DataTypes.STRING(500),
    };
    for (const [name, type] of Object.entries(fields)) {
      if (!columns[name]) await queryInterface.addColumn("shipping_settings", name, { type, allowNull: true });
    }
  },
  async down({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("shipping_settings");
    for (const name of ["logo_url", "store_address", "store_phone", "store_email", "facebook_url", "instagram_url", "tiktok_url", "whatsapp_url"]) {
      if (columns[name]) await queryInterface.removeColumn("shipping_settings", name);
    }
  },
};