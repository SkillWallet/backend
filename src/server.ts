import "reflect-metadata";
import * as dotenv from "dotenv";
import { container } from "./inversify.config";

import { App } from "./app";
import { LoggerService } from "./services/logger.service";
import { SkillWalletContracts } from "./contracts/skillWallet.contracts"

// initialize configuration
dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
const application = container.get<App>(App);
const logger = container.get<LoggerService>(LoggerService);

application.app.listen(PORT,async  () => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  await sleep(10000);
  console.log('aaaaa')
  console.log(process.env.MUMBAI_RPC_PROVIDER);
  console.log(process.env.SKILL_WALLET_ADDRESS);
  logger.info("ThreadDB initialized");
  logger.info("SkillWallet API is listening on port " + PORT);
});
