import { injectable } from "inversify";
import { Router } from "express";
import { AnalyticsController } from "../controllers";
@injectable()
export class AnalyticsRouter {
  private readonly _router: Router;

  constructor(private analyticsController: AnalyticsController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    // Analytics
    this._router.get("/activeUsers", this.analyticsController.activeUsers);
    this._router.get("/newUsers", this.analyticsController.newUsers);
  }

  public get router(): Router {
    return this._router;
  }
}
