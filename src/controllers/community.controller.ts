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
      const coreTeamMembers : boolean = req.query.coreTeamMembers == 'true';  
      const skillWallets = await communityService.getSkillWalletsPerCommunity(req.params.communityAddress, coreTeamMembers);
      return res.status(200).send(skillWallets);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}
