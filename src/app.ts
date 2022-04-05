import express from "express";
var bodyParser = require('body-parser')
import helmet from "helmet";
import { injectable } from "inversify";
import {
  SkillWalletRouter,
  CommunityRouter,
} from "./routers";
const cookieParser = require("cookie-parser");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
var cors = require('cors');
require('dotenv').config()

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillWallet API',
      version: '1.0.0',
      description: 'SkillWallet API Docs',
      servers: ['http://localhost:4005']
    },
  },
  apis: ['./src/routers/community.router.ts'],
};

const swagger = swaggerJSDoc(swaggerOptions);

@injectable()
export class App {
  private _app: express.Application;

  constructor(
    private skillWalletRouter: SkillWalletRouter,
    private communityRouter: CommunityRouter
  ) {
    this._app = express();
    this.config();
  }

  public get app(): express.Application {
    return this._app;
  }

  private config(): void {

    // parse application/x-www-form-urlencoded
    this._app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    this._app.use(bodyParser.json());
    // helmet security
    this._app.use(helmet());
    //support application/x-www-form-urlencoded post data
    this._app.use(bodyParser.urlencoded({ extended: false }));

    this._app.use(cookieParser());



    this._app.use(cors());
    //Initialize app routes
    this._initRoutes();

  }

  private _initRoutes() {
    this._app.use("/api/skillWallet", this.skillWalletRouter.router);
    this._app.use("/api/community", this.communityRouter.router);
    this._app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swagger));
  }
}