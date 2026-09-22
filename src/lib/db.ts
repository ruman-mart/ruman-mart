import { Sequelize } from "sequelize";
import mysql from "mysql2";

const isTiDBCloud = Boolean(process.env.DB_HOST?.includes("tidbcloud.com"));

const sequelize = new Sequelize({
  dialect: "mysql",
  dialectModule: mysql,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  dialectOptions: isTiDBCloud
    ? {
        ssl: {
          rejectUnauthorized: true,
          minVersion: "TLSv1.2",
        },
      }
    : undefined,
  pool: { max: 10, min: 0, idle: 10_000 },
});

export default sequelize;