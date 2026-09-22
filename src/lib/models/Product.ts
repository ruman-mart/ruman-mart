import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";
import Category from "@/lib/models/Category";

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(180), allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    brand: { type: DataTypes.STRING(120), allowNull: false },
    categoryId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: "category_id" },
    price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    originalPrice: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "original_price" },
    image: { type: DataTypes.STRING(500), allowNull: false },
    images: { type: DataTypes.TEXT, allowNull: true },
    rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false, defaultValue: 0 },
    reviews: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" },
    isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "is_featured" },
    isNewArrival: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "is_new_arrival" },
    isDeal: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "is_deal" },
    colors: { type: DataTypes.TEXT, allowNull: true },
    storageOptions: { type: DataTypes.TEXT, allowNull: true, field: "storage_options" },
    quickSpecs: { type: DataTypes.TEXT, allowNull: true, field: "quick_specs" },
    description: { type: DataTypes.TEXT, allowNull: true },
    keyFeatures: { type: DataTypes.TEXT, allowNull: true, field: "key_features" },
    inStock: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "in_stock" },
    stockQuantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: "stock_quantity" },
  },
  { tableName: "products", underscored: true, timestamps: true },
);

if (!Product.associations.category) {
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
}
if (!Category.associations.products) {
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
}

export default Product;