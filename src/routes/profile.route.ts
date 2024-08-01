import { Router } from 'express';
import controllers from "../controller/index.controller";
import { END_POINT } from "../constant/constant";
import Verifytoken from '../middleware/authmiddleware';

const router = Router();
const { profileExample } = controllers;

router.get(END_POINT.JOINFEUDSDATA, Verifytoken ,profileExample.joinFeudsDataVerify);

export default router;