import mongoose, { Schema } from "mongoose";
import { IFeuds } from "../interface/createFeuds.interface";

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
    totalUser: {type: Number, default:0},
    status: {type: Number, default: 0, enum:[0,1,2,3]}
}, {
    versionKey: false
});

const feuds = mongoose.model<IFeuds>("Feuds", FeudsSchema);
export default feuds;