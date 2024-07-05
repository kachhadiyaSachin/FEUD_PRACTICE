import { body } from "express-validator";
import Joi from "joi";

export default {
    login: {
        body: Joi.object({
            countrycode: Joi.string().required(),
            phonenumber: Joi.string().required()
        })
    },
    OTPcompare: {
        body: Joi.object({
            phonenumber: Joi.string().required(),
            phoneOTP: Joi.string().required()
        })
    }
}