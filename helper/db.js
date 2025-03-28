import { Sequelize } from "sequelize";
import toml from "toml";
import fs from "fs";
import path from "path";

// Load the config file
const config = toml.parse(
  fs.readFileSync(process.cwd() + "/config.toml", "utf-8")
);

const isMySQL = config.database.type === "mysql";
let host = "localhost";
let port = 3306;

if (isMySQL && config.database.mysql.host.includes(":")) {
  [host, port] = config.database.mysql.host.split(":");
  port = Number(port);
}

const retryOptions = {
  max: 5,
  min: 3000, // 3 seconds
  acquire: 60000, // 60 seconds
  idle: 10000, // 10 seconds
};

// Create Sequelize instance with proper configuration
const sequelize = new Sequelize(
  isMySQL ? config.database.mysql.database : undefined,
  isMySQL ? config.database.mysql.username : undefined,
  isMySQL ? config.database.mysql.password : undefined,
  {
    dialect: isMySQL ? "mysql" : "sqlite",
    host: isMySQL ? host : undefined,
    port: isMySQL ? port : undefined,
    storage: isMySQL
      ? undefined
      : path.join(process.cwd(), config.database.filename),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    retry: retryOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test the connection with improved error handling
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("\x1b[36m%s\x1b[0m", "📦 Database Connected:");
    console.log("\x1b[36m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━");
    console.log(
      "\x1b[32m%s\x1b[0m",
      `✓ ${isMySQL ? "MySQL" : "SQLite"} initialized successfully`
    );
    console.log("\x1b[32m%s\x1b[0m", "✓ Connection established\n");

    // Sync models with safe options
    await sequelize.sync({ 
      alter: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development'
    });
    console.log("\x1b[32m%s\x1b[0m", "✓ Database synced\n");
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "✗ Database connection error:", error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error("\x1b[31m%s\x1b[0m", "Error details:", error.stack);
    }
    // In production, we might want to try reconnecting or gracefully shutdown
    if (process.env.NODE_ENV === 'production') {
      console.log("\x1b[33m%s\x1b[0m", "Attempting to reconnect...");
      setTimeout(initDatabase, 5000); // Try to reconnect after 5 seconds
    } else {
      process.exit(1);
    }
  }
};

// Initialize database connection
initDatabase();

// Handle cleanup on application shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log("\x1b[36m%s\x1b[0m", "\n📦 Database connection closed gracefully");
    process.exit(0);
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error closing database connection:", error);
    process.exit(1);
  }
});

export default sequelize;
