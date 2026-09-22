import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";

const ShippingSettings = sequelize.define(
  "ShippingSettings",
  {
    id: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, primaryKey: true, defaultValue: 1 },
    rates: { type: DataTypes.TEXT, allowNull: false },
    advanceShipping: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "advance_shipping" },
    advanceAccountNumber: { type: DataTypes.STRING(100), allowNull: true, field: "advance_account_number" },
    advanceAccountTitle: { type: DataTypes.STRING(120), allowNull: true, field: "advance_account_title" },
    advanceAccountName: { type: DataTypes.STRING(120), allowNull: true, field: "advance_account_name" },
    logoUrl: { type: DataTypes.STRING(500), allowNull: true, field: "logo_url" },
    storeAddress: { type: DataTypes.STRING(255), allowNull: true, field: "store_address" },
    storePhone: { type: DataTypes.STRING(40), allowNull: true, field: "store_phone" },
    storeEmail: { type: DataTypes.STRING(190), allowNull: true, field: "store_email" },
    facebookUrl: { type: DataTypes.STRING(500), allowNull: true, field: "facebook_url" },
    instagramUrl: { type: DataTypes.STRING(500), allowNull: true, field: "instagram_url" },
    tiktokUrl: { type: DataTypes.STRING(500), allowNull: true, field: "tiktok_url" },
    whatsappUrl: { type: DataTypes.STRING(500), allowNull: true, field: "whatsapp_url" },
  },
  { tableName: "shipping_settings", underscored: true, timestamps: true },
);

export default ShippingSettings;