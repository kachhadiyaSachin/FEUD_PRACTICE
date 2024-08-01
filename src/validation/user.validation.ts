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
    },
    signup: {
        body: Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().required(),
            phonenumber: Joi.string().required(),
            dob: Joi.string().required()
        })
    },
    UPGRADEbadge: {
        body: Joi.object({
            isSkip: Joi.boolean().optional(),
            is2FA: Joi.boolean().required(),
            isQA: Joi.boolean().required(),
            securityQA: Joi.array().required()
        })
    },
    greenBADGE: {
        body: Joi.object({
            greenBADGE: {
                verifiedSM: Joi.string().required(),
                featureinVIDEO: Joi.string().required()
            }
        })
    },
    UPGRADEbluebadge: {
        body: Joi.object({
            blueBADGE: {
                feudMedialink: Joi.array().required(),
                verifiedSMLink: Joi.string().required()
            }
        })
    },
    userProfile: {
        body: Joi.object({
            username: Joi.string().required(),
            profilepic: Joi.string().allow("").optional(),
            gender: Joi.string().required(),
            country: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            bio: Joi.string().required(),
        })
    },
    updateTicker: {
        body: Joi.object({
            ticker: Joi.string().required().min(0).max(120),
            color: Joi.string().required(),
            speed: Joi.number().required().min(0).max(60),
        })
    }
}