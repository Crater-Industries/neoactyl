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
  port = Number(port); // Convert port to an integer
}

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
    logging: false, // Set to `true` for debugging SQL queries
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("\x1b[36m%s\x1b[0m", "📦 Database Connected:");
    console.log("\x1b[36m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━");
    console.log(
      "\x1b[32m%s\x1b[0m",
      `✓ ${isMySQL ? "MySQL" : "SQLite"} initialized successfully`
    );
    console.log("\x1b[32m%s\x1b[0m", "✓ Connection established\n");
  })
  .catch((err) => {
    console.error("\x1b[31m%s\x1b[0m", "✗ Database connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// Sync models with the database
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("\x1b[32m%s\x1b[0m", "✓ Database synced\n");
  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", "✗ Database sync error:", err);
  }
})();

export default sequelize;
