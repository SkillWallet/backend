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
    // Activation & Validation
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/activate:
     *   post:
     *     name: SkillWallet
     *     description: Activates SkillWallet.
     *     parameters:
     *     - in: path
     *       name: skillWalletId
     *       schema:
     *         type: string
     *       required: true
     *     - in: body
     *       name: payload
     *       schema:
     *         type: object
     *         required:
     *         - signature
     *         properties:
     *           signature:
     *             type: string
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         description: Something went wrong, please try again later.
     */
    this._router.post("/:skillWalletId/activate", this.skillWalletController.activateSkillWallet);
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/pubKey:
     *   post:
     *     description: Adds public key to SkillWallet.
     *     parameters:
     *     - in: path
     *       name: skillWalletId
     *       schema:
     *         type: string
     *       required: true
     *     - in: body
     *       name: payload
     *       schema:
     *         type: object
     *         required:
     *         - pubKey
     *         properties:
     *           pubKey:
     *             type: string
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         description: Something went wrong, please try again later.
     */
    this._router.post("/:skillWalletId/pubKey", this.skillWalletController.addPubKeyToSkillWallet);
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/validate:
     *   post:
     *     description: Requests SkillWallet validation.
     *     parameters:
     *     - in: path
     *       name: skillWalletId
     *       schema:
     *         type: string
     *       required: true
     *     - in: body
     *       name: payload
     *       schema:
     *         type: object
     *         required:
     *         - signature
     *         - action
     *         properties:
     *           signature:
     *             type: string
     *           action:
     *             type: string
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         description: Something went wrong, please try again later.
     */
    this._router.post("/:skillWalletId/validate", this.skillWalletController.validate);

    // GET

    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/interactions:
     *   get:
     *     description: Gets interaction NFTs.
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
    this._router.get("/:skillWalletId/interactions", this.skillWalletController.getInteractions);
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/events:
     *   get:
     *     description: Gets SkillWallet events.
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
    this._router.get("/:skillWalletId/events", this.skillWalletController.getEvents);
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/tasks:
     *   get:
     *     description: Gets SkillWallet tasks.
     *     parameters:
     *     - in: query
     *       name: activitiesAddress
     *       schema:
     *         type: string
     *       required: true
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         description: Something went wrong, please try again later.
     */
    this._router.get("/:skillWalletId/tasks", this.skillWalletController.getTasks);
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/tasks/{taskId}:
     *   get:
     *     description: Gets task by id.
     *     parameters:
     *     - in: path
     *       name: skillWalletId
     *       schema:
     *         type: string
     *       required: true
     *     - in: path
     *       name: taskId
     *       schema:
     *         type: string
     *       required: true
     *     - in: query
     *       name: activitiesAddress
     *       schema:
     *         type: string
     *       required: true
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         description: Something went wrong, please try again later.
     */
    this._router.get("/:skillWalletId/tasks/:taskId", this.skillWalletController.getTaskById);
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/badges:
     *   get:
     *     description: Gets SkillWallet badges.
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
    this._router.get("/:skillWalletId/badges", this.skillWalletController.getBadges);
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/community/{communityAddress}/membershipID:
     *   get:
     *     description: Gets membership details.
     *     parameters:
     *     - in: path
     *       name: skillWalletId
     *       schema:
     *         type: string
     *       required: true
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
    this._router.get("/:skillWalletId/community/:communityAddress/membershipID", this.skillWalletController.getMembershipID);

    // Nonces
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/nonces:
     *   get:
     *     description: Gets nonces for validation.
     *     parameters:
     *     - in: path
     *       name: skillWalletId
     *       schema:
     *         type: string
     *       required: true
     *     - in: query
     *       name: action
     *       schema:
     *         type: string
     *       required: true
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         description: Something went wrong, please try again later.
     */
    this._router.get("/:skillWalletId/nonces", this.skillWalletController.getNonceForValidation);
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/nonces:
     *   delete:
     *     description: Invalidates nonce.
     *     parameters:
     *     - in: path
     *       name: skillWalletId
     *       schema:
     *         type: string
     *       required: true
     *     - in: query
     *       name: nonce
     *       schema:
     *         type: string
     *       required: true
     *     - in: query
     *       name: action
     *       schema:
     *         type: string
     *       required: true
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         description: Something went wrong, please try again later.
     */
    this._router.delete("/:skillWalletId/nonces", this.skillWalletController.deleteNonce);
    /**
     * @swagger
     * /api/skillWallet/{skillWalletId}/nonces:
     *   post:
     *     description: Generates nonce.
     *     parameters:
     *     - in: path
     *       name: skillWalletId
     *       schema:
     *         type: string
     *       required: true
     *     - in: query
     *       name: action
     *       schema:
     *         type: number
     *       required: true
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         description: Something went wrong, please try again later.
     */
    this._router.post('/:skillWalletId/nonces', this.skillWalletController.generateNonce);

    // Config

    /**
     * @swagger
     * /api/skillWallet/access:
     *   post:
     *     description: Authenticates Partner App.
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         description: Something went wrong, please try again later.
     */
    this._router.post("/access", this.skillWalletController.authenticatePartnersApp);

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
     *     - in: body
     *       name: payload
     *       schema:
     *         type: object
     *         required:
     *         - memberAddress
     *         - memberName
     *         properties:
     *           memberAddress:
     *             type: string
     *           memberName:
     *             type: string
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
     *     parameters:
     *     - in: body
     *       name: payload
     *       schema:
     *         type: object
     *         required:
     *         - partnersAgreementAddress
     *         - communityAddress
     *         properties:
     *           partnersAgreementAddress:
     *             type: string
     *           communityAddress:
     *             type: string
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
