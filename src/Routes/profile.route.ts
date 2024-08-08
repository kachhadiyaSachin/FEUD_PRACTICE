import { Router } from 'express';
import controllers from "../Controller/index.controller";
import { END_POINT } from "../Constant/constant";
import Verifytoken from '../Middleware/authmiddleware';
import { validate } from 'express-validation';
import userValidation from '../Validation/user.validation';

const router = Router();
const { profileExample } = controllers;

router.get(END_POINT.HOSTFEUD, Verifytoken, profileExample.FeudsyouHostedVerify);
router.get(END_POINT.JOINFEUDSDATA, Verifytoken ,profileExample.joinFeudsDataVerify);
router.post(END_POINT.UPDATETICKER, Verifytoken, validate(userValidation.updateTicker), profileExample.updateTickerVerify);

export default router;