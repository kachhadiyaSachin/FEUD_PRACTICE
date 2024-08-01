import { Document, Types, Model, Schema, ObjectId } from 'mongoose';

export interface IJoinFeuds extends Document {
    feudId: Schema.Types.ObjectId,
    coHost: [
        Schema.Types.ObjectId
    ],
    participant: [{
        participantUser: Schema.Types.ObjectId,
        joinType: Number,
        muteAt: Date,
        muteEnd: Date,
        status: Number
    }],
    spectors: [{
        spectorUser: Schema.Types.ObjectId,
        isAlert: Boolean,
    }],
    inviteModerator: [
        Schema.Types.ObjectId
    ],
    moderator: {
        moderatorUser: Schema.Types.ObjectId,
        isAlert: Boolean,
        removeAt: Date,
        agree: Schema.Types.ObjectId,
        disagree: Schema.Types.ObjectId,
        muteAt: Date,
        muteEnd: Date,
        status: Number
    },
    removeModerator: {
        removeModeratorUser: Schema.Types.ObjectId,
        removeAt: Date,
    },
}