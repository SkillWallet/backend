import { injectable } from "inversify";
import { Router } from "express";
import { CommunityController, SkillWalletController } from "../controllers";
@injectable()
export class PublicRouter {
  private readonly _router: Router;

  constructor(private skillWalletController: SkillWalletController, private communityController: CommunityController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {

  /**
   * @swagger
   * /api/skillWallet:
   *   get:
   *     description: Gets SkillWallet.
   *     parameters:
   *     - in: query
   *       name: tokenId
   *       schema:
   *         type: string
   *       required: true
   *     responses:
   *       200:
   *         description: Success
   *       500:
   *         description: Something went wrong, please try again later.
   */
   this._router.get('/', this.skillWalletController.get);

  /**
   * @swagger
   * /api/skillWallet/{skillWalletId}/isActive:
   *   get:
   *     description: Checks wether SkillWallet is active.
   *     parameters:
   *     - in: path
   *       name: skillWalletId
   *       schema:
   *         type: string
   *       required: true
   *     responses:
   *       200:
   *         description: Success
   *       500:
   *         description: Something went wrong, please try again later.
   */
   this._router.get("/:skillWalletId/isActive", this.skillWalletController.isActive);

  /**
   * @swagger
   * /api/skillWallet/config:
   *   get:
   *     description: Gets SkillWallet config.
   *     responses:
   *       200:
   *         description: Success
   *       500:
   *         description: Something went wrong, please try again later.
   */
   this._router.get("/config", this.skillWalletController.getConfig);

  /**
   * @swagger
   * /api/community/{communityAddress}/skillwallet:
   *   get:
   *     description: Gets SkillWallets per community.
   *     parameters:
   *     - in: path
   *       name: communityAddress
   *       schema:
   *         type: string
   *       required: true
   *     - in: query
   *       name: coreTeamMembers
   *       schema:
   *         type: boolean
   *       required: true
   *     responses:
   *       200:
   *         description: Success
   *       500:
   *         description: Something went wrong, please try again later.
   */
   this._router.get('/:communityAddress/skillwallet', this.communityController.get);

  /**
   * @swagger
   * /api/community/{communityAddress}/coreTeamMembers:
   *   get:
   *     description: Gets core team members' names.
   *     parameters:
   *     - in: path
   *       name: communityAddress
   *       schema:
   *         type: string
   *       required: true
   *     responses:
   *       200:
   *         description: Success
   *       500:
   *         description: Something went wrong, please try again later.
   */
   this._router.get('/:communityAddress/coreTeamMembers', this.communityController.getCoreTeamMemberNames);

  /**
   * @swagger
   * /api/community/key/{key}:
   *   get:
   *     description: Gets community by Partner Agreement key.
   *     parameters:
   *     - in: path
   *       name: key
   *       schema:
   *         type: string
   *       required: true
   *     responses:
   *       200:
   *         description: Success
   *       500:
   *         description: Something went wrong, please try again later.
   */
   this._router.get("/key/:key", this.communityController.getCommunityByPartnerAgreementKey);
  }

  public get router(): Router {
    return this._router;
  }
}
