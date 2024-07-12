import { Router } from 'express';
import controllers from "../controller/index.controller";
import { END_POINT } from "../constant/constant";
import Verifytoken from '../middleware/authmiddleware';
import { validate } from 'express-validation';
// import feudsValidation from '../validation/createFeuds.validation';

const router = Router();
const { feudsExample } = controllers;

router.post(END_POINT.CREATEFEUD, Verifytoken,feudsExample.feudsVerify);
router.get(END_POINT.MYFEUDS, Verifytoken,feudsExample.myFeudsVerify);

export default router;