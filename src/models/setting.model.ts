import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserSetting extends Document {
    userId: Types.ObjectId | string;
    optIns : {
        beModerator: {
            isModerator: boolean
            price: Number,
            moderatorType: Number
        }
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
    }
}, {
    versionKey: false
});

const settings = mongoose.model<IUserSetting>("Setting", UserSettingSchema);
export default settings;