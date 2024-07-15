import { Request, Response } from "express";
import { feudService } from "../service/feud.service";

export class feudsExample extends feudService {
  constructor() {
    super();
  }

  public async feudsVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.createFeud(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async myFeudsVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.myFeud(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async NotificationVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.getNotification(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }
}

