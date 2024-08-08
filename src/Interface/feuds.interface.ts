import { Document, Types, Schema } from 'mongoose';

export interface IFeuds extends Document {
    _id: Schema.Types.ObjectId,
    userId: Types.ObjectId | string;
    title: String,
    pollquestion: String,
    options: [{
        option: String,
    }],
    rules : [{
        ruleCheck: boolean,
        rule: String,
    }],
    feudNow: boolean,
    feudLater: boolean,
    FeudDate: String,
    FeudTime: String,
    endFeudDate: string,
    endFeudTime: String,
    externalEmail: [
        String
    ],
    phoneNumber: [
        String
    ],
    JoinFeud: [
        Number
    ],
    individual: [
        String
    ],
    status: Number,
    likeData: [ Types.ObjectId],
    saveData: [ Types.ObjectId],
}