import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";

const Inquiry = sequelize.define(
  "Inquiry",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(190), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    subject: { type: DataTypes.STRING(120), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM("New", "Read", "Resolved"), allowNull: false, defaultValue: "New" },
  },
  { tableName: "inquiries", underscored: true, timestamps: true },
);

export default Inquiry;
