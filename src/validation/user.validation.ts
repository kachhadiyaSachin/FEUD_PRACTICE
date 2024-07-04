import Joi from "joi";

export default {
    login: {
        query: Joi.object({
            countrycode: Joi.string().required(),
            phonenumber: Joi.string().required()
        })
    }
}