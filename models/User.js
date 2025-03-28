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
    validate: {
      notEmpty: { msg: "First name cannot be empty" },
      len: {
        args: [2, 50],
        msg: "First name must be between 2 and 50 characters",
      },
    },
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Last name cannot be empty" },
      len: {
        args: [2, 50],
        msg: "Last name must be between 2 and 50 characters",
      },
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: "Username is already taken" },
    validate: {
      notEmpty: { msg: "Username cannot be empty" },
      len: {
        args: [3, 30],
        msg: "Username must be between 3 and 30 characters",
      },
      is: {
        args: /^[a-zA-Z0-9_-]+$/,
        msg: "Username can only contain letters, numbers, underscores and dashes",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: "Email is already registered" },
    validate: {
      notEmpty: { msg: "Email cannot be empty" },
      isEmail: { msg: "Invalid email format" },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Password cannot be empty" },
      len: {
        args: [8, 100],
        msg: "Password must be at least 8 characters long",
      },
    },
  },
  coins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: 0, msg: "Coins cannot be negative" },
    },
  },
  ram: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.ram,
    validate: {
      min: { args: 0, msg: "RAM allocation cannot be negative" },
    },
  },
  disk: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.disk,
    validate: {
      min: { args: 0, msg: "Disk allocation cannot be negative" },
    },
  },
  cpu: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.cpu,
    validate: {
      min: { args: 0, msg: "CPU allocation cannot be negative" },
    },
  },
  allocations: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.allocations,
    validate: {
      min: { args: 0, msg: "Allocations cannot be negative" },
    },
  },
  databases: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.database,
    validate: {
      min: { args: 0, msg: "Database count cannot be negative" },
    },
  },
  backups: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.backup,
    validate: {
      min: { args: 0, msg: "Backup count cannot be negative" },
    },
  },
  slots: {
    type: DataTypes.INTEGER,
    defaultValue: config.Resources.slots,
    validate: {
      min: { args: 0, msg: "Slots cannot be negative" },
    },
  },
  servers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: 0, msg: "Server count cannot be negative" },
    },
  },
  isSuspended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
  // Add instance methods
  instanceMethods: {
    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    },
  },
});

export default User;
