import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { SkillWalletContracts } from "../contracts/skillWallet.contracts";
import * as skillWalletService from "../services/skillWallet.service";
import { Actions } from "../models";

@injectable()
export class SkillWalletController {
  constructor(private loggerService: LoggerService) {}

  public get = async (req: any, res: Response) => {
    try {
      const skillWallet = await skillWalletService.getSkillWallet(
        req.query.tokenId
      );
      if (skillWallet) return res.status(200).send(skillWallet);
      else
        return res.status(400).send({
          message: "Skill Wallet does not exist or it is not activated yet",
        });
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getConfig = async (_: any, res: Response) => {
    try {
      return res.status(200).send({
        skillWalletAddress: process.env.SKILL_WALLET_ADDRESS,
        rpc: process.env.MUMBAI_RPC_PROVIDER,
      });
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public authenticatePartnersApp = async (req: any, res: Response) => {
    try {
      if (
        req.headers["authorization"] == process.env.PARTNERS_APP_ACCESS_CODE
      ) {
        return res.status(200).send({ message: "Valid access key!" });
      } else {
        return res.status(403).send({ message: "Invalid access key!" });
      }
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };
  public getInteractions = async (req: any, res: Response) => {
    try {
      const interactionNFTs = await skillWalletService.getInteractions(
        req.params.skillWalletId
      );
      return res.status(200).send(interactionNFTs);
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getTasks = async (req: any, res: Response) => {
    try {
      const events = await skillWalletService.getTasks(
        req.query.activitiesAddress
      );
      return res.status(200).send(events);
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getTaskById = async (req: any, res: Response) => {
    try {
      const task = await skillWalletService.getTaskById(
        req.query.activitiesAddress,
        req.params.taskId
      );
      return res.status(200).send(task);
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getEvents = async (req: any, res: Response) => {
    try {
      const events = await skillWalletService.getEvents(
        req.params.skillWalletId
      );
      return res.status(200).send(events);
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getBadges = async (req: any, res: Response) => {
    try {
      const events = await skillWalletService.getBadges(
        req.params.skillWalletId
      );
      return res.status(200).send(events);
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getMembershipID = async (req: any, res: Response) => {
    try {
      console.log("getMembershipID");
      const events = await skillWalletService.getMembershipID(
        req.params.skillWalletId,
        req.params.communityAddress
      );
      return res.status(200).send(events);
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public activateSkillWallet = async (req: any, res: Response) => {
    console.log("activateSkillWallet", req.params.skillWalletId);

    try {
      if (!req.params.skillWalletId) {
        return res.status(400).send("No skillWalletId passed!");
      }
      if (!req.body.signature) {
        return res.status(400).send("No signature passed");
      }
      if (+req.params.skillWalletId == -1) {
        await (new Promise(resolve => setTimeout(resolve, 4000)));
        return res
          .status(200)
          .send({ message: "Skill Wallet activated successfully." });
      }
      const isActive = await SkillWalletContracts.isActive(
        req.params.skillWalletId
      );
      if (isActive) {
        console.log("skill wallet active");
        return res
          .status(400)
          .send({ message: "Skill Wallet already activated" });
      } else {
        console.log("activating SW");
        console.log("sig", req.body.signature);
        await SkillWalletContracts.validate(
          req.body.signature,
          req.params.skillWalletId,
          Actions.Activate,
          [],
          [],
          []
        );
        return res
          .status(200)
          .send({ message: "Skill Wallet activated successfully." });
      }
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public isActive = async (req: any, res: Response) => {
    try {
      if (+req.params.skillWalletId == -1)
        return res.status(200).send({ isActive: true });
      const isActive = await SkillWalletContracts.isActive(
        req.params.skillWalletId
      );
      console.log(isActive);
      return res.status(200).send({ isActive });
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public generateNonce = async (req: any, res: Response) => {
    try {
      const nonce = await skillWalletService.getNonceForQR(
        +req.query.action,
        req.params.skillWalletId
      );
      res.status(200).send(nonce);
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getNonceForValidation = async (req: any, res: Response) => {
    try {
      const nonces = await skillWalletService.findNonce(
        req.query.action,
        req.params.skillWalletId
      );
      return res.status(200).send({ nonces });
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public deleteNonce = async (req: any, res: Response) => {
    try {
      await skillWalletService.invalidateNonce(
        req.query.nonce,
        req.params.skillWalletId,
        req.query.action
      );
      return res.status(200).send();
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public addPubKeyToSkillWallet = async (req: any, res: Response) => {
    try {
      this.loggerService.info("adding public key to skill wallet");
      const pubKey = req.body.pubKey;
      const skillWalletId = req.params.skillWalletId;
      if (skillWalletId == "-1") {
        await (new Promise(resolve => setTimeout(resolve, 3000)))
        return res
          .status(200)
          .send({ message: "Successfully added pubKey to SW." });
      }
      if (!pubKey)
        return res.status(400).send({ message: "pubKey is a required field" });
      if (!skillWalletId || skillWalletId < 0) {
        return res.status(404).send({ message: "skillWallet is a required field" });
      } else {
        await SkillWalletContracts.addPubKeyToSkillWallet(
          skillWalletId,
          pubKey
        );
        return res.status(200).send({ message: "Successfully added pubKey to SW." });
      }
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public validate = async (req: any, res: Response) => {
    console.log("validate", req.params.skillWalletId);
    try {
      if (!req.params.skillWalletId) {
        return res.status(400).send("No skillWalletId passed!");
      }
      if (!req.body.signature) {
        return res.status(400).send("No signature passed");
      }
      if (!req.body.action) {
        return res.status(400).send("No action passed");
      }
      const isActive = await SkillWalletContracts.isActive(
        req.params.skillWalletId
      );
      if (!isActive) {
        return res
          .status(400)
          .send({ message: "Skill Wallet is not activated yet!" });
      } else {
        console.log("signature", req.body.signature);
        console.log("skillWalletId", req.params.skillWalletId);
        console.log("action", req.body.action);

        const strParams = req.body.stringParams ?? [];
        const intParams = req.body.intParams ?? [];
        const addressParams = req.body.addressParams ?? [];

        console.log("strParams", strParams);
        console.log("intParams", intParams);
        console.log("addressParams", addressParams);
        await SkillWalletContracts.validate(
          req.body.signature,
          req.params.skillWalletId,
          req.body.action,
          strParams,
          intParams,
          addressParams
        );
        return res.status(200).send({ message: "Validation requested." });
      }
    } catch (err) {
      this.loggerService.error(err);
      return res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };
}
