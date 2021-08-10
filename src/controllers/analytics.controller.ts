import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import * as analyticsService from '../services/analytics.service';

@injectable()
export class AnalyticsController {
    constructor(
        private loggerService: LoggerService,
    ) { }

    public activeUsers = async (req: any, res: Response) => {
        try {
            const key = req.header('key');
            const startDate = req.query.startDate;
            const perDay = req.query.perDay;
            const perMonth = req.query.perMonth;
            if (!key)
                return res.status(404).send({ message: 'key is a required field' });

            const address = '0x8439a10fec7ccf18ab0ab1d3e13b51577ae79689' // get address by key
            const activeUsers = await analyticsService.getActiveUsers(address, +startDate, perMonth, perDay);
            res.status(200).send(activeUsers);
        } catch (err) {
            this.loggerService.error(err);
            res.status(500).send({ error: "Something went wrong, please try again later." });
        }
    }


    public newUsers = async (req: any, res: Response) => {
        try {
            const key = req.header('key');
            const startDate = req.query.startDate;
            const perDay = req.query.perDay;
            const perMonth = req.query.perMonth;
            if (!key)
                return res.status(404).send({ message: 'key is a required field' });

            const address = '0x8439a10fec7ccf18ab0ab1d3e13b51577ae79689' // get address by key
            const stats = await analyticsService.getNewUsers(address, +startDate, perMonth, perDay);
            res.status(200).send(stats);
        } catch (err) {
            this.loggerService.error(err);
            res.status(500).send({ error: "Something went wrong, please try again later." });
        }
    }
}
