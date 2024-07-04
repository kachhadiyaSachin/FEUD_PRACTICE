import { ObjectId } from 'mongodb';
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../interface/user.interface';

const UserSchema: Schema = new Schema<IUser>({
    _id: { type: ObjectId, auto: true },
    email: { type: String, default: ""},
    phonenumber: { type: String, unique: false, required: true },
    phoneOTP: {type: String, default: 123456},
    emailOTP: {type: String, default: 123456},
    phoneOTPtimestamp: {type: Date},
    emailOTPtimestamp: {type: Date},
    first_name: {type: String, default: ""},
    last_name: {type: String, default: ""},
    dob: { type: String, default: ""},
    username: {type: String},
    profilepic: {type: String, default: ""},
    isActive: {type: Boolean, default: true},
    badge: {type: Number, default: 1},
    gender: { type: String},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    bio: {type: String},
    isUsername: {type: Boolean, default: false},
    countrycode: {type: String},
    phoneVerify: {type: Boolean, default: false},
    emailVerify: {type: Boolean, default: false},
    is2FA: {type: Boolean, default: false},
    is2FAverify: {type: Boolean, default: false},
    isQA: {type: Boolean, default: false},
    otp2FA: {type: String, default: 123456},
    OTP2FAtimestamp: {type: Date},
    securityQA : [{
        question: {type: String},
        answer: {type: String},
    }],
    greenBADGE : {
        verifiedSM: {type:String},
        featureinVIDEO: {type:String},
    },
    blueBADGE: {
        feudMedialink: [
            { type: String },
            { type: String },
            { type: String , default:"" },
        ],
        verifiedSMLink: [
            { type: String , default:"" }
        ],
    },
    },{
    versionKey: false
});

const User = mongoose.model<IUser>('feuduser', UserSchema);

export default User;
