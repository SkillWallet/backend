import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { SkillWalletContracts } from "../contracts/skillWallet.contracts";
import * as skillWalletService from '../services/skillWallet.service';
import { Actions } from "../models";
import { logger } from "ethers";

@injectable()
export class SkillWalletController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  public get = async (req: any, res: Response) => {
    try {
      const skillWallet = await skillWalletService.getSkillWallet(req.query.tokenId);
      if (skillWallet)
        return res.status(200).send(skillWallet);
      else
        return res.status(400).send({ message: 'Skill Wallet does not exist or it is not activated yet' });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getCommunity = async (req: any, res: Response) => {
    try {
      const skillWallet = await skillWalletService.getCommunityDetails(req.query.address);
      return res.status(200).send(skillWallet);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public hasPendingAuthentication = async (req: any, res: Response) => {
    try {
      const pendingAuth = await skillWalletService.hasPendingActivation(req.query.address);
      return res.status(200).send({ hasPendingAuth: pendingAuth });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public activateSkillWallet = async (req: any, res: Response) => {
    try {
      if (!req.params.skillWalletId) {
        return res.status(400).send('No skillWalletId passed!');
      } if (!req.body.signature) {
        return res.status(400).send('No signature passed');
      }
      const isActive = await SkillWalletContracts.isActive(req.params.skillWalletId);
      if (isActive) {
        console.log('skill wallet active');
        return res.status(400).send({ message: "Skill Wallet already activated" });
      } else {
        console.log('activating SW');
        await SkillWalletContracts.validate(req.body.signature, req.params.skillWalletId, Actions.Activate, [], [], []);
        return res.status(200).send({ message: "Skill Wallet activated successfully." });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public isActive = async (req: any, res: Response) => {
    try {

      const isActive = await SkillWalletContracts.isActive(req.params.skillWalletId);
      console.log(isActive);
      return res.status(200).send({ isActive });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public generateNonce = async (req: any, res: Response) => {
    try {
      const nonce = await skillWalletService.getNonceForQR(+req.query.action, req.params.skillWalletId);
      res.status(200).send(nonce);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getLogins = async (req: any, res: Response) => {
    try {
      const tokenId = await skillWalletService.getTokenIDAfterLogin(req.query.nonce);
      if (tokenId === "-1")
        return res.status(200).send({ message: "The QR code is not yet scanned." });
      else
        return res.status(200).send({ tokenId });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getNonceForValidation = async (req: any, res: Response) => {
    try {
      const nonces = await skillWalletService.findNonce(req.query.action, req.params.skillWalletId);
      return res.status(200).send({ nonces });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public deleteNonce = async (req: any, res: Response) => {
    try {
      await skillWalletService.invalidateNonce(req.query.nonce, req.params.skillWalletId, req.query.action);
      return res.status(200).send();
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public addPubKeyToSkillWallet = async (req: any, res: Response) => {
    try {
      this.loggerService.info('adding public key to skill wallet');
      const pubKey = req.body.pubKey;
      const skillWalletId = req.params.skillWalletId;
      if (!pubKey)
        return res.status(400).send({ message: 'pubKey is a required field' })
      if (!skillWalletId || skillWalletId < 0) {
        res.status(404).send({ message: 'skillWallet is a required field' });
      } else {
        await SkillWalletContracts.addPubKeyToSkillWallet(skillWalletId, pubKey);
        res.status(200).send({ message: 'Successfully added pubKey to SW.' });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public validate = async (req: any, res: Response) => {
    try {
      if (!req.params.skillWalletId) {
        return res.status(400).send('No skillWalletId passed!');
      } if (!req.body.signature) {
        return res.status(400).send('No signature passed');
      } if (!req.body.action) {
        return res.status(400).send('No action passed');
      }
      const isActive = await SkillWalletContracts.isActive(req.params.skillWalletId);
      if (!isActive) {
        return res.status(400).send({ message: "Skill Wallet is not activated yet!" });
      } else {
        await SkillWalletContracts.validate(req.body.signature, req.params.skillWalletId, req.body.action, [], [], []);
        return res.status(200).send({ message: "Skill Wallet validated successfully." });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getChat = async (req: any, res: Response) => {
    try {

      this.loggerService.info('params: ' + JSON.stringify(req.params));
      this.loggerService.info('req.query: ' + JSON.stringify(req.query));
      const skillWalletId = req.params.skillWalletId;
      const recipient = req.query.recipient;

      if (!skillWalletId || skillWalletId < 0)
        return res.status(404).send({ message: 'skillWallet is a required field' });
      if (!recipient || recipient < 0)
        return res.status(400).send({ message: 'recipient is a required field' });
      const chat = await skillWalletService.getChat(skillWalletId, recipient);
      return res.status(200).send({ chat });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public addMessage = async (req: any, res: Response) => {
    try {
      this.loggerService.info('params: ' + JSON.stringify(req.params));
      this.loggerService.info('body: ' + JSON.stringify(req.body));
      const skillWalletId = req.params.skillWalletId;
      const recipient = req.body.recipient;
      const text = req.body.text;
      if (!skillWalletId || skillWalletId < 0)
        return res.status(404).send({ message: 'skillWallet is a required field' });
      if (!recipient || recipient < 0)
        return res.status(400).send({ message: 'recipient is a required field' });
      if (!text)
        return res.status(400).send({ message: 'text is a required field' });

      await skillWalletService.addMessage(skillWalletId, recipient, req.body.text);
      res.status(201).send();
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getNotifications = async (req: any, res: Response) => {
    try {
      const skillWalletId = req.params.skillWalletId;
      if (!skillWalletId || skillWalletId < 0)
        return res.status(404).send({ message: 'skillWallet is a required field' });
      
      const notifications = await skillWalletService.getNotifications(skillWalletId);
      res.status(200).send({ notifications } );
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}
