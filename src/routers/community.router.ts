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
    this._router.get('/:communityAddress/skillwallet', this.communityController.get);

  }

  public get router(): Router {
    return this._router;
  }
}
