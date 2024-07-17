import { Router } from 'express';
import controllers from "../controller/index.controller";
import { END_POINT } from "../constant/constant";
import Verifytoken from '../middleware/authmiddleware';
import { validate } from 'express-validation';
// import feudsValidation from '../validation/createFeuds.validation';

const router = Router();
const { feudsExample } = controllers;

router.post(END_POINT.CREATEFEUD, Verifytoken,feudsExample.feudsVerify);
router.get(END_POINT.MYFEUDS, Verifytoken,feudsExample.getAllFeudsVerify);
router.get(END_POINT.NOTIFICATION, Verifytoken, feudsExample.NotificationVerify);
router.get(END_POINT.VOTECOUNT, Verifytoken, feudsExample.voteCountVerify);

export default router;