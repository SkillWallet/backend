import { injectable } from "inversify";
import { Router } from "express";
import { CommunityController } from "../controllers";
@injectable()
export class CommunityRouter {
  private readonly _router: Router;

  constructor(private communityController: CommunityController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    // GET

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
  /**
   * @swagger
   * /api/community/{communityAddress}/key:
   *   get:
   *     description: Gets Partner Agreement by community.
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
    this._router.get("/:communityAddress/key", this.communityController.getPAByCommunity);

    // POST

  /**
   * @swagger
   * /api/community/{communityAddress}/coreTeamMembers:
   *   post:
   *     description: Inserts core team member.
   *     parameters:
   *     - in: path
   *       name: communityAddress
   *       schema:
   *         type: string
   *       required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type:
   *               object
   *     responses:
   *       200:
   *         description: Success
   *       500:
   *         description: Something went wrong, please try again later.
   */
    this._router.post('/:communityAddress/coreTeamMembers', this.communityController.insertCoreTeamMemberName);
  /**
   * @swagger
   * /api/community/key:
   *   post:
   *     description: Posts Partner Agreement.
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type:
   *               object
   *     responses:
   *       200:
   *         description: Success
   *       500:
   *         description: Something went wrong, please try again later.
   */
    this._router.post("/key", this.communityController.postPartnerAgreement)
  }

  public get router(): Router {
    return this._router;
  }
}
