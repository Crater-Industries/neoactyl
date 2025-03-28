import { DataTypes } from "sequelize";
import sequelize from "@/helper/db";
import bcrypt from "bcryptjs";
import toml from "toml";
import fs from "fs";

// Load config
const config = toml.parse(
  fs.readFileSync(process.cwd() + "/config.toml", "utf-8")
);

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ram: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.ram,
  },
  disk: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.disk,
  },
  cpu: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.cpu,
  },
  allocations: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.allocations,
  },
  databases: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.database,
  },
  backups: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.backup,
  },
  slots: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.slots,
  },
  servers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isSuspended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

export default User;
