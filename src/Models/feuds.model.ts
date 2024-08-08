import mongoose, { Schema } from "mongoose";
import { IFeuds } from "../Interface/feuds.interface";

const FeudsSchema = new Schema<IFeuds>({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    pollquestion: { type: String},
    options: [{
        option: { type: String },
    }],
    rules: [{
        ruleCheck: { type: Boolean },
        rule: { type: String },
    }],
    feudNow: {type: Boolean, default: false},
    feudLater: {type: Boolean, default: false},
    FeudDate: {type: String, require: true},
    FeudTime: {type: String, require: true},
    endFeudDate: {type: String},
    endFeudTime: {type: String},
    externalEmail: [
        {type: String}
    ],
    phoneNumber: [
        {type: String}
    ],
    JoinFeud: [
        { type: Number, default: 0 }
    ],
    individual: [{type:String}],
    status: {type: Number, default: 0, enum:[0,1,2,3]}, // 0 for not start, 1 for started, 2 for end, 3 for expired
    likeData: [{type: Schema.Types.ObjectId, ref: "User"}],
    saveData: [{type: Schema.Types.ObjectId, ref: "User"}]
}, {
    versionKey: false
});

const feuds = mongoose.model<IFeuds>("Feuds", FeudsSchema);
export default feuds;