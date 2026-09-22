module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("products");
    if (columns.free_shipping) await queryInterface.removeColumn("products", "free_shipping");
  },
  async down() {},
};