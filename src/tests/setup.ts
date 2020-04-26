import { config } from "dotenv";

config();

process.env.NODE_ENV = "test";
process.env.PORT = "9081";