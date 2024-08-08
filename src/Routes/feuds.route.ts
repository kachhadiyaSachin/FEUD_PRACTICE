import { Router } from 'express';
import controllers from "../Controller/index.controller";
import { END_POINT } from "../Constant/constant";
import Verifytoken from '../Middleware/authmiddleware';
import { validate } from 'express-validation';
import feudsValidation from '../Validation/feuds.validation';

const router = Router();
const { feudsExample } = controllers;

/* ------------------------- Create feud and get myfeud route ------------------------------------------- */

router.post(END_POINT.CREATEFEUD, Verifytoken , validate(feudsValidation.createFeud) , feudsExample.feudsVerify);
router.get(END_POINT.MYFEUDS, Verifytoken , validate(feudsValidation.getAllFeud) , feudsExample.getAllFeudsVerify);

/* ------------------- Get all notification and accept moderator notification route ----------------------------- */

router.get(END_POINT.NOTIFICATION, Verifytoken , validate(feudsValidation.getNotification) , feudsExample.NotificationVerify);
router.post(END_POINT.ACCEPTMODERATOR, Verifytoken , validate(feudsValidation.acceptModeratorRequest) , feudsExample.acceptModeratorRequestVerify);

/* ------------------- Join, Edit and cancel feud route ----------------------------- */

router.post(END_POINT.EDITFEUD, Verifytoken , validate(feudsValidation.editFeud) , feudsExample.editFeudVerify);
router.post(END_POINT.CANCELFEUD, Verifytoken , validate(feudsValidation.getVotecount) , feudsExample.cancelFeudVerify);
router.post(END_POINT.CANCELFEUDRESERVATION, Verifytoken , validate(feudsValidation.cancelFeudReservation) , feudsExample.cancelFeudReservationVerify);
router.post(END_POINT.JOINFEUD, Verifytoken , validate(feudsValidation.joinFeud) ,feudsExample.joinFeudVerify);

/* ------------------- Add vote count in option route ----------------------------- */

router.get(END_POINT.GETVOTECOUNT, Verifytoken , validate(feudsValidation.getVotecount) , feudsExample.GetvoteCountVerify);
router.post(END_POINT.VOTECOUNT, Verifytoken , validate(feudsValidation.Votecount) , feudsExample.voteCountVerify);

/* ------------------------- Add like and save feud route ------------------------------------------- */

router.post(END_POINT.FEUDLIKES, Verifytoken , validate(feudsValidation.getVotecount) , feudsExample.feudLikesVerify);
router.get(END_POINT.GETFEUDLIKES, Verifytoken , validate(feudsValidation.getVotecount) , feudsExample.getfeudLikesVerify);

router.post(END_POINT.FEUDSAVES, Verifytoken , validate(feudsValidation.getVotecount) , feudsExample.feudSavesVerify);
router.get(END_POINT.GETFEUDSAVES, Verifytoken , validate(feudsValidation.getVotecount) , feudsExample.getfeudSavesVerify);

/* ----------------------------- Remove moderator route -------------------------------------- */

router.post(END_POINT.KICKOUTMODERATORRULE, Verifytoken , validate(feudsValidation.kickOutModeratorRule) , feudsExample.kickOutModeratorRuleVerify);
router.get(END_POINT.KICKOUTCOUNT, Verifytoken , validate(feudsValidation.getKickoutCount) , feudsExample.getKickoutCountVerify);
router.post(END_POINT.KICKOUTVOTE, Verifytoken , validate(feudsValidation.addKickoutVote) , feudsExample.addKickoutVoteVerify);
router.post(END_POINT.ENDFEUDRESPONSE, Verifytoken , validate(feudsValidation.endFeudResponse) , feudsExample.endFeudResponseVerify);

/* ----------------------------- Start, leave and end feud route -------------------------------------- */

router.post(END_POINT.STARTFEUD, Verifytoken , validate(feudsValidation.getVotecount) , feudsExample.startFeudVerify);
router.post(END_POINT.LEAVEFEUD, Verifytoken , validate(feudsValidation.getVotecount) , feudsExample.leaveFeudVerify);
router.post(END_POINT.ENDFEUD, Verifytoken , validate(feudsValidation.getVotecount) , feudsExample.endFeudVerify);

/* ----------------------------- Profile data and settings route -------------------------------------- */

router.post(END_POINT.RENTBACKSKIN, Verifytoken , validate(feudsValidation.rentBackskin) , feudsExample.rentBackskinVerify);
router.post(END_POINT.ITEMVISIBILITY, Verifytoken, validate(feudsValidation.itemVisibility) , feudsExample.itemVisibilityVerify);


export default router;