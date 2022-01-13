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
    this._router.post("/:skillWalletId/activate", this.skillWalletController.activateSkillWallet);
    this._router.get("/:skillWalletId/isActive", this.skillWalletController.isActive);
    this._router.post("/:skillWalletId/pubKey", this.skillWalletController.addPubKeyToSkillWallet);
    this._router.post("/:skillWalletId/validate", this.skillWalletController.validate);

    
    // GET
    this._router.get('/', this.skillWalletController.get);
    this._router.get("/:skillWalletId/interactions", this.skillWalletController.getInteractions);
    this._router.get("/:skillWalletId/events", this.skillWalletController.getEvents);
    this._router.get("/:skillWalletId/tasks", this.skillWalletController.getTasks);
    this._router.get("/:skillWalletId/tasks/:taskId", this.skillWalletController.getTaskById);
    this._router.get("/:skillWalletId/badges", this.skillWalletController.getBadges);
    this._router.get("/:skillWalletId/community/:communityAddress/membershipID", this.skillWalletController.getMembershipID);
    

    // External Login
    this._router.get("/hasPendingAuth", this.skillWalletController.hasPendingAuthentication);
    this._router.get("/login", this.skillWalletController.getLogins);

    // Nonces
    this._router.get("/:skillWalletId/nonces", this.skillWalletController.getNonceForValidation);
    this._router.delete("/:skillWalletId/nonces", this.skillWalletController.deleteNonce);
    this._router.post('/:skillWalletId/nonces', this.skillWalletController.generateNonce);

    // Messages
    this._router.get("/:skillWalletId/message", this.skillWalletController.getChat);
    this._router.post("/:skillWalletId/message", this.skillWalletController.addMessage);

    // Notifications
    this._router.get("/:skillWalletId/notifications", this.skillWalletController.getNotifications);

    // Config
    this._router.get("/config", this.skillWalletController.getConfig);
    this._router.post("/access", this.skillWalletController.authenticatePartnersApp);

  }

  public get router(): Router {
    return this._router;
  }
}
