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
    externalEmail: String,
    phoneNumber: String,
    inviteModerator: [
        String
    ]
}

export interface IFeudsNofification extends Document {
    userId: Types.ObjectId | string;
    profilePic: string;
    badge: Number;
    message: String;
    title: String;
};


export interface IFeudsOptioncount extends Document {
    feudId: Types.ObjectId | string;
    optionId: Types.ObjectId | string;
    optionCount: [ String ];
};