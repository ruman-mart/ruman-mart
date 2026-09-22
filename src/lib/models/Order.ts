import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    orderNumber: { type: DataTypes.STRING(30), allowNull: false, unique: true, field: "order_number" },
    customerId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true, field: "customer_id" },
    customerName: { type: DataTypes.STRING(120), allowNull: false, field: "customer_name" },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    email: { type: DataTypes.STRING(190), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    province: { type: DataTypes.STRING(80), allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    postalCode: { type: DataTypes.STRING(20), allowNull: false, field: "postal_code" },
    country: { type: DataTypes.STRING(80), allowNull: false, defaultValue: "Pakistan" },
    items: { type: DataTypes.TEXT, allowNull: false },
    subtotal: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    shippingCost: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "shipping_cost" },
    discount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    paymentMethod: { type: DataTypes.STRING(40), allowNull: false, defaultValue: "cod", field: "payment_method" },
    status: { type: DataTypes.ENUM("Processing", "Shipped", "Delivered", "Cancelled"), allowNull: false, defaultValue: "Processing" },
  },
  { tableName: "orders", underscored: true, timestamps: true },
);

export default Order;