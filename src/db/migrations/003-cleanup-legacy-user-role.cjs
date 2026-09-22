module.exports = {
  async up({ context: queryInterface }) {
    const columns = await queryInterface.describeTable("users");
    if (columns.role) await queryInterface.removeColumn("users", "role");
  },

  async down() {},
};