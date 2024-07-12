import mongoose, { Schema, Document, Types } from "mongoose";
import { IFeuds } from "../interface/createFeuds.interface";

const feuduserRequestSchema = new Schema<IFeuds>({
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
    JoinFeud: [
        { type: Number, default: 0 }
    ],
    individual: [{type:String}],
    inviteModerator: [{type:String, default: []}]
}, {
    versionKey: false
});

const feuds = mongoose.model<IFeuds>("Feuds", feuduserRequestSchema);
export default feuds;