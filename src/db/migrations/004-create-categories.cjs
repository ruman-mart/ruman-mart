const { DataTypes } = require("sequelize");

const categories = [
  ["Electronics", "electronics", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80", "Smart devices and everyday technology made for modern life."],
  ["Homeware", "homeware", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80", "Make your home comfortable, beautiful, and functional."],
  ["Kitchen Accessories", "kitchen-accessories", "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80", "Useful essentials for happier cooking every day."],
  ["Style Gadgets", "style-gadgets", "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&q=80", "Smart accessories that fit your everyday style."],
  ["Perfumes", "perfumes", "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80", "Find a fragrance that defines your presence."],
  ["Watches", "watches", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80", "Timeless watches for every moment."],
];

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable("categories", {
      id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
      image: { type: DataTypes.STRING(500), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.bulkInsert("categories", categories.map(([name, slug, image, description]) => ({ name, slug, image, description, is_active: true, created_at: new Date(), updated_at: new Date() })));
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable("categories");
  },
};