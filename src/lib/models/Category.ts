import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";

const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
    image: { type: DataTypes.STRING(500), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" },
    isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "is_featured" },
  },
  { tableName: "categories", underscored: true, timestamps: true },
);

export default Category;