import "reflect-metadata";
import * as dotenv from "dotenv";
import { container } from "./inversify.config";

import { App } from "./app";
import { LoggerService } from "./services/logger.service";

// initialize configuration
dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
const application = container.get<App>(App);
const logger = container.get<LoggerService>(LoggerService);

application.app.listen(PORT, async () => {
  console.log(process.env.MUMBAI_RPC_PROVIDER);
  console.log(process.env.SKILL_WALLET_ADDRESS);
  // await connect(process.env.MONGODB_CONNECTION_STRING);
  logger.info("ThreadDB initialized");
  logger.info("SkillWallet API is listening on port " + PORT);
});
