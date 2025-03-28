import fs from "fs";
import path from "path";
import * as toml from "toml";

// Read and parse the config file
const configPath = path.resolve(process.cwd(), "config.toml");
const configData = fs.readFileSync(configPath, "utf-8");
export default config = toml.parse(configData);
