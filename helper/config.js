import fs from "fs";
import path from "path";
import * as toml from "toml";

// Read and parse the config file
const configPath = path.join(process.cwd(), "config.toml");
const configData = fs.readFileSync(configPath, "utf-8");
const config = toml.parse(configData);

export default config;