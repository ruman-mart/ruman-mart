import { SequelizeStorage, Umzug } from "umzug";
import sequelize from "@/lib/db";

const migration001 = require("../db/migrations/001-create-users.cjs");
const migration002 = require("../db/migrations/002-remove-user-role.cjs");
const migration003 = require("../db/migrations/003-cleanup-legacy-user-role.cjs");
const migration004 = require("../db/migrations/004-create-categories.cjs");
const migration005 = require("../db/migrations/005-add-featured-to-categories.cjs");
const migration006 = require("../db/migrations/006-create-products.cjs");
const migration007 = require("../db/migrations/007-add-product-merchandising-flags.cjs");
const migration008 = require("../db/migrations/008-add-product-images.cjs");
const migration009 = require("../db/migrations/009-add-product-detail-fields.cjs");
const migration010 = require("../db/migrations/010-repair-product-detail-fields.cjs");
const migration011 = require("../db/migrations/011-remove-free-shipping.cjs");
const migration012 = require("../db/migrations/012-add-stock-quantity.cjs");
const migration013 = require("../db/migrations/013-create-orders.cjs");
const migration014 = require("../db/migrations/014-create-shipping-settings.cjs");
const migration015 = require("../db/migrations/015-add-advance-account-number.cjs");
const migration016 = require("../db/migrations/016-add-advance-account-title.cjs");
const migration017 = require("../db/migrations/017-add-advance-account-name.cjs");
const migration018 = require("../db/migrations/018-add-website-profile-settings.cjs");

const migrationFiles = [
  { ...migration001, name: "001-create-users.cjs" },
  { ...migration002, name: "002-remove-user-role.cjs" },
  { ...migration003, name: "003-cleanup-legacy-user-role.cjs" },
  { ...migration004, name: "004-create-categories.cjs" },
  { ...migration005, name: "005-add-featured-to-categories.cjs" },
  { ...migration006, name: "006-create-products.cjs" },
  { ...migration007, name: "007-add-product-merchandising-flags.cjs" },
  { ...migration008, name: "008-add-product-images.cjs" },
  { ...migration009, name: "009-add-product-detail-fields.cjs" },
  { ...migration010, name: "010-repair-product-detail-fields.cjs" },
  { ...migration011, name: "011-remove-free-shipping.cjs" },
  { ...migration012, name: "012-add-stock-quantity.cjs" },
  { ...migration013, name: "013-create-orders.cjs" },
  { ...migration014, name: "014-create-shipping-settings.cjs" },
  { ...migration015, name: "015-add-advance-account-number.cjs" },
  { ...migration016, name: "016-add-advance-account-title.cjs" },
  { ...migration017, name: "017-add-advance-account-name.cjs" },
  { ...migration018, name: "018-add-website-profile-settings.cjs" },
];

const migrator = new Umzug({
  migrations: migrationFiles,
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

let migrationRun: Promise<unknown[]> | undefined;

export function runMigrations() {
  migrationRun ??= migrator.up();
  return migrationRun;
}