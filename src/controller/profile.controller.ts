import { Request, Response } from "express";
import { profileService } from "../service/profile.service";

export class profileExample extends profileService {
  constructor() {
    super();
  }

  public async joinFeudsDataVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.joinFeudsData(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

}

