import { injectable } from "inversify";
import { Router } from "express";
import { SkillWalletController } from "../controllers";
@injectable()
export class SkillWalletRouter {
  private readonly _router: Router;

  constructor(private skillWalletController: SkillWalletController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    // Activation & Validation
  /**
   * @swagger
   * /api/skillWallet/{skillWalletId}/activate:
   *   post:
   *     description: Activates SkillWallet.
   *     parameters:
   *     - in: path
   *       name: skillWalletId
   *       schema:
   *         type: string
   *       required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type:
   *               object
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
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
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type:
   *               object
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
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
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type:
   *               object
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
   */
    this._router.post("/:skillWalletId/validate", this.skillWalletController.validate);
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
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
   */
    this._router.get("/:skillWalletId/isActive", this.skillWalletController.isActive);
    
    // GET
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
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
   */
    this._router.get('/', this.skillWalletController.get);
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
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
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
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
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
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
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
   *     - in: query
   *       name: taskId
   *       schema:
   *         type: string
   *       required: true
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
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
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
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
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
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
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
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
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
   */
    this._router.delete("/:skillWalletId/nonces", this.skillWalletController.deleteNonce);
  /**
   * @swagger
   * /api/skillWallet/nonces:
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
   *         type: string
   *       required: true
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
   */
    this._router.post('/:skillWalletId/nonces', this.skillWalletController.generateNonce);

    // Messages
  /**
   * @swagger
   * /api/skillWallet/{skillWalletId}/message:
   *   get:
   *     description: Gets chat.
   *     parameters:
   *     - in: path
   *       name: skillWalletId
   *       schema:
   *         type: string
   *       required: true
   *     - in: query
   *       name: recipient
   *       schema:
   *         type: string
   *       required: true
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
   */
    this._router.get("/:skillWalletId/message", this.skillWalletController.getChat);
  /**
   * @swagger
   * /api/skillWallet/{skillWalletId}/message:
   *   post:
   *     description: Creates message.
   *     parameters:
   *     - in: path
   *       name: skillWalletId
   *       schema:
   *         type: string
   *       required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type:
   *               object
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
   */
    this._router.post("/:skillWalletId/message", this.skillWalletController.addMessage);

    // Notifications
  /**
   * @swagger
   * /api/skillWallet/{skillWalletId}/notifications:
   *   get:
   *     description: Gets notifications.
   *     parameters:
   *     - in: path
   *       name: skillWalletId
   *       schema:
   *         type: string
   *       required: true
   *       responses:
   *         200:
   *           description: Success
   *         500:
   *           description: Something went wrong, please try again later.
   */
    this._router.get("/:skillWalletId/notifications", this.skillWalletController.getNotifications);

    // Config
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

  }

  public get router(): Router {
    return this._router;
  }
}
