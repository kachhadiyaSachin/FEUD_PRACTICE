import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserSetting extends Document {
    userId: Types.ObjectId | string;
    optIns : {
        beModerator: {
            isModerator: boolean
            price: Number,
            moderatorType: Number
        }
    };
    rentSkin : {
        rentprice : Number,
        categories : [string]
    };
    itemVisible : {
        seeItem: Number,
        individual: [String]
    }
};

const UserSettingSchema = new Schema<IUserSetting>({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    optIns : {
        beModerator: {
            isModerator: {type: Boolean, default: false},
            price: {type: Number, default: 0},
            moderatorType: {type: Number, default: 0, enum: [0,1,2,3,4]} // 1 for novice, 2 for Amateur, 3 for Established, 4 for Pro
        }
    },
    rentSkin : {
        rentprice : {type: Number},
        categories : [{type: String, default : [] }]
    },
    itemVisible : {
        seeItem: { type: Number, default: 0, enum: [0,1,2,3,4,5,6] }, // 1 Everyone, 2 Only friends, 3 Only Fans, 4 Friends and fans, 5 No one, 6 Individual
        individual: [{type:String}]
    }
}, {
    versionKey: false
});

const settings = mongoose.model<IUserSetting>("Setting", UserSettingSchema);
export default settings;