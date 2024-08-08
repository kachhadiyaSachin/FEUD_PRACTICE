import mongoose, { Schema } from "mongoose";
import { IJoinFeuds } from "../Interface/joinFeuds.interface";

const JoinFeudSchema = new Schema<IJoinFeuds>({
    feudId: { type: Schema.Types.ObjectId, ref: "Feuds" },
    coHost: [{ type: Schema.Types.ObjectId, ref: "User" }],
    participant: [{
        participantUser: { type: Schema.Types.ObjectId, ref: "User" },
        joinType: { type: Number, enum: [1,2,3,4,5] }, // 1 for participant, 2 for spector, 3 for host, 4 for coHost, 5 for moderator  
        muteAt: {type: Date, default: null},
        muteEnd: {type: Date, default: null},
        status: { type: Number, default: 0, enum:[0,1,2,3]}, // 0 for inactive, 1 for active, 2 for remove, 3 for block
        JoinAt: { type: Date },
        leaveAt: { type: Date, default: null }
    }],
    spectors: [{
        spectorUser: { type: Schema.Types.ObjectId, ref: "User" },
        isAlert: Boolean,
        JoinAt: { type: Date },
        leaveAt: { type: Date, default: null }
    }],
    inviteModerator: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    moderator: {
        moderatorUser: { type: Schema.Types.ObjectId, ref: "User" },
        isAlert: Boolean,
        removeAt: Date,
        agree: [{ type: Schema.Types.ObjectId, ref: "User" }],
        disagree: [{ type: Schema.Types.ObjectId, ref: "User" }],
        muteAt: {type: Date, default: null},
        muteEnd: {type: Date, default: null},
        status: {type: Number, default: 0} // 0 for none, 1 for added moderator, 2 for pending moderator
    },
    removeModerator: {
        removeModeratorUser: { type: Schema.Types.ObjectId, ref: "User" },
        removeAt: Date,
    },
}, {
    versionKey: false
});

const JoinFeud = mongoose.model<IJoinFeuds>("JoinFeud", JoinFeudSchema);
export default JoinFeud;