import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { SkillWalletContracts } from "../contracts/skillWallet.contracts";
import * as skillWalletService from "../services/skillWallet.service";
import { Actions } from "../models";

@injectable()
export class SkillWalletController {
  constructor(private loggerService: LoggerService) { }

  public get = async (req: any, res: Response) => {
    try {
      this.loggerService.info("get");

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
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getConfig = async (req: any, res: Response) => {
    try {
      return res.status(200).send({
        skillWalletAddress: process.env.SKILL_WALLET_ADDRESS,
        rpc: process.env.MUMBAI_RPC_PROVIDER,
      });
    } catch (err) {
      this.loggerService.error(err);
      res
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
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };
  public getInteractions = async (req: any, res: Response) => {
    try {
      this.loggerService.info("getInteractions");
      const interactionNFTs = await skillWalletService.getInteractions(
        req.params.skillWalletId
      );
      return res.status(200).send(interactionNFTs);
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getTasks = async (req: any, res: Response) => {
    try {
      this.loggerService.info("getTasks");

      const events = await skillWalletService.getTasks(
        req.query.activitiesAddress
      );
      return res.status(200).send(events);
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getTaskById = async (req: any, res: Response) => {
    try {
      this.loggerService.info("getTaskById");
      const task = await skillWalletService.getTaskById(
        req.query.activitiesAddress,
        req.params.taskId
      );
      return res.status(200).send(task);
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getEvents = async (req: any, res: Response) => {
    try {
      this.loggerService.info("getEvents");
      const events = await skillWalletService.getEvents(
        req.params.skillWalletId
      );
      return res.status(200).send(events);
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getBadges = async (req: any, res: Response) => {
    try {
      this.loggerService.info("getBadges");
      const events = await skillWalletService.getBadges(
        req.params.skillWalletId
      );
      return res.status(200).send(events);
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getMembershipID = async (req: any, res: Response) => {
    try {
      this.loggerService.info("getMembershipID");
      const events = await skillWalletService.getMembershipID(
        req.params.skillWalletId,
        req.params.communityAddress
      );
      this.loggerService.info("returning!");
      return res.status(200).send(events);
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public activateSkillWallet = async (req: any, res: Response) => {
    this.loggerService.info("activateSkillWallet " + req.params.skillWalletId);
    try {
      if (!req.params.skillWalletId) {
        return res.status(400).send("No skillWalletId passed!");
      }
      if (!req.body.signature) {
        return res.status(400).send("No signature passed");
      }
      if (+req.params.skillWalletId == 123123123) {
        this.loggerService.info("waiting ");
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
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public isActive = async (req: any, res: Response) => {
    try {
      this.loggerService.info("isActive called ");
      this.loggerService.info("skillWalletID " + req.params.skillWalletId);

      if (+req.params.skillWalletId == 123123123)
        return res.status(200).send({ isActive: true });
      const isActive = await SkillWalletContracts.isActive(
        req.params.skillWalletId
      );
      console.log(isActive);
      return res.status(200).send({ isActive });
    } catch (err) {
      this.loggerService.error(err);
      res
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
      res
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
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public addPubKeyToSkillWallet = async (req: any, res: Response) => {
    try {
      this.loggerService.info("adding public key to skill wallet");
      this.loggerService.info("skillWalletID " + req.params.skillWalletId);
      const pubKey = req.body.pubKey;
      const skillWalletId = req.params.skillWalletId;
      if (skillWalletId == "123123123") {
        await (new Promise(resolve => setTimeout(resolve, 3000)))
        return res
          .status(200)
          .send({ message: "Successfully added pubKey to SW." });
      }
      if (!pubKey)
        return res.status(400).send({ message: "pubKey is a required field" });
      if (!skillWalletId || skillWalletId < 0) {
        res.status(404).send({ message: "skillWallet is a required field" });
      } else {
        await SkillWalletContracts.addPubKeyToSkillWallet(
          skillWalletId,
          pubKey
        );
        res.status(200).send({ message: "Successfully added pubKey to SW." });
      }
    } catch (err) {
      this.loggerService.error(err);
      res
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
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getChat = async (req: any, res: Response) => {
    try {
      this.loggerService.info("params: " + JSON.stringify(req.params));
      this.loggerService.info("req.query: " + JSON.stringify(req.query));
      const skillWalletId = req.params.skillWalletId;
      const recipient = req.query.recipient;

      if (!skillWalletId || skillWalletId < 0)
        return res
          .status(404)
          .send({ message: "skillWallet is a required field" });
      if (!recipient || recipient < 0)
        return res
          .status(400)
          .send({ message: "recipient is a required field" });
      const chat = await skillWalletService.getChat(skillWalletId, recipient);
      return res.status(200).send({ chat });
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public addMessage = async (req: any, res: Response) => {
    try {
      this.loggerService.info("params: " + JSON.stringify(req.params));
      this.loggerService.info("body: " + JSON.stringify(req.body));
      const skillWalletId = req.params.skillWalletId;
      const recipient = req.body.recipient;
      const text = req.body.text;
      if (!skillWalletId || skillWalletId < 0)
        return res
          .status(404)
          .send({ message: "skillWallet is a required field" });
      if (!recipient || recipient < 0)
        return res
          .status(400)
          .send({ message: "recipient is a required field" });
      if (!text)
        return res.status(400).send({ message: "text is a required field" });

      await skillWalletService.addMessage(
        skillWalletId,
        recipient,
        req.body.text
      );
      res.status(201).send();
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };

  public getNotifications = async (req: any, res: Response) => {
    try {
      const skillWalletId = req.params.skillWalletId;
      if (!skillWalletId || skillWalletId < 0)
        return res
          .status(404)
          .send({ message: "skillWallet is a required field" });

      const notifications = await skillWalletService.getNotifications(
        skillWalletId
      );
      res.status(200).send({ notifications });
    } catch (err) {
      this.loggerService.error(err);
      res
        .status(500)
        .send({ error: "Something went wrong, please try again later." });
    }
  };
}
