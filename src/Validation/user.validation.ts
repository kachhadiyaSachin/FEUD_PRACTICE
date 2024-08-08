import Joi from "joi";

export default {
    login: {
        body: Joi.object({
            countrycode: Joi.string().required().messages({
                "any.required":"Country code is required",
                "string.empty":"Country code cannot be empty",
                "string.base":"Country code must be string"
            }),
            phonenumber: Joi.string().required().messages({
                "any.required":"Mobile Number is required",
                "string.empty":"Mobile Number cannot be empty",
                "string.base":"Mobile Number must be string"
            })
        })
    },
    OTPcompare: {
        body: Joi.object({
            phonenumber: Joi.string().required().messages({
                "any.required":"Mobile Number is required",
                "string.empty":"Mobile Number cannot be empty",
                "string.base":"Mobile Number must be string"
            }),
            phoneOTP: Joi.string().required().messages({
                "any.required":"Otp is required",
                "string.empty":"Otp cannot be empty",
                "string.base":"Otp must be string"
            })
        })
    },
    ResendOTP: {
        body: Joi.object({
            phonenumber: Joi.string().required().messages({
                "any.required":"Mobile Number is required",
                "string.empty":"Mobile Number cannot be empty",
                "string.base":"Mobile Number must be string"
            })
        })
    },
    signup: {
        body: Joi.object({
            first_name: Joi.string().required().messages({
                "any.required":"First name is required",
                "string.empty":"First name cannot be empty",
                "string.base":"First name must be string"
            }),
            last_name: Joi.string().required().messages({
                "any.required":"Last name is required",
                "string.empty":"Last name cannot be empty",
                "string.base":"Last name must be string"
            }),
            email: Joi.string().email().required().messages({
                "any.required":"Email is required",
                "string.empty":"Email cannot be empty",
                "string.email":"Email must be a valid email address",
                "string.base":"Email must be string"
            }),
            phonenumber: Joi.string().required().messages({
                "any.required":"Mobile Number is required",
                "string.empty":"Mobile Number cannot be empty",
                "string.base":"Mobile Number must be string"
            }),
            dob: Joi.string().required().messages({
                "any.required":"dob is required",
                "string.empty":"dob cannot be empty",
                "string.base":"dob must be string"
            }),
        })
    },
    EMAILOTPcompare: {
        body: Joi.object({
            email: Joi.string().email().required().messages({
                "any.required":"Email is required",
                "string.empty":"Email cannot be empty",
                "string.email":"Email must be a valid email address",
                "string.base":"Email must be string"
            }),
            emailOTP: Joi.string().required().messages({
                "any.required":"Otp is required",
                "string.empty":"Otp cannot be empty",
                "string.base":"Otp must be string"
            })
        })
    },
    ResendEMAILOTP: {
        body: Joi.object({
            email: Joi.string().email().required().messages({
                'any.required':"Email is required",
                'string.empty':"Email cannot be empty",
                'string.email':"Email must be a valid email address",
                'string.base':"Email must be string"
            })
        })
    },
    UPGRADEbadge: {
        body: Joi.object({
            isSkip: Joi.boolean().allow("").optional(),
            is2FA: Joi.boolean().required().messages({
                'any.required': 'The "is2FA" field is required.',
                'boolean.base': 'The "is2FA" field must be a boolean.'
            }),
            isQA: Joi.boolean().required().messages({
                'any.required': 'The "isQA" field is required.',
                'boolean.base': 'The "isQA" field must be a boolean.'
            }),
            securityQA: Joi.array().items(
                Joi.object({
                    question: Joi.string().required().messages({
                        'any.required': 'The question field is required.',
                        'string.base': 'The question field must be a string.',
                        "string.empty":'The question field cannot be empty',
                    }),
                    answer: Joi.string().required().messages({
                        'any.required': 'The "answer" field is required.',
                        'string.base': 'The "answer" field must be a string.',
                        "string.empty": 'The "answer" field cannot be empty'
                    })
                })
            ).required().messages({
                'any.required': 'The "securityQA" field is required.',
                'array.base': 'The "securityQA" field must be an array.'
            })
        })
    },
    OTP2FAverify: {
        body: Joi.object({
            otp2FA: Joi.string().required().messages({
                "any.required":"Otp is required",
                "string.empty":"Otp cannot be empty",
                "string.base":"Otp must be string"
            })
        })
    },
    greenBADGE: {
        body: Joi.object({
            greenBADGE: Joi.object({
                verifiedSM: Joi.string().required().messages({
                    'any.required': 'The "verifiedSM" field is required.',
                    'string.base': 'The "verifiedSM" field must be a string.',
                    'string.empty':'The "verifiedSM" field cannot be empty'
                }),
                featureinVIDEO: Joi.string().required().messages({
                    'any.required': 'The "featureinVIDEO" field is required.',
                    'string.base': 'The "featureinVIDEO" field must be a string.',
                    'string.empty':'The "featureinVIDEO" field cannot be empty'
                })
            })
        })
    },
    UPGRADEbluebadge: {
        body: Joi.object({
            blueBADGE: Joi.object({
                feudMedialink: Joi.array().items(Joi.string()).required().messages({
                    'any.required': 'The "feudMedialink" field is required.',
                    'string.base': 'Each item in the "feudMedialink" array must be a string.',
                    'string.empty': 'The "featureinVIDEO" field cannot be empty'
                }),
                verifiedSMLink: Joi.string().required().messages({
                    'any.required': 'The "verifiedSMLink" field is required.',
                    'string.base': 'The "verifiedSMLink" field must be a string.',
                    'string.empty': 'The "verifiedSMLink" field cannot be empty'
                })
            })
        })
    },
    userProfile: {
        body: Joi.object({
            username: Joi.string().required().messages({
                'any.required': 'The "username" field is required.',
                'string.base': 'The "username" field must be a string.',
                'string.empty': 'The "username" field cannot be empty'
            }),
            profilepic: Joi.string().allow("").optional().messages({
                'string.base': 'Profile pic field must be a string.'
            }),
            gender: Joi.string().required().messages({
                'any.required': 'The "gender" field is required.',
                'string.base': 'The "gender" field must be a string.',
                'string.empty': 'The "gender" field cannot be empty'
            }),
            country: Joi.string().required().messages({
                'any.required': 'The "country" field is required.',
                'string.base': 'The "country" field must be a string.',
                'string.empty': 'The "country" field cannot be empty'
            }),
            state: Joi.string().required().messages({
                'any.required': 'The "state" field is required.',
                'string.base': 'The "state" field must be a string.',
                'string.empty': 'The "state" field cannot be empty'
            }),
            city: Joi.string().required().messages({
                'any.required': 'The "city" field is required.',
                'string.base': 'The "city" field must be a string.',
                'string.empty': 'The "city" field cannot be empty'
            }),
            bio: Joi.string().optional().allow('').messages({
                'string.base': 'The "username" field must be a string.'
            }),
        })
    },
    usernameCheck: {
        body: Joi.object({
            username: Joi.string().required().messages({
                'any.required': 'The "username" field is required.',
                'string.empty': 'The "username" field cannot be empty',
                'string.base': 'The "username" field must be a string.'
            }),
        })
    },
    updateTicker: {
        body: Joi.object({
            ticker: Joi.string().min(0).max(120).required().messages({
                'any.required': 'The "ticker" field is required.',
                'string.base': 'The "ticker" field must be a string.',
                'string.empty': 'The "ticker" field cannot be empty',
                'string.max': 'The "ticker" field must be at most 120 characters long.'
            }),
            color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required().messages({
                'any.required': 'The "color" field is required.',
                'string.base': 'The "color" field must be a string.',
                'string.empty': 'The "color" field cannot be empty',
                'string.pattern.base': 'The "color" field must be a valid hex color code (e.g., #9A30EA).'
            }),
            speed: Joi.number().min(0).max(60).required().messages({
                'any.required': 'The "speed" field is required.',
                'number.base': 'The "speed" field must be a number.',
                'number.empty': 'The "speed" field cannot be empty',
                'number.min': 'The "speed" field must be at least 0.',
                'number.max': 'The "speed" field must be at most 60.'
            })
        })
    }
}