import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import * as analyticsService from '../services/analytics.service';

@injectable()
export class AnalyticsController {
    constructor(
        private loggerService: LoggerService,
    ) { }

    public totalUsers = async (req: any, res: Response) => {
        try {
            const key = req.header('key');
            const startDate = req.query.startDate;
            if (!key)
                return res.status(404).send({ message: 'key is a required field' });

            const address = '0x0b59e3971a867c0dcfba2a62145c11ec94a3a1b5' // get address by key
            const totalUsers = await analyticsService.getUsers(address, startDate);
            res.status(200).send({ totalUsers });
        } catch (err) {
            this.loggerService.error(err);
            res.status(500).send({ error: "Something went wrong, please try again later." });
        }
    }
}
