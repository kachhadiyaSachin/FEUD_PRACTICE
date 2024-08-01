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
router.post(END_POINT.ACCEPTMODERATOR, Verifytoken, feudsExample.acceptModeratorRequestVerify);

router.get(END_POINT.GETVOTECOUNT, Verifytoken, feudsExample.GetvoteCountVerify);
router.post(END_POINT.VOTECOUNT, Verifytoken, feudsExample.voteCountVerify);

router.post(END_POINT.JOINFEUD, Verifytoken, feudsExample.joinFeudVerify);
router.post(END_POINT.EDITFEUD, Verifytoken, feudsExample.editFeudVerify);
router.post(END_POINT.CANCELFEUD, Verifytoken, feudsExample.cancelFeudVerify);
router.post(END_POINT.CANCELFEUDRESERVATION, Verifytoken, feudsExample.cancelFeudReservationVerify);
router.get(END_POINT.HOSTFEUD, Verifytoken, feudsExample.FeudsyouHostedVerify);

router.post(END_POINT.RENTBACKSKIN, Verifytoken, feudsExample.rentBackskinVerify);
router.post(END_POINT.ITEMVISIBILITY, Verifytoken, feudsExample.itemVisibilityVerify);

router.post(END_POINT.KICKOUTMODERATORRULE, Verifytoken, feudsExample.kickOutModeratorRuleVerify);
router.get(END_POINT.KICKOUTCOUNT, Verifytoken, feudsExample.getKickoutCountVerify);
router.post(END_POINT.KICKOUTVOTE, Verifytoken, feudsExample.addKickoutVoteVerify);
router.post(END_POINT.ENDFEUDRESPONSE, Verifytoken, feudsExample.endFeudResponseVerify);

export default router;