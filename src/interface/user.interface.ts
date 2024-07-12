import { Document, Types, Model, Schema, ObjectId } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface IUser extends Document {
    _id: Schema.Types.ObjectId,
    email: String,
    phonenumber: String,
    phoneOTP: String,
    emailOTP: String,
    phoneOTPtimestamp: Date,
    emailOTPtimestamp: Date,
    first_name: String,
    last_name: String,
    dob: String,
    username: String,
    profilepic: String,
    isActive: Boolean,
    badge: Number,
    gender: String,
    city: String,
    state: String,
    country: String,
    bio: String,
    isUsername: Boolean,
    countrycode: String,
    phoneVerify: Boolean,
    emailVerify: Boolean,
    is2FA: Boolean,
    is2FAverify: Boolean,    
    isQA: Boolean,
    otp2FA: String,
    OTP2FAtimestamp: Date,
    securityQA : [{
        question: String,
        answer: String,
    }],
    greenBADGE : {
        verifiedSM: String,
        featureinVIDEO: String,
    },
    blueBADGE : {
        feudMedialink: {
            MediaLink1: String,
            MediaLink2: String,
            FeaturedMediaLink3: String,
        },
        verifiedSMLink: {
            VerifiedSMLink4: String,
        }
    }
}

export interface CustomRequest extends Request{
    user?: any;
    uId?: ObjectId | JwtPayload;
}


