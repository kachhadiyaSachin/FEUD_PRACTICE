import Joi from "joi";

export default {
    createFeud: {
        body: Joi.object({
            title: Joi.string().required().messages({
                'any.required': 'The "title" field is required.',
                'string.base': 'The "title" field must be a string.',
                'string.empty': 'The "title" field cannot be empty.'
            }),
            pollquestion: Joi.string().required().messages({
                'any.required': 'The "pollquestion" field is required.',
                'string.base': 'The "pollquestion" field must be a string.',
                'string.empty': 'The "pollquestion" field cannot be empty.'
            }),
            options: Joi.array().items(
                Joi.object({
                    option: Joi.string().required().messages({
                        'any.required': 'Each "option" field is required.',
                        'string.base': 'Each "option" field must be a string.',
                        'string.empty': 'Each "option" field cannot be empty.'
                    })
                })
            ).required().messages({
                'any.required': 'The "options" field is required.',
                'array.base': 'The "options" field must be an array.',
                'string.empty': 'The "option" field cannot be empty.'
            }),
            rules: Joi.array().items(
                Joi.object({
                    ruleCheck: Joi.string().valid('true', 'false').required().messages({
                        'any.required': 'Each "ruleCheck" field is required.',
                        'string.base': 'Each "ruleCheck" field must be a string.',
                        'string.empty': 'Each "ruleCheck" field cannot be empty.',
                        'any.only': 'Each "ruleCheck" field must be "true" or "false".'
                    }),
                    rule: Joi.string().required().messages({
                        'any.required': 'Each "rule" field is required.',
                        'string.base': 'Each "rule" field must be a string.',
                        'string.empty': 'Each "rule" field cannot be empty.'
                    })
                })
            ).required().messages({
                'any.required': 'The "rules" field is required.',
                'array.base': 'The "rules" field must be an array.',
                'array.empty': 'The "rules" field cannot be empty.'
            }),
            feudNow: Joi.boolean().optional().allow("").messages({
                'boolean.base': 'The "feudNow" field must be a boolean.'
            }),
            feudLater: Joi.boolean().optional().allow("").messages({
                'boolean.base': 'The "feudLater" field must be a boolean.'
            }),
            FeudDate: Joi.string().required().messages({
                'any.required': 'The "FeudDate" field is required.',
                'string.base': 'The "FeudDate" field must be a valid date.',
                'string.empty': 'The "FeudDate" field cannot be empty.'
            }),
            FeudTime: Joi.string().required().messages({
                'any.required': 'The "FeudTime" field is required.',
                'string.base': 'The "FeudTime" field must be a string.',
                'string.empty': 'The "FeudTime" field cannot be empty.'
            }),
            JoinFeud: Joi.array().items(
                Joi.number().required().messages({
                    'any.required': 'Each item in field is required.',
                    'number.empty': 'Each item in the "JoinFeud" array cannot be empty.',
                    'number.base': 'Each item in the "JoinFeud" array must be a number.'
                })
            ).required().messages({
                'any.required': 'The "JoinFeud" field is required.',
                'array.base': 'The "JoinFeud" field must be an array.',
                'array.empty': 'The "JoinFeud" field cannot be empty.'
            }),
            individual: Joi.array().items(
                Joi.string().optional().allow("").messages({
                    'string.base': 'Each item in the "individual" array must be a string.'
                })
            ).optional().allow("").messages({
                'array.base': 'The "individual" field must be an array.'
            }),
            externalEmail: Joi.array().items(
                Joi.string().email().optional().allow("").messages({
                    'string.email': 'Each item in the "externalEmail" array must be a valid email address.'
                })
            ).optional().allow("").messages({
                'array.base': 'The "externalEmail" field must be an array.'
            }),
            phoneNumber: Joi.array().items(
                Joi.string().pattern(/^\+\d{1,15}$/).optional().allow("").messages({
                    'string.pattern.base': 'Each item in the "phoneNumber" array must be a valid phone number with country code (e.g., +918866902600).'
                })
            ).optional().allow("").messages({
                'array.base': 'The "phoneNumber" field must be an array.',
            }),
            inviteModerator: Joi.array().items(
                Joi.string().required().messages({
                    'any.required': 'Each item in the "inviteModerator" array is required.',
                    'string.base': 'Each item in the "inviteModerator" array must be a string.',
                    'string.empty': 'Each item in the "inviteModerator" array cannot be empty.'
                })
            ).required().messages({
                'any.required': 'The "inviteModerator" field is required.',
                'array.base': 'The "inviteModerator" field must be an array.',
                'array.empty': 'The "inviteModerator" field cannot be empty.'
            })
        })
    },
    getAllFeud: {
        body: Joi.object({
            type: Joi.number().integer().messages({
                'number.base': 'The "type" field must be a number.'
            }),
            host: Joi.boolean().messages({
                'boolean.base': 'The "host" field must be a boolean.'
            }),
            date: Joi.date().messages({
                'date.base': 'The "date" field must be a valid date.'
            }),
            page: Joi.number().integer().min(1).messages({
                'number.base': 'The "page" field must be a number.',
                'number.min': 'The "page" field must be at least 1.'
            }),
            limit: Joi.number().integer().min(1).messages({
                'number.base': 'The "limit" field must be a number.',
                'number.min': 'The "limit" field must be at least 1.'
            })
        })
    },
    getNotification: {
        body: Joi.object({
            page: Joi.number().integer().min(1).messages({
                'number.base': 'The "page" field must be a number.',
                'number.min': 'The "page" field must be at least 1.'
            }),
            limit: Joi.number().integer().min(1).messages({
                'number.base': 'The "limit" field must be a number.',
                'number.min': 'The "limit" field must be at least 1.'
            })
        })
    },
    acceptModeratorRequest: {
        body: Joi.object({
            notificationId: Joi.string().required().messages({
                'any.required': 'The "notificationId" field is required.',
                'string.base': 'The "notificationId" field must be a string.',
                'string.empty': 'The "notificationId" field cannot be empty.'
            }),
            isAccept: Joi.boolean().optional().allow("").messages({
                'boolean.base': 'The "isAccept" field must be a boolean.'
            }),
            isDecline: Joi.boolean().optional().allow("").messages({
                'boolean.base': 'The "isDecline" field must be a boolean.'
            })
        })
    },
    editFeud: {
        body: Joi.object({
            feudId: Joi.string().required().messages({
                'any.required': 'The "FeudId" field is required.',
                'string.base': 'The "FeudId" field must be a string.',
                'string.empty': 'The "FeudId" field cannot be empty.'
            }),
            title: Joi.string().required().messages({
                'any.required': 'The "title" field is required.',
                'string.base': 'The "title" field must be a string.',
                'string.empty': 'The "title" field cannot be empty.'
            }),
            pollquestion: Joi.string().required().messages({
                'any.required': 'The "pollquestion" field is required.',
                'string.base': 'The "pollquestion" field must be a string.',
                'string.empty': 'The "pollquestion" field cannot be empty.'
            }),
            options: Joi.array().items(
                Joi.object({
                    option: Joi.string().required().messages({
                        'any.required': 'Each "option" field is required.',
                        'string.base': 'Each "option" field must be a string.',
                        'string.empty': 'Each "option" field cannot be empty.'
                    })
                })
            ).required().messages({
                'any.required': 'The "options" field is required.',
                'array.base': 'The "options" field must be an array.',
                'string.empty': 'The "option" field cannot be empty.'
            }),
            rules: Joi.array().items(
                Joi.object({
                    ruleCheck: Joi.string().valid('true', 'false').required().messages({
                        'any.required': 'Each "ruleCheck" field is required.',
                        'string.base': 'Each "ruleCheck" field must be a string.',
                        'string.empty': 'Each "ruleCheck" field cannot be empty.',
                        'any.only': 'Each "ruleCheck" field must be "true" or "false".'
                    }),
                    rule: Joi.string().required().messages({
                        'any.required': 'Each "rule" field is required.',
                        'string.base': 'Each "rule" field must be a string.',
                        'string.empty': 'Each "rule" field cannot be empty.'
                    })
                })
            ).required().messages({
                'any.required': 'The "rules" field is required.',
                'array.base': 'The "rules" field must be an array.',
                'array.empty': 'The "rules" field cannot be empty.'
            }),
            feudNow: Joi.boolean().optional().allow("").messages({
                'boolean.base': 'The "feudNow" field must be a boolean.'
            }),
            feudLater: Joi.boolean().optional().allow("").messages({
                'boolean.base': 'The "feudLater" field must be a boolean.'
            }),
            FeudDate: Joi.string().required().messages({
                'any.required': 'The "FeudDate" field is required.',
                'string.base': 'The "FeudDate" field must be a valid date.',
                'string.empty': 'The "FeudDate" field cannot be empty.'
            }),
            FeudTime: Joi.string().required().messages({
                'any.required': 'The "FeudTime" field is required.',
                'string.base': 'The "FeudTime" field must be a string.',
                'string.empty': 'The "FeudTime" field cannot be empty.'
            }),
            JoinFeud: Joi.array().items(
                Joi.number().required().messages({
                    'any.required': 'Each item in field is required.',
                    'number.empty': 'Each item in the "JoinFeud" array cannot be empty.',
                    'number.base': 'Each item in the "JoinFeud" array must be a number.'
                })
            ).required().messages({
                'any.required': 'The "JoinFeud" field is required.',
                'array.base': 'The "JoinFeud" field must be an array.',
                'array.empty': 'The "JoinFeud" field cannot be empty.'
            }),
            individual: Joi.array().items(
                Joi.string().optional().allow("").messages({
                    'string.base': 'Each item in the "individual" array must be a string.'
                })
            ).optional().allow("").messages({
                'array.base': 'The "individual" field must be an array.'
            }),
            externalEmail: Joi.array().items(
                Joi.string().email().optional().allow("").messages({
                    'string.email': 'Each item in the "externalEmail" array must be a valid email address.'
                })
            ).optional().allow("").messages({
                'array.base': 'The "externalEmail" field must be an array.'
            }),
            phoneNumber: Joi.array().items(
                Joi.string().pattern(/^\+\d{1,15}$/).optional().allow("").messages({
                    'string.pattern.base': 'Each item in the "phoneNumber" array must be a valid phone number with country code (e.g., +918866902600).'
                })
            ).optional().allow("").messages({
                'array.base': 'The "phoneNumber" field must be an array.',
            }),
            inviteModerator: Joi.array().items(
                Joi.string().required().messages({
                    'any.required': 'Each item in the "inviteModerator" array is required.',
                    'string.base': 'Each item in the "inviteModerator" array must be a string.',
                    'string.empty': 'Each item in the "inviteModerator" array cannot be empty.'
                })
            ).required().messages({
                'any.required': 'The "inviteModerator" field is required.',
                'array.base': 'The "inviteModerator" field must be an array.',
                'array.empty': 'The "inviteModerator" field cannot be empty.'
            })
        })
    },
    cancelFeudReservation: {
        body: Joi.object({
            feudId: Joi.string().required().messages({
                'any.required': 'The "FeudId" field is required.',
                'string.base': 'The "FeudId" field must be a string.',
                'string.empty': 'The "FeudId" field cannot be empty.'
            }),
            isCancel: Joi.boolean().required().valid('true', 'false').messages({
                'any.required': 'The "isCancel" field is required.',
                'boolean.base': 'The "spector" field must be a boolean.',
                'boolean.empty': 'The "spector" field cannot be empty.',
                'any.only': 'The "spector" field must be "true" or "false".'
            })
        })
    },
    joinFeud: {
        body: Joi.object({
            feudId: Joi.string().required().messages({
                'any.required': 'The "FeudId" field is required.',
                'string.base': 'The "FeudId" field must be a string.',
                'string.empty': 'The "FeudId" field cannot be empty.'
            }),
            participant: Joi.boolean().optional().valid('true', 'false').allow("").messages({
                'boolean.base': 'The "participant" field must be a boolean.',
                'any.only': 'The "participant" field must be "true" or "false".'
            }),
            spector: Joi.boolean().optional().valid('true', 'false').allow("").messages({
                'boolean.base': 'The "spector" field must be a boolean.',
                'any.only': 'The "spector" field must be "true" or "false".'
            }),
            isNotify: Joi.boolean().optional().valid('true', 'false').allow("").messages({
                'boolean.base': 'The "isNotify" field must be a boolean.',
                'any.only': 'The "isNotify" field must be "true" or "false".'
            })
        })
    },
    getVotecount: {
        body: Joi.object({
            feudId: Joi.string().required().messages({
                'any.required': 'The "FeudId" field is required.',
                'string.base': 'The "FeudId" field must be a string.',
                'string.empty': 'The "FeudId" field cannot be empty.'
            })
        })
    },
    Votecount: {
        body: Joi.object({
            feudId: Joi.string().required().messages({
                'any.required': 'The "FeudId" field is required.',
                'string.base': 'The "FeudId" field must be a string.',
                'string.empty': 'The "FeudId" field cannot be empty.'
            }),
            optionId: Joi.string().required().messages({
                'any.required': 'The "OptionId" field is required.',
                'string.base': 'The "OptionId" field must be a string.',
                'string.empty': 'The "OptionId" field cannot be empty.'
            }),
            isAdd: Joi.boolean().required().messages({
                'any.required': 'The "isAdd" field is required.',
                'boolean.base': 'The "isAdd" field must be a boolean.',
                'boolean.empty': 'The "isAdd" field cannot be empty.'
            }),
        })
    },
    kickOutModeratorRule: {
        body: Joi.object({
            iskickout: Joi.boolean().required().valid('true','false').messages({
                'any.required': 'The "iskickout" field is required.',
                'boolean.base': 'The "iskickout" field must be a boolean.',
                'boolean.empty': 'The "iskickout" field cannot be empty.',
                'any.only': 'The "iskickout" field must be "true" or "false".'
            }),
            reason: Joi.string().optional().allow("").messages({
                'string.base': 'The "reason" field must be a string.'
            }),
            otherReason: Joi.string().allow('').messages({
                'string.base': 'The "otherReason" field must be a string.'
            }),
            feudId: Joi.string().required().messages({
                'any.required': 'The "FeudId" field is required.',
                'string.base': 'The "FeudId" field must be a string.',
                'string.empty': 'The "FeudId" field cannot be empty.'
            }),
            moderatorId: Joi.string().required().messages({
                'any.required': 'The "moderatorId" field is required.',
                'string.base': 'The "moderatorId" field must be a string.',
                'string.empty': 'The "moderatorId" field cannot be empty.'
            })
        })
    },
    getKickoutCount: {
        body: Joi.object({
            feudId: Joi.string().required().messages({
                'any.required': 'The "FeudId" field is required.',
                'string.base': 'The "FeudId" field must be a string.',
                'string.empty': 'The "FeudId" field cannot be empty.'
            }),
            isCancel: Joi.boolean().required().valid('true','false').messages({
                'any.required': 'The "isCancel" field is required.',
                'boolean.base': 'The "isCancel" field must be a boolean.',
                'boolean.empty': 'The "isCancel" field cannot be empty.',
                'any.only': 'The "isCancel" field must be "true" or "false".'
            }),
            isKickout: Joi.boolean().required().valid('true','false').messages({
                'any.required': 'The "iskickout" field is required.',
                'boolean.base': 'The "iskickout" field must be a boolean.',
                'boolean.empty': 'The "iskickout" field cannot be empty.',
                'any.only': 'The "iskickout" field must be "true" or "false".'
            }),
            ModeratorId: Joi.string().required().messages({
                'any.required': 'The "moderatorId" field is required.',
                'string.base': 'The "moderatorId" field must be a string.',
                'string.empty': 'The "moderatorId" field cannot be empty.'
            })
        })
    },
    addKickoutVote: {
        body: Joi.object({
            feudId: Joi.string().required().messages({
                'any.required': 'The "FeudId" field is required.',
                'string.base': 'The "FeudId" field must be a string.',
                'string.empty': 'The "FeudId" field cannot be empty.'
            }),
            isYes: Joi.boolean().required().valid('true','false').messages({
                'any.required': 'The "isYes" field is required.',
                'boolean.base': 'The "isYes" field must be a boolean.',
                'boolean.empty': 'The "isYes" field cannot be empty.',
                'any.only': 'The "isYes" field must be "true" or "false".'
            }),
            isNo: Joi.boolean().required().valid('true','false').messages({
                'any.required': 'The "isNo" field is required.',
                'boolean.base': 'The "isNo" field must be a boolean.',
                'boolean.empty': 'The "isNo" field cannot be empty.',
                'any.only': 'The "isNo" field must be "true" or "false".'
            })
        })
    },
    endFeudResponse: {
        body: Joi.object({
            feudId: Joi.string().required().messages({
                'any.required': 'The "FeudId" field is required.',
                'string.base': 'The "FeudId" field must be a string.',
                'string.empty': 'The "FeudId" field cannot be empty.'
            }),
            rankType: Joi.number().required().messages({
                'any.required': 'The "rankType" field is required.',
                'number.base': 'The "rankType" field must be a number.',
                'number.empty': 'The "rankType" field cannot be empty.'
            }),
        })
    },
    rentBackskin: {
        body: Joi.object({
            isEnabled: Joi.boolean().required().valid('true', 'false').messages({
                'any.required': 'The "isEnabled" field is required.',
                'boolean.base': 'The "isEnabled" field must be a boolean.',
                'boolean.empty': 'The "isEnabled" field cannot be empty.',
                'any.only': 'The "isEnabled" field must be "true" or "false".'
            }),
            Price: Joi.number().required().messages({
                'any.required': 'The "Price" field is required.',
                'number.base': 'The "Price" field must be a number.',
                'number.empty': 'The "Price" field cannot be empty.'
            }),
            category: Joi.array().items(Joi.string().required()).required().messages({
                'any.required': 'The "category" field is required.',
                'array.base': 'The "category" field must be an array.',
                'array.empty': 'The "category" field cannot be empty.',
                'string.base': 'Each item in the "category" array must be a string.'
            })
        })
    },
    itemVisibility: {
        body: Joi.object({
            seeItem: Joi.number().required().messages({
                'any.required': 'The "seeItem" field is required.',
                'number.base': 'The "seeItem" field must be a number.',
                'number.empty': 'The "seeItem" field cannot be empty.'
            }),
            individual: Joi.array().items(Joi.string().required()).optional().allow("").messages({
                'array.base': 'The "category" field must be an array.',
                'string.base': 'Each item in the "category" array must be a string.'
            })
        })
    },
}