import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING(120), allowNull: false, field: "full_name" },
    email: { type: DataTypes.STRING(190), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: "password_hash" },
  },
  { tableName: "users", underscored: true, timestamps: true },
);

export default User;