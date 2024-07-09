// import Joi from "joi";

// export default {
//     createFeuds: {
//         body: Joi.object({
//             title: Joi.string().required(),
//             pollquestion: Joi.string().required(),
//             options: Joi.array().required(),
//             rules: Joi.array().required(),
//             feudNow: Joi.string().allow("").optional(),
//             feudLater: Joi.string().allow("").optional(),
//             FeudDate: Joi.string().required(),
//             FeudTime: Joi.string().required(),
//             JoinFeud: Joi.array().required(),
//             individual: Joi.string().allow("").optional(),
//             externalEmail: Joi.string().allow("").optional(),
//             phoneNumber: Joi.string().allow("").optional(),
//             inviteModerator: Joi.array().required()
//         })
//     }
// }