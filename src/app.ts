import express from "express";
var bodyParser = require('body-parser')
import helmet from "helmet";
import { injectable } from "inversify";
import {
  SkillWalletRouter,
  CommunityRouter,
} from "./routers";
const rateLimit = require('express-rate-limit');
const slowDown = require("express-slow-down");

//  apply to all requests
const cookieParser = require("cookie-parser");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
var cors = require('cors');
require('dotenv').config()

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500
});

const swaggerDefinition = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillWallet API',
      version: '1.0.0',
      description: 'SkillWallet API Docs',
      servers: ['http://localhost:4005']
    },
  },
};
const optionsV1 = {
  swaggerDefinition,
  apis: ['./src/routers/public.router.ts']
};
const optionsV2 = {
  swaggerDefinition,
  apis: ['./src/routers/private.router.ts']
};
const swaggerSpecV1 = swaggerJSDoc(optionsV1);
const swaggerSpecV2 = swaggerJSDoc(optionsV2);
const swaggerHtmlV1 = swaggerUI.generateHTML(swaggerSpecV1, optionsV1)
const swaggerHtmlV2 = swaggerUI.generateHTML(swaggerSpecV2, optionsV2)

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
    this._app.use(limiter);
    this._app.use(speedLimiter);

    //Initialize app routes
    this._initRoutes();

  }

  private _initRoutes() {
    this._app.use("/api/skillWallet", this.skillWalletRouter.router);
    this._app.use("/api/community", this.communityRouter.router);
    this._app.use('/api/docs', swaggerUI.serveFiles(swaggerSpecV1, optionsV1));
    this._app.get('/api/docs', (req, res) => { req; res.send(swaggerHtmlV1) });
    this._app.use('/api/docs-private', swaggerUI.serveFiles(swaggerSpecV2, optionsV2));
    this._app.get('/api/docs-private', (req, res) => { req; res.send(swaggerHtmlV2) });
  }
}