import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import * as communityService from '../services/community.service';
import * as services from '../services';

@injectable()
export class CommunityController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  public getPAByCommunity = async  (req: any, res: Response) => {
    try {
      const key = await services.getPAByCommunity(req.params.communityAddress);
      if(key){
        res.status(200).send(key);
      } else 
        res.status(400).send({ error: 'Invalid key!'});
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public postPartnerAgreement = async  (req: any, res: Response) => {
    try {
      const key = await services.createPartnerAgreementKey(req.body.partnersAgreementAddress, req.body.communityAddress);
      res.status(201).send({ key });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getCommunityByPartnerAgreementKey = async  (req: any, res: Response) => {
    try {
      const key = await services.getKey(req.params.key);
      if(key){
        const com = await services.getCommunity(key.communityAddress);
        com.partnersAgreementAddress = key.partnersAgreementAddress;
        res.status(200).send(com);
      } else 
        res.status(400).send({ error: 'Invalid key!'});
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public get = async (req: any, res: Response) => {
    try {
      const coreTeamMembers: boolean = req.query.coreTeamMembers == 'true';
      const skillWallets = await communityService.getSkillWalletsPerCommunity(req.params.communityAddress, coreTeamMembers);
      return res.status(200).send(skillWallets);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getCoreTeamMemberNames = async (req: any, res: Response) => {
    try {
      const coreTeamMembers = await communityService.getCoreTeamMemberNames(req.params.communityAddress);
      return res.status(200).send({ coreTeamMembers });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public insertCoreTeamMemberName = async (req: any, res: Response) => {
    try {
      if (!req.params.communityAddress || !req.body.memberAddress || !req.body.memberName)
        return res.status(400).send({ message: "Missing required field" });

      await communityService.addCoreTeamMemberName(req.params.communityAddress, req.body.memberAddress, req.body.memberName);
      return res.status(201).send({ message: "Core team member name added." });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}
