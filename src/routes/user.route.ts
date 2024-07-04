import { Router } from 'express';
import controllers from "../controller/index.controller";
import { END_POINT } from "../constant/constant";
import Verifytoken from '../middleware/authmiddleware';
import { validate } from 'express-validation';
import userValidation from '../validation/user.validation';

const router = Router();
const { userExample } = controllers;

router.post(END_POINT.LOGIN, validate(userValidation.login) ,userExample.loginVerify);
router.post(END_POINT.OTP, userExample.OTPVerify);
router.post(END_POINT.RESENDOTP, userExample.OTPresend);
router.post(END_POINT.SIGNUP, userExample.Signup);
router.post(END_POINT.EMAILOTP, userExample.EMAILOTPVerify);
router.post(END_POINT.EMAILOTPRESEND, userExample.EMAILOTPresend);
router.post(END_POINT.UPGRADE, Verifytoken, userExample.upgradeBADGE);
router.post(END_POINT.OTP2FA, Verifytoken, userExample.otp2FAVerify);
router.post(END_POINT.UPGRADEGREEN, Verifytoken, userExample.upgradeGREENBADGE);
router.post(END_POINT.UPGRADEBLUE, Verifytoken, userExample.upgradeBLUEBADGE);
router.post(END_POINT.PROFILE, Verifytoken, userExample.userPROFILE);
router.get(END_POINT.USERNAMECHECK, Verifytoken, userExample.usernameCHECK);
router.get(END_POINT.USERNAMESUGGESTION, Verifytoken, userExample.usernameSUGGESTION);
router.get(END_POINT.USERNAMEPURCHASE, Verifytoken, userExample.usernamePURCHASE);
router.get(END_POINT.USER, Verifytoken, userExample.getuserProfile);



export default router;