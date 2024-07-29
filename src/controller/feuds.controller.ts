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

  public async getAllFeudsVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.getAllFeud(req, res);
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


  public async GetvoteCountVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.getVotecount(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async acceptNotificationVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.acceptNotification(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async voteCountVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.Votecount(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async joinFeudVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.joinFeud(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async editFeudVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.editFeud(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async cancelFeudVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.cancelFeud(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async cancelFeudReservationVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.cancelFeudReservation(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async FeudsyouHostedVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.FeudsyouHosted(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async rentBackskinVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.rentBackskin(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async itemVisibilityVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.itemVisibility(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }
}

