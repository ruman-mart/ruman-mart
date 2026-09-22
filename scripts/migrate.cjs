const path = require("node:path");
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");
const { SequelizeStorage, Umzug } = require("umzug");

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: console.log,
});

const migrationFiles = [
  "001-create-users.cjs",
  "002-remove-user-role.cjs",
  "003-cleanup-legacy-user-role.cjs",
  "004-create-categories.cjs",
  "005-add-featured-to-categories.cjs",
  "006-create-products.cjs",
  "007-add-product-merchandising-flags.cjs",
  "008-add-product-images.cjs",
  "009-add-product-detail-fields.cjs",
  "010-repair-product-detail-fields.cjs",
  "011-remove-free-shipping.cjs",
  "012-add-stock-quantity.cjs",
  "013-create-orders.cjs",
  "014-create-shipping-settings.cjs",
  "015-add-advance-account-number.cjs",
  "016-add-advance-account-title.cjs",
  "017-add-advance-account-name.cjs",
  "018-add-website-profile-settings.cjs",
].map((fileName) => {
  const migration = require(path.join(process.cwd(), "src/db/migrations", fileName));
  return { ...migration, name: fileName };
});

const migrator = new Umzug({
  migrations: migrationFiles,
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

migrator.up()
  .then((migrations) => {
    console.log(`Applied ${migrations.length} migration(s).`);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());