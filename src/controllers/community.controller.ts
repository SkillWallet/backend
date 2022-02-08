import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import * as communityService from '../services/community.service';

@injectable()
export class CommunityController {
  constructor(
    private loggerService: LoggerService,
  ) { }

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
