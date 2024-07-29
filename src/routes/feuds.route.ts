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
router.get(END_POINT.GETVOTECOUNT, Verifytoken, feudsExample.GetvoteCountVerify);
router.post(END_POINT.ACCEPTNOTIFICATION, Verifytoken, feudsExample.acceptNotificationVerify);
router.post(END_POINT.VOTECOUNT, Verifytoken, feudsExample.voteCountVerify);
router.post(END_POINT.JOINFEUD, Verifytoken, feudsExample.joinFeudVerify);
router.post(END_POINT.EDITFEUD, Verifytoken, feudsExample.editFeudVerify);
router.post(END_POINT.CANCELFEUD, Verifytoken, feudsExample.cancelFeudVerify);
router.post(END_POINT.CANCELFEUDRESERVATION, Verifytoken, feudsExample.cancelFeudReservationVerify);
router.get(END_POINT.HOSTFEUD, Verifytoken, feudsExample.FeudsyouHostedVerify);
router.post(END_POINT.RENTBACKSKIN, Verifytoken, feudsExample.rentBackskinVerify);
router.post(END_POINT.ITEMVISIBILITY, Verifytoken, feudsExample.itemVisibilityVerify);

export default router;