import { Request, Response } from "express";
import { profileService } from "../Service/profile.service";

export class profileExample extends profileService {
  constructor() {
    super();
  }

  public async FeudsyouHostedVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.FeudsyouHosted(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }
  
  public async joinFeudsDataVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.joinFeudsData(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async updateTickerVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.updateTicker(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

}

