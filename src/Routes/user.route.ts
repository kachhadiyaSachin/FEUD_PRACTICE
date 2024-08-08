import { Router } from 'express';
import controllers from "../Controller/index.controller";
import { END_POINT } from "../Constant/constant";
import Verifytoken from '../Middleware/authmiddleware';
import { validate } from 'express-validation';
import userValidation from '../Validation/user.validation';

const router = Router();
const { userExample } = controllers;

/* ------------------------- Login and singup route ------------------------------------------- */

router.post(END_POINT.LOGIN, validate(userValidation.login) ,userExample.loginVerify);
router.post(END_POINT.OTP, validate(userValidation.OTPcompare), userExample.OTPVerify);
router.post(END_POINT.RESENDOTP, validate(userValidation.ResendOTP) ,userExample.OTPresend);
router.post(END_POINT.SIGNUP, validate(userValidation.signup) ,userExample.Signup);

/* ------------------------- Email otp comapare route ------------------------------------------- */

router.post(END_POINT.EMAILOTP, validate(userValidation.EMAILOTPcompare), userExample.EMAILOTPVerify);
router.post(END_POINT.EMAILOTPRESEND, validate(userValidation.ResendEMAILOTP), userExample.EMAILOTPresend);

/* ------------------------- All badge upgrage route ------------------------------------------- */

router.post(END_POINT.UPGRADE, Verifytoken, validate(userValidation.UPGRADEbadge) , userExample.upgradeBADGE);
router.post(END_POINT.OTP2FA, Verifytoken, validate(userValidation.OTP2FAverify) , userExample.otp2FAVerify);
router.post(END_POINT.UPGRADEGREEN, Verifytoken, validate(userValidation.greenBADGE) , userExample.upgradeGREENBADGE);
router.post(END_POINT.UPGRADEBLUE, Verifytoken, validate(userValidation.UPGRADEbluebadge) , userExample.upgradeBLUEBADGE);

/* ------------------------- Create profile and purchase username route ------------------------------------------- */

router.post(END_POINT.PROFILE, Verifytoken, validate(userValidation.userProfile) ,userExample.userPROFILE);
router.get(END_POINT.USERNAMECHECK, Verifytoken, validate(userValidation.usernameCheck), userExample.usernameCHECK);
router.get(END_POINT.USERNAMESUGGESTION, Verifytoken, userExample.usernameSUGGESTION);
router.get(END_POINT.USERNAMEPURCHASE, Verifytoken, validate(userValidation.usernameCheck), userExample.usernamePURCHASE);
router.get(END_POINT.USER, Verifytoken, userExample.getuserProfile);

export default router;