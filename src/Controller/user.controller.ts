import { Request, Response } from "express";
import { userService } from "../Service/user.service";

export class userExample extends userService {
  constructor() {
    super();
  }

  public async loginVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.login(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async OTPVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.OTPcompare(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async OTPresend(req: Request, res: Response): Promise<void> {
    try {
      await super.ResendOTP(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async Signup(req: Request, res: Response): Promise<void> {
    try {
      await super.signup(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async EMAILOTPVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.EMAILOTPcompare(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async EMAILOTPresend(req: Request, res: Response): Promise<void> {
    try {
      await super.ResendEMAILOTP(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async upgradeBADGE(req: Request, res: Response): Promise<void> {
    try {
      await super.UPGRADEbadge(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }


  public async otp2FAVerify(req: Request, res: Response): Promise<void> {
    try {
      await super.OTP2FAverify(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }


  public async upgradeGREENBADGE(req: Request, res: Response): Promise<void> {
    try {
      await super.UPGRADEgreenbadge(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async upgradeBLUEBADGE(req: Request, res: Response): Promise<void> {
    try {
      await super.UPGRADEbluebadge(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async userPROFILE(req: Request, res: Response): Promise<void> {
    try {
      await super.userProfile(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async usernameCHECK(req: Request, res: Response): Promise<void> {
    try {
      await super.usernameCheck(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async usernameSUGGESTION(req: Request, res: Response): Promise<void> {
    try {
      await super.usernameSuggestion(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async usernamePURCHASE(req: Request, res: Response): Promise<void> {
    try {
      await super.usernamePurchase(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  public async getuserPROFILE(req: Request, res: Response): Promise<void> {
    try {
      await super.getuserProfile(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }
}

