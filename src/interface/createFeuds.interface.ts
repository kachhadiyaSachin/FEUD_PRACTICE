import { Document, Types, Model, Schema, ObjectId } from 'mongoose';

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
    JoinFeud: [
        Number
    ],
    individual: [
        String
    ],
    inviteModerator: [
        String
    ],
    totalUser: Number
}